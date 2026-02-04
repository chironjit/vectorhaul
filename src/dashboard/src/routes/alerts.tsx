import { Component, For, createMemo } from 'solid-js';
import { A } from '@solidjs/router';
import { assets, assetEvents } from '~/data/dummy-data';

type Severity = 'critical' | 'warning' | 'info';

const formatRelativeTime = (timestamp: string): string => {
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

const getSeverity = (type: string): Severity => {
  switch (type) {
    case 'geofence_exit':
      return 'warning';
    case 'status_change':
      return 'warning';
    case 'maintenance':
      return 'critical';
    default:
      return 'info';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'location_update':
      return 'Location Update';
    case 'speed_change':
      return 'Speed Change';
    case 'geofence_entry':
      return 'Geofence Entry';
    case 'geofence_exit':
      return 'Geofence Exit';
    case 'status_change':
      return 'Status Change';
    case 'maintenance':
      return 'Maintenance';
    default:
      return 'Event';
  }
};

const severityBadge = (severity: Severity) => {
  switch (severity) {
    case 'critical':
      return 'badge-error';
    case 'warning':
      return 'badge-warning';
    default:
      return 'badge-info';
  }
};

const AlertsPage: Component = () => {
  const alertItems = createMemo(() => {
    const rows: {
      id: string;
      assetId: string;
      assetName: string;
      type: string;
      description: string;
      timestamp: string;
      severity: Severity;
      status: 'open' | 'acknowledged';
    }[] = [];

    assets.forEach(asset => {
      if (asset.status === 'maintenance') {
        rows.push({
          id: `${asset.id}-maintenance`,
          assetId: asset.id,
          assetName: asset.name,
          type: 'maintenance',
          description: 'Asset requires maintenance review',
          timestamp: asset.last_update,
          severity: 'critical',
          status: 'open',
        });
      }
    });

    Object.values(assetEvents).forEach(events => {
      events.forEach(event => {
        const asset = assets.find(a => a.id === event.asset_id);
        rows.push({
          id: event.id,
          assetId: event.asset_id,
          assetName: asset?.name ?? event.asset_id,
          type: event.type,
          description: event.description,
          timestamp: event.timestamp,
          severity: getSeverity(event.type),
          status: 'open',
        });
      });
    });

    return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  const summary = createMemo(() => {
    const items = alertItems();
    return {
      total: items.length,
      critical: items.filter(i => i.severity === 'critical').length,
      warning: items.filter(i => i.severity === 'warning').length,
      info: items.filter(i => i.severity === 'info').length,
    };
  });

  return (
    <div class="flex flex-col h-full w-full bg-base-100">
      <div class="flex items-center justify-between p-4 border-b border-base-200">
        <div>
          <h1 class="text-2xl font-bold">Alerts</h1>
          <p class="text-sm text-base-content/70">Operational alerts and event monitoring</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm">Acknowledge All</button>
          <A href="/map" class="btn btn-primary btn-sm">View Map</A>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-base-200 bg-base-200/30">
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Total</div>
          <div class="text-xl font-semibold">{summary().total}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Critical</div>
          <div class="text-xl font-semibold text-error">{summary().critical}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Warnings</div>
          <div class="text-xl font-semibold text-warning">{summary().warning}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Info</div>
          <div class="text-xl font-semibold text-info">{summary().info}</div>
        </div>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table table-zebra w-full">
          <thead class="sticky top-0 bg-base-200 z-10">
            <tr>
              <th>Severity</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Description</th>
              <th>Last Update</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <For each={alertItems()}>
              {(alert) => (
                <tr class="hover">
                  <td>
                    <span class={`badge badge-sm ${severityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td>
                    <div class="flex flex-col">
                      <span class="font-medium">{alert.assetName}</span>
                      <span class="text-xs text-base-content/60">{alert.assetId}</span>
                    </div>
                  </td>
                  <td>{getTypeLabel(alert.type)}</td>
                  <td class="max-w-xl truncate">{alert.description}</td>
                  <td class="text-sm text-base-content/70">{formatRelativeTime(alert.timestamp)}</td>
                  <td>
                    <span class="badge badge-ghost badge-sm capitalize">{alert.status}</span>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsPage;
