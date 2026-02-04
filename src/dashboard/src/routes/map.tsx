import { Component, createMemo, createSignal, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { geofences, getLocationHistory } from '~/data/dummy-data';
import { filteredAssets, setSelectedAssetId, selectedAssetId, selectedAsset } from '~/lib/stores';
import MapView from '~/components/map/MapView';
import AssetSidebar from '~/components/assets/AssetSidebar';
import StatsPanel from '~/components/stats/StatsPanel';

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

const MapPage: Component = () => {
  const handleAssetSelect = (id: string) => {
    setSelectedAssetId(id);
  };
  const [showGeofences, setShowGeofences] = createSignal(true);
  const [showRouteTrails, setShowRouteTrails] = createSignal(true);

  // Get route trail for selected asset from location history
  const selectedAssetRouteTrail = createMemo(() => {
    const assetId = selectedAssetId();
    if (!assetId) return [];

    const history = getLocationHistory(assetId);
    if (!history || !history.locations.length) return [];

    // Get the asset to include its current location as the final point
    const asset = filteredAssets().find(a => a.id === assetId);

    // Convert location history to [lng, lat] coordinates for the map
    const trail = history.locations.map(loc => [loc.longitude, loc.latitude] as [number, number]);

    // Append the asset's current location as the final point so the trail connects to the marker
    if (asset?.current_location) {
      trail.push([asset.current_location.longitude, asset.current_location.latitude]);
    }

    return trail;
  });

  return (
    <div class="flex flex-col h-full w-full">
      {/* Stats bar */}
      <div class="flex-shrink-0">
        <StatsPanel />
      </div>

      {/* Main content */}
      <div class="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        <AssetSidebar onAssetSelect={handleAssetSelect} />

        {/* Map */}
        <div class="flex-1 relative overflow-hidden">
          <MapView
            assets={filteredAssets()}
            geofences={geofences}
            showGeofences={showGeofences()}
            showRouteTrails={showRouteTrails()}
            getRouteTrail={selectedAssetRouteTrail}
            getSelectedAsset={() => selectedAsset()}
            onAssetClick={handleAssetSelect}
          />

          {/* Map overlay - layer toggles */}
          <div class="absolute top-4 right-4 z-10 w-60 rounded-2xl border border-base-200 bg-base-100/90 backdrop-blur shadow-sm p-3">
            <div class="text-xs uppercase tracking-wide text-base-content/60">Layers</div>
            <div class="mt-2 space-y-2 text-sm">
              <label class="flex items-center justify-between">
                <span class="text-base-content/80">Geofences</span>
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-primary"
                  checked={showGeofences()}
                  onChange={(e) => setShowGeofences(e.currentTarget.checked)}
                />
              </label>
              <label class="flex items-center justify-between">
                <span class="text-base-content/80">Route trails</span>
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-primary"
                  checked={showRouteTrails()}
                  onChange={(e) => setShowRouteTrails(e.currentTarget.checked)}
                />
              </label>
            </div>
          </div>

          {/* Map overlay - selected asset summary */}
          <Show when={selectedAsset()}>
            {(asset) => (
              <div class="absolute bottom-4 right-4 z-10 w-80 rounded-2xl border border-base-200 bg-base-100/90 backdrop-blur shadow-lg p-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-xs uppercase tracking-wide text-base-content/60">Selected Asset</div>
                    <div class="text-lg font-semibold mt-1">{asset().name}</div>
                    <div class="text-xs text-base-content/60">{asset().id}</div>
                  </div>
                  <span class={`badge ${asset().status === 'active' ? 'badge-success' : asset().status === 'maintenance' ? 'badge-warning' : 'badge-ghost'}`}>
                    {asset().status}
                  </span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div class="text-xs text-base-content/60">Last update</div>
                    <div class="font-medium">{formatRelativeTime(asset().last_update)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-base-content/60">Speed</div>
                    <div class="font-medium">{asset().current_location?.speed ?? 0} km/h</div>
                  </div>
                </div>
                <div class="mt-3 text-sm">
                  <div class="text-xs text-base-content/60">Location</div>
                  <div class="truncate">{asset().current_location?.address ?? 'Unknown'}</div>
                </div>
                <div class="mt-4 flex gap-2">
                  <A href={`/assets/${asset().id}`} class="btn btn-sm btn-primary flex-1">
                    View Details
                  </A>
                  <button class="btn btn-sm btn-outline flex-1">
                    Create Alert
                  </button>
                </div>
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
