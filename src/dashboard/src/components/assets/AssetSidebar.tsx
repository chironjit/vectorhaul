import { Component, For, Show } from 'solid-js';
import { A } from '@solidjs/router';
import AssetCard from './AssetCard';
import AssetFilters from './AssetFilters';
import { 
  sidebarOpen, 
  toggleSidebar, 
  filteredAssets,
  datahubStats,
} from '~/lib/stores';

interface AssetSidebarProps {
  onAssetSelect?: (id: string) => void;
}

const AssetSidebar: Component<AssetSidebarProps> = (props) => {
  const assets = filteredAssets;
  const stats = datahubStats;

  return (
    <>
      {/* Sidebar */}
      <aside 
        class={`
          flex-shrink-0 flex flex-col bg-base-100 border-r border-base-200 transition-all duration-300 overflow-hidden
          ${sidebarOpen() ? 'w-80' : 'w-0'}
        `}
      >
        <Show when={sidebarOpen()}>
          <div class="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div class="flex items-center justify-between p-4 border-b border-base-200">
              <div>
                <h2 class="font-semibold">Fleet Assets</h2>
                <p class="text-xs text-base-content/60">Real-time visibility & alerts</p>
              </div>
              <span class="badge badge-primary badge-sm">{assets().length}</span>
            </div>

            {/* Quick stats */}
            <div class="grid grid-cols-3 gap-2 px-4 py-3 border-b border-base-200 bg-base-200/30">
              <div class="rounded-lg bg-base-100 border border-base-200 px-2 py-2 text-center">
                <div class="text-xs text-base-content/60">Active</div>
                <div class="text-sm font-semibold text-success">{stats().activeAssets}</div>
              </div>
              <div class="rounded-lg bg-base-100 border border-base-200 px-2 py-2 text-center">
                <div class="text-xs text-base-content/60">Moving</div>
                <div class="text-sm font-semibold text-info">{stats().movingAssets}</div>
              </div>
              <div class="rounded-lg bg-base-100 border border-base-200 px-2 py-2 text-center">
                <div class="text-xs text-base-content/60">Alerts</div>
                <div class="text-sm font-semibold text-warning">{stats().alerts}</div>
              </div>
            </div>

            {/* Filters */}
            <div class="px-3 py-3 border-b border-base-200 bg-base-200/30">
              <AssetFilters compact />
            </div>

            {/* Asset list */}
            <div class="flex-1 overflow-y-auto p-3 space-y-2 bg-base-100">
              <Show 
                when={assets().length > 0}
                fallback={
                  <div class="text-center py-8 text-base-content/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">No assets found</p>
                    <p class="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                }
              >
                <For each={assets()}>
                  {(asset) => (
                    <AssetCard 
                      asset={asset} 
                      onClick={props.onAssetSelect}
                    />
                  )}
                </For>
              </Show>
            </div>

            {/* Footer */}
            <div class="p-3 border-t border-base-200 bg-base-200/30">
              <A href="/assets" class="btn btn-sm btn-outline w-full">
                View All Assets
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </A>
            </div>
          </div>
        </Show>
      </aside>

      {/* Toggle button */}
      <button
        class={`
          absolute z-10 btn btn-sm btn-circle bg-base-100 shadow-md border border-base-200
          transition-all duration-300
          ${sidebarOpen() ? 'left-[304px]' : 'left-2'}
          top-1/2 -translate-y-1/2
        `}
        onClick={toggleSidebar}
        aria-label={sidebarOpen() ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class={`h-4 w-4 transition-transform ${sidebarOpen() ? '' : 'rotate-180'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </>
  );
};

export default AssetSidebar;
