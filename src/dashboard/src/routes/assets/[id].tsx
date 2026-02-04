import { Component, Show, createMemo } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import MapView from '~/components/map/MapView';
import SpeedChart from '~/components/charts/SpeedChart';
import EventsTimeline from '~/components/assets/EventsTimeline';
import { 
  getAssetById, 
  getLocationHistory, 
  getAssetEvents, 
  generateSpeedData,
  geofences 
} from '~/data/dummy-data';
import type { Asset } from '~/types';

// Asset type to icon mapping
const getAssetIcon = (type: Asset['type']): string => {
  switch (type) {
    case 'truck': return '🚛';
    case 'van': return '🚐';
    case 'motorcycle': return '🏍️';
    case 'ship': return '🚢';
    case 'aircraft': return '✈️';
    default: return '📍';
  }
};

// Status badge styling
const getStatusBadge = (status: Asset['status']) => {
  switch (status) {
    case 'active':
      return 'badge-success';
    case 'inactive':
      return 'badge-ghost';
    case 'maintenance':
      return 'badge-warning';
    default:
      return 'badge-ghost';
  }
};

// Format relative time
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

// Format coordinates
const formatCoords = (lat: number, lng: number): string => {
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
};

// Get heading direction
const getHeadingDirection = (heading: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
};

