import { Component, For, JSX, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { A } from '@solidjs/router';
import MapView from '~/components/map/MapView';
import SpeedChart from '~/components/charts/SpeedChart';
import StatsPanel from '~/components/stats/StatsPanel';
import { assets, dashboardStats } from '~/lib/stores';
import { assetEvents, generateSpeedData, geofences } from '~/data/dummy-data';
import type { Asset, Event } from '~/types';

const formatRelativeTime = (timestamp?: string): string => {
  if (!timestamp) return 'Unknown';
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const getActionLabel = (asset: Asset) => {
  if (asset.status === 'maintenance') return 'Maintenance';
  if (asset.status === 'inactive') return 'Offline';
  if ((asset.current_location?.speed ?? 0) === 0) return 'Stopped';
  return 'Monitor';
};

const getActionBadge = (asset: Asset) => {
  if (asset.status === 'maintenance') return 'badge-error';
  if (asset.status === 'inactive') return 'badge-ghost';
  if ((asset.current_location?.speed ?? 0) === 0) return 'badge-warning';
  return 'badge-info';
};

// Widget size definitions: 'large' widgets prefer 2 units, 'small' prefer 1 unit
const widgetSizes: Record<string, 'large' | 'small'> = {
  stats: 'large',
  speed: 'large',
  map: 'large',
  action: 'small',
  routes: 'small',
  snapshot: 'small',
  events: 'small',
  links: 'small',
};

const Overview: Component = () => {
  const stats = dashboardStats;
  const defaultOrder = ['stats', 'speed', 'action', 'routes', 'map', 'snapshot', 'events', 'links'];
  const [widgetOrder, setWidgetOrder] = createSignal<string[]>(defaultOrder);
  const [expandedWidgets, setExpandedWidgets] = createSignal<string[]>([]);
  const [draggingId, setDraggingId] = createSignal<string | null>(null);
  const [dropTargetId, setDropTargetId] = createSignal<string | null>(null);
  const [dropPosition, setDropPosition] = createSignal<'before' | 'after' | null>(null);
  let pointerMoveHandler: ((event: PointerEvent) => void) | null = null;
  let pointerUpHandler: (() => void) | null = null;
  let pointerCancelHandler: (() => void) | null = null;
  let capturedElement: HTMLElement | null = null;
  let capturedPointerId: number | null = null;

  // Calculate dynamic layout based on widget order
  const widgetLayout = createMemo(() => {
    const order = widgetOrder();
    const expanded = expandedWidgets();
    const layout: { id: string; span: number }[] = [];
    let i = 0;

    while (i < order.length) {
      // Group widgets into rows (max 4 units per row)
      const rowWidgets: { id: string; weight: number }[] = [];
      let rowWeight = 0;

      while (i < order.length) {
        const widgetId = order[i];
        // If expanded, force weight to 4. Otherwise use default size.
        const isExpanded = expanded.includes(widgetId);
        const weight = isExpanded ? 4 : (widgetSizes[widgetId] === 'large' ? 2 : 1);
        
        if (rowWeight + weight <= 4) {
          rowWidgets.push({ id: widgetId, weight });
          rowWeight += weight;
          i++;
          // If this widget took up the whole row, break immediately
          if (weight === 4) break;
        } else {
          break;
        }
      }

      // Calculate spans for this row
      const emptySpace = 4 - rowWeight;
      
      if (rowWidgets.length === 1) {
        // Single widget takes full width
        layout.push({ id: rowWidgets[0].id, span: 4 });
      } else if (emptySpace > 0) {
        // Distribute extra space: prefer giving to large widgets first
        const largeWidgets = rowWidgets.filter(w => widgetSizes[w.id] === 'large');
        const extraPerLarge = largeWidgets.length > 0 
          ? Math.floor(emptySpace / largeWidgets.length)
          : 0;
        let remainingExtra = largeWidgets.length > 0 
          ? emptySpace % largeWidgets.length
          : emptySpace;

        for (const widget of rowWidgets) {
          let span = widget.weight;
          if (widgetSizes[widget.id] === 'large') {
            span += extraPerLarge;
            if (remainingExtra > 0) {
              span++;
              remainingExtra--;
            }
          }
          layout.push({ id: widget.id, span });
        }

        // If no large widgets, give extra to the first small widget
        if (largeWidgets.length === 0 && remainingExtra > 0) {
          layout[layout.length - rowWidgets.length].span += remainingExtra;
        }
      } else {
        // Row is exactly full
        for (const widget of rowWidgets) {
          layout.push({ id: widget.id, span: widget.weight });
        }
      }
    }

    return layout;
  });

  const toggleExpanded = (id: string) => {
    setExpandedWidgets(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      return [...prev, id];
    });
  };

  const getStoredOrder = () => {
    if (typeof window === 'undefined') return { order: null, expanded: null };
    try {
      const storedOrder = localStorage.getItem('overview-widget-order');
      const storedExpanded = localStorage.getItem('overview-widget-expanded');
      
      let order = null;
      let expanded = null;

      if (storedOrder) {
        const parsed = JSON.parse(storedOrder);
        if (Array.isArray(parsed)) {
          const unique = Array.from(new Set(parsed.filter((id: string) => defaultOrder.includes(id))));
          const missing = defaultOrder.filter(id => !unique.includes(id));
          order = [...unique, ...missing];
        }
      }

      if (storedExpanded) {
        const parsed = JSON.parse(storedExpanded);
        if (Array.isArray(parsed)) {
          expanded = parsed.filter((id: string) => defaultOrder.includes(id));
        }
      }

      return { order, expanded };
    } catch {
      return { order: null, expanded: null };
    }
  };

  onMount(() => {
    const { order, expanded } = getStoredOrder();
    if (order) setWidgetOrder(order);
    if (expanded) setExpandedWidgets(expanded);
  });

  createEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('overview-widget-order', JSON.stringify(widgetOrder()));
    localStorage.setItem('overview-widget-expanded', JSON.stringify(expandedWidgets()));
  });

  const handleDrop = (targetId: string) => {
    const sourceId = draggingId();
    if (!sourceId || sourceId === targetId) return;
    
    const position = dropPosition();
    const next = widgetOrder().filter(id => id !== sourceId);
    const targetIndex = next.indexOf(targetId);
    
    if (targetIndex === -1) return;
    
    // Insert before or after based on position
    const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
    next.splice(insertIndex, 0, sourceId);
    
    setWidgetOrder(next);
  };

  const cleanupPointerHandlers = () => {
    if (typeof window !== 'undefined') {
      if (pointerMoveHandler) {
        window.removeEventListener('pointermove', pointerMoveHandler);
        pointerMoveHandler = null;
      }
      if (pointerUpHandler) {
        window.removeEventListener('pointerup', pointerUpHandler);
        pointerUpHandler = null;
      }
      if (pointerCancelHandler) {
        window.removeEventListener('pointercancel', pointerCancelHandler);
        pointerCancelHandler = null;
      }
    }
    if (capturedElement && capturedPointerId !== null) {
      try {
        capturedElement.releasePointerCapture(capturedPointerId);
      } catch {
        // Pointer capture may already be released
      }
    }
    capturedElement = null;
    capturedPointerId = null;
    if (typeof document !== 'undefined') {
      document.body.style.userSelect = '';
    }
    setDraggingId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const startPointerDrag = (id: string, event: PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    
    const target = event.currentTarget as HTMLElement;
    if (target && typeof target.setPointerCapture === 'function') {
      try {
        target.setPointerCapture(event.pointerId);
        capturedElement = target;
        capturedPointerId = event.pointerId;
      } catch {
        // Pointer capture may not be supported
      }
    }
    
    setDraggingId(id);
    document.body.style.userSelect = 'none';

    pointerMoveHandler = (moveEvent: PointerEvent) => {
      const element = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
      const dropTarget = element?.closest?.('[data-widget-id]') as HTMLElement | null;
      
      if (dropTarget) {
        const rect = dropTarget.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        // Check if we are closer to the left (before) or right (after)
        // For stacked items (mobile), we could also check Y axis, but X is usually sufficient for grid flow
        // Let's use both: if it's strictly a column layout (mobile), Y matters more.
        
        const isAfter = moveEvent.clientX > midX;
        setDropPosition(isAfter ? 'after' : 'before');
        setDropTargetId(dropTarget.dataset.widgetId || null);
      } else {
        setDropTargetId(null);
        setDropPosition(null);
      }
    };

    pointerUpHandler = () => {
      const targetId = dropTargetId();
      if (targetId && targetId !== id) {
        handleDrop(targetId);
      }
      cleanupPointerHandlers();
    };

    pointerCancelHandler = () => {
      cleanupPointerHandlers();
    };

    window.addEventListener('pointermove', pointerMoveHandler);
    window.addEventListener('pointerup', pointerUpHandler);
    window.addEventListener('pointercancel', pointerCancelHandler);
  };

  onCleanup(() => {
    cleanupPointerHandlers();
  });

  const actionAssets = createMemo(() => {
    const now = Date.now();
    const scored = assets()
      .filter(asset => {
        if (asset.status === 'maintenance' || asset.status === 'inactive') return true;
        if (asset.status === 'active' && (asset.current_location?.speed ?? 0) === 0) {
          const lastUpdateMs = new Date(asset.last_update).getTime();
          return now - lastUpdateMs > 10 * 60 * 1000;
        }
        return false;
      })
      .map(asset => {
        const severity =
          asset.status === 'maintenance' ? 3 :
          asset.status === 'inactive' ? 2 :
          1;
        return { asset, severity };
      })
      .sort((a, b) => b.severity - a.severity);

    return scored.slice(0, 5).map(item => item.asset);
  });

  const recentEvents = createMemo(() => {
    const allEvents = Object.values(assetEvents).flat();
    return allEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);
  });

  const routeProgress = createMemo(() => {
    return assets()
      .filter(asset => asset.route)
      .sort((a, b) => (b.route?.progress ?? 0) - (a.route?.progress ?? 0))
      .slice(0, 4);
  });

  const averageSpeed = createMemo(() => {
    const speeds = assets()
      .map(asset => asset.current_location?.speed ?? 0)
      .filter(speed => speed > 0);
    if (!speeds.length) return 0;
    return Math.round((speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length) * 10) / 10;
  });

  const speedSeries = createMemo(() => {
    const sample = assets()[0]?.id || 'TRUCK-SG-001';
    return generateSpeedData(sample);
  });

  const geofenceActivity = createMemo(() => {
    const allEvents = Object.values(assetEvents).flat();
    return allEvents.filter(event =>
      event.type === 'geofence_entry' || event.type === 'geofence_exit'
    ).length;
  });

  const maintenanceCount = createMemo(() => assets().filter(asset => asset.status === 'maintenance').length);
  const inactiveCount = createMemo(() => assets().filter(asset => asset.status === 'inactive').length);
  const movingCount = createMemo(() => assets().filter(asset => (asset.current_location?.speed ?? 0) > 0).length);

  const getSpanClass = (span: number) => {
    switch (span) {
      case 1: return 'lg:col-span-1';
      case 2: return 'lg:col-span-2';
      case 3: return 'lg:col-span-3';
      case 4: return 'lg:col-span-4';
      default: return 'lg:col-span-1';
    }
  };

  const OverviewWidget: Component<{
    id: string;
    title: string;
    span?: number;
    framed?: boolean;
    children: JSX.Element;
  }> = (props) => {
    const framed = props.framed !== false;
    const isExpanded = () => expandedWidgets().includes(props.id);
    const spanClass = () => getSpanClass(props.span ?? 1);
    
    // Determine visual cues for drop target
    const isDropTarget = () => dropTargetId() === props.id;
    const position = () => isDropTarget() ? dropPosition() : null;
    
    return (
      <div
        class={`relative transition-all duration-300 ${spanClass()}`}
        data-widget-id={props.id}
      >
        {/* Drop Indicators */}
        <Show when={isDropTarget() && position() === 'before'}>
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary z-10 rounded-full -ml-3"></div>
        </Show>
        <Show when={isDropTarget() && position() === 'after'}>
          <div class="absolute right-0 top-0 bottom-0 w-1 bg-primary z-10 rounded-full -mr-3"></div>
        </Show>

        <div
          class={`h-full flex flex-col ${framed ? 'rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm' : ''} ${
            isDropTarget() ? 'ring-2 ring-primary/20' : ''
          } ${draggingId() === props.id ? 'opacity-40 grayscale' : ''}`}
        >
          <div
            class={`flex items-center justify-between ${framed ? 'mb-3' : 'mb-2'}`}
          >
            <div 
              class="flex items-center gap-2 cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-base-200/50"
              onPointerDown={(event) => startPointerDrag(props.id, event)}
              style={{ 'touch-action': 'none' }}
            >
              <div
                class="text-base-content/40"
                aria-label="Drag to reorder"
                title="Drag to reorder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="7" r="1.5" />
                  <circle cx="15" cy="7" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" />
                  <circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="17" r="1.5" />
                  <circle cx="15" cy="17" r="1.5" />
                </svg>
              </div>
              <div class="text-sm font-semibold select-none">{props.title}</div>
            </div>
            
            <button
              class="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-primary"
              onClick={() => toggleExpanded(props.id)}
              title={isExpanded() ? "Collapse width" : "Expand to full width"}
            >
              <Show when={isExpanded()} fallback={
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              }>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10l-2 2m0 0l2 2m-2-2h12m-2-6l2 2m0 0l-2 2m2-2H5" />
                </svg>
              </Show>
            </button>
          </div>
          <div class="flex-1 min-h-0">
            {props.children}
          </div>
        </div>
      </div>
    );
  };

  const renderWidget = (id: string, span: number): JSX.Element => {
    switch (id) {
      case 'stats':
        return (
          <OverviewWidget id="stats" title="Key Metrics" span={span} framed={false}>
            <StatsPanel />
          </OverviewWidget>
        );
      case 'speed':
        return (
          <OverviewWidget id="speed" title="Fleet Speed Trend" span={span}>
            <div class="flex items-center justify-between mb-3">
              <div class="text-xs text-base-content/60">Aggregate speed profile across active assets</div>
              <div class="text-right">
                <div class="text-xs text-base-content/60">Avg. Speed</div>
                <div class="text-lg font-semibold text-info">{averageSpeed()} km/h</div>
              </div>
            </div>
            <SpeedChart data={speedSeries()} height="220px" />
          </OverviewWidget>
        );
      case 'action':
        return (
          <OverviewWidget id="action" title="Action Required" span={span}>
            <div class="flex items-center justify-between mb-3">
              <div class="text-xs text-base-content/60">Prioritized operational issues</div>
              <A href="/alerts" class="text-xs text-primary">View alerts</A>
            </div>
            <div class="space-y-3">
              <Show
                when={actionAssets().length > 0}
                fallback={<div class="text-sm text-base-content/60">No urgent actions right now.</div>}
              >
                <For each={actionAssets()}>
                  {(asset) => (
                    <div class="flex items-center justify-between gap-2 rounded-xl border border-base-200 p-3">
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <div class="text-sm font-medium truncate">{asset.name}</div>
                          <span class={`badge badge-xs ${getActionBadge(asset)}`}>{getActionLabel(asset)}</span>
                        </div>
                        <div class="text-xs text-base-content/60 truncate">
                          {asset.current_location?.address ?? 'Unknown location'}
                        </div>
                      </div>
                      <A href={`/assets/${asset.id}`} class="btn btn-xs btn-outline">Inspect</A>
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </OverviewWidget>
        );
      case 'routes':
        return (
          <OverviewWidget id="routes" title="Active Routes" span={span}>
            <div class="text-xs text-base-content/60 mb-3">Top in-progress deliveries</div>
            <div class="space-y-3">
              <Show
                when={routeProgress().length > 0}
                fallback={<div class="text-sm text-base-content/60">No routes in progress.</div>}
              >
                <For each={routeProgress()}>
                  {(asset) => (
                    <div class="rounded-xl border border-base-200 p-3">
                      <div class="flex items-center justify-between text-sm">
                        <span class="font-medium truncate">{asset.name}</span>
                        <span class="text-xs text-base-content/60">{Math.round(asset.route?.progress ?? 0)}%</span>
                      </div>
                      <div class="text-xs text-base-content/60 mt-1">
                        {asset.route?.origin} → {asset.route?.destination}
                      </div>
                      <progress
                        class="progress progress-primary mt-2"
                        value={asset.route?.progress ?? 0}
                        max="100"
                      />
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </OverviewWidget>
        );
      case 'map':
        return (
          <OverviewWidget id="map" title="Map Overview" span={span}>
            <div class="flex items-center justify-between mb-3">
              <div class="text-xs text-base-content/60">Live asset distribution with geofence context</div>
              <A href="/map" class="text-xs text-primary">Open full map</A>
            </div>
            <MapView
              assets={assets()}
              geofences={geofences}
              showGeofences={true}
              showRouteTrails={false}
              height="320px"
            />
          </OverviewWidget>
        );
      case 'snapshot':
        return (
          <OverviewWidget id="snapshot" title="Operational Snapshot" span={span}>
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-base-content/70">Assets moving</span>
                <span class="font-semibold">{movingCount()}</span>
              </div>
              <progress class="progress progress-info w-full" value={movingCount()} max={stats().totalAssets} />

              <div class="flex items-center justify-between">
                <span class="text-base-content/70">Maintenance queue</span>
                <span class="font-semibold text-warning">{maintenanceCount()}</span>
              </div>
              <progress class="progress progress-warning w-full" value={maintenanceCount()} max={stats().totalAssets} />

              <div class="flex items-center justify-between">
                <span class="text-base-content/70">Offline assets</span>
                <span class="font-semibold text-base-content/60">{inactiveCount()}</span>
              </div>
              <progress class="progress w-full" value={inactiveCount()} max={stats().totalAssets} />

              <div class="flex items-center justify-between">
                <span class="text-base-content/70">Geofence activity</span>
                <span class="font-semibold">{geofenceActivity()}</span>
              </div>
              <div class="text-xs text-base-content/60">Entries/exits recorded today</div>
            </div>
          </OverviewWidget>
        );
      case 'events':
        return (
          <OverviewWidget id="events" title="Recent Events" span={span}>
            <div class="flex items-center justify-between mb-3">
              <div class="text-xs text-base-content/60">Latest movement and status updates</div>
              <A href="/alerts" class="text-xs text-primary">All events</A>
            </div>
            <div class="space-y-3">
              <For each={recentEvents()}>
                {(event: Event) => (
                  <div class="flex items-start gap-3 rounded-xl border border-base-200 p-3">
                    <div class="h-8 w-8 rounded-xl bg-base-200 flex items-center justify-center text-sm">
                      {event.type === 'geofence_entry' ? '📍' :
                        event.type === 'geofence_exit' ? '📤' :
                        event.type === 'speed_change' ? '⚡' :
                        event.type === 'status_change' ? '🔄' :
                        '📌'}
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm font-medium">{event.description}</div>
                      <div class="text-xs text-base-content/60">{formatRelativeTime(event.timestamp)}</div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </OverviewWidget>
        );
      case 'links':
        return (
          <OverviewWidget id="links" title="Quick Links" span={span}>
            <div class="grid grid-cols-2 gap-3">
              <A href="/assets" class="btn btn-sm btn-outline justify-start">Assets</A>
              <A href="/alerts" class="btn btn-sm btn-outline justify-start">Alerts</A>
              <A href="/geofences" class="btn btn-sm btn-outline justify-start">Geofences</A>
              <A href="/reports" class="btn btn-sm btn-outline justify-start">Reports</A>
              <A href="/integrations" class="btn btn-sm btn-outline justify-start">Integrations</A>
              <A href="/map" class="btn btn-sm btn-outline justify-start">Map View</A>
            </div>
          </OverviewWidget>
        );
      default:
        return <></>;
    }
  };

  return (
    <div class="flex flex-col gap-6 p-4 lg:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="text-sm text-base-content/60 uppercase tracking-wide">Operations Overview</div>
          <h1 class="text-2xl font-semibold mt-1">Fleet Command Dashboard</h1>
          <p class="text-sm text-base-content/60 mt-1">
            Live operational status, exceptions, and performance signals.
          </p>
          <p class="text-xs text-base-content/50 mt-2">
            Drag the card header to reorder the layout.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-sm btn-outline">Create Alert</button>
          <button class="btn btn-sm btn-primary">Generate Report</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <For each={widgetLayout()}>
          {(item) => renderWidget(item.id, item.span)}
        </For>
      </div>
    </div>
  );
};

export default Overview;