const AssetDetailPage: Component = () => {
  const params = useParams<{ id: string }>();
  
  const asset = createMemo(() => getAssetById(params.id));
  const locationHistory = createMemo(() => getLocationHistory(params.id));
  const events = createMemo(() => getAssetEvents(params.id));
  const speedData = createMemo(() => generateSpeedData(params.id));
  
  // Convert location history to route trail coordinates
  const routeTrail = createMemo((): [number, number][] => {
    const history = locationHistory();
    if (!history) return [];
    return history.locations.map(loc => [loc.longitude, loc.latitude]);
  });

  // Calculate stats from speed data
  const speedStats = createMemo(() => {
    const data = speedData();
    const speeds = data.map(d => d.speed).filter(s => s > 0);
    if (speeds.length === 0) return { avg: 0, max: 0, distance: 0 };
    
    const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const max = Math.max(...speeds);
    // Rough distance estimate (speed * time)
    const distance = avg * (data.length * 0.5); // 30 min intervals
    
    return {
      avg: Math.round(avg * 10) / 10,
      max: Math.round(max * 10) / 10,
      distance: Math.round(distance),
    };
  });

  return (
    <Show 
      when={asset()}
      fallback={
        <div class="flex flex-col items-center justify-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-semibold mb-2">Asset Not Found</h2>
          <p class="text-base-content/70 mb-4">The asset you're looking for doesn't exist.</p>
          <A href="/assets" class="btn btn-primary">Back to Assets</A>
        </div>
      }
    >
      {(assetData) => (
        <div class="flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Left Panel - Asset Info */}
          <div class="w-full lg:w-96 flex-shrink-0 overflow-y-auto border-r border-base-200 bg-base-100">
            {/* Header */}
            <div class="p-4 border-b border-base-200 sticky top-0 bg-base-100 z-10">
              <div class="flex items-center gap-2 mb-2">
                <A href="/assets" class="btn btn-ghost btn-sm btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </A>
                <span class="text-2xl">{getAssetIcon(assetData().type)}</span>
                <div class="flex-1">
                  <h1 class="text-lg font-bold">{assetData().name}</h1>
                  <p class="text-sm text-base-content/60">{assetData().id}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class={`badge ${getStatusBadge(assetData().status)}`}>
                  {assetData().status}
                </span>
                <span class="text-sm text-base-content/60">
                  Updated {formatRelativeTime(assetData().last_update)}
                </span>
              </div>
            </div>

            {/* Location Info */}
            <div class="p-4 border-b border-base-200">
              <h2 class="font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Current Location
              </h2>
              <Show when={assetData().current_location} fallback={<p class="text-sm text-base-content/50">No location data</p>}>
                {(loc) => (
                  <div class="space-y-2">
                    <div>
                      <p class="text-sm text-base-content/60">Address</p>
                      <p class="font-medium">{loc().address}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <p class="text-sm text-base-content/60">Coordinates</p>
                        <p class="font-mono text-sm">{formatCoords(loc().latitude, loc().longitude)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-base-content/60">Accuracy</p>
                        <p class="font-mono text-sm">±{loc().accuracy}m</p>
                      </div>
                    </div>
                  </div>
                )}
              </Show>
            </div>

            {/* Movement Info */}
            <div class="p-4 border-b border-base-200">
              <h2 class="font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Movement
              </h2>
              <Show when={assetData().current_location} fallback={<p class="text-sm text-base-content/50">No movement data</p>}>
                {(loc) => (
                  <div class="grid grid-cols-3 gap-2">
                    <div class="stat bg-base-200 rounded-lg p-3">
                      <div class="stat-title text-xs">Speed</div>
                      <div class={`stat-value text-lg ${loc().speed > 0 ? 'text-success' : 'text-warning'}`}>
                        {loc().speed}
                      </div>
                      <div class="stat-desc text-xs">km/h</div>
                    </div>
                    <div class="stat bg-base-200 rounded-lg p-3">
                      <div class="stat-title text-xs">Heading</div>
                      <div class="stat-value text-lg">{Math.round(loc().heading)}°</div>
                      <div class="stat-desc text-xs">{getHeadingDirection(loc().heading)}</div>
                    </div>
                    <div class="stat bg-base-200 rounded-lg p-3">
                      <div class="stat-title text-xs">Status</div>
                      <div class={`stat-value text-lg ${loc().speed > 0 ? 'text-success' : 'text-warning'}`}>
                        {loc().speed > 0 ? '●' : '○'}
                      </div>
                      <div class="stat-desc text-xs">{loc().speed > 0 ? 'Moving' : 'Stopped'}</div>
                    </div>
                  </div>
                )}
              </Show>
            </div>

            {/* Driver Info */}
            <Show when={assetData().driver}>
              {(driver) => (
                <div class="p-4 border-b border-base-200">
                  <h2 class="font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Driver
                  </h2>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content w-10 rounded-full">
                        <span>{driver().name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <p class="font-medium">{driver().name}</p>
                      <p class="text-sm text-base-content/60">{driver().phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </Show>

            {/* Route Info */}
            <Show when={assetData().route}>
              {(route) => (
                <div class="p-4 border-b border-base-200">
                  <h2 class="font-semibold mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Route
                  </h2>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-sm badge-ghost">From</span>
                      <span class="text-sm">{route().origin}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-sm badge-primary">To</span>
                      <span class="text-sm">{route().destination}</span>
                    </div>
                    <div class="mt-3">
                      <div class="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span class="font-medium">{route().progress}%</span>
                      </div>
                      <progress class="progress progress-primary w-full" value={route().progress} max="100"></progress>
                    </div>
                  </div>
                </div>
              )}
            </Show>

            {/* Speed Chart */}
            <div class="p-4 border-b border-base-200">
              <h2 class="font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Speed (Last 24h)
              </h2>
              <div class="grid grid-cols-3 gap-2 mb-3">
                <div class="text-center p-2 bg-base-200 rounded">
                  <div class="text-xs text-base-content/60">Avg</div>
                  <div class="font-semibold">{speedStats().avg} km/h</div>
                </div>
                <div class="text-center p-2 bg-base-200 rounded">
                  <div class="text-xs text-base-content/60">Max</div>
                  <div class="font-semibold">{speedStats().max} km/h</div>
                </div>
                <div class="text-center p-2 bg-base-200 rounded">
                  <div class="text-xs text-base-content/60">Distance</div>
                  <div class="font-semibold">{speedStats().distance} km</div>
                </div>
              </div>
              <SpeedChart data={speedData()} height="150px" />
            </div>

            {/* Events Timeline */}
            <div class="p-4">
              <h2 class="font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Events
              </h2>
              <EventsTimeline events={events()} />
            </div>
          </div>

          {/* Right Panel - Map */}
          <div class="flex-1 relative">
            <MapView 
              assets={[assetData()]}
              geofences={geofences}
              showGeofences={true}
              focusedAssetId={assetData().id}
              routeTrail={routeTrail()}
              height="100%"
            />
            
            {/* Map overlay controls */}
            <div class="absolute top-4 left-4 flex gap-2">
              <A href="/map" class="btn btn-sm bg-base-100 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                View All
              </A>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
};

export default AssetDetailPage;
