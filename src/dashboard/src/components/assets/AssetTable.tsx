import { Component, For, Show } from 'solid-js';
import { A } from '@solidjs/router';
import type { Asset, AssetType } from '~/types';
import { 
  sortedAssets, 
  sortField, 
  sortDirection, 
  toggleSort,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  type SortField
} from '~/lib/stores';

// Asset type to icon mapping
const getAssetIcon = (type: AssetType): string => {
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

// Sort indicator component
const SortIndicator: Component<{ field: SortField }> = (props) => {
  const isActive = () => sortField() === props.field;
  const isAsc = () => sortDirection() === 'asc';

  return (
    <span class={`ml-1 transition-opacity ${isActive() ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
      {isActive() && isAsc() ? '↑' : '↓'}
    </span>
  );
};

const AssetTable: Component = () => {
  const assets = sortedAssets;
  const page = currentPage;
  const pages = totalPages;

  // Paginated assets
  const paginatedAssets = () => {
    const all = assets();
    const start = (page() - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return all.slice(start, end);
  };

  // Handle page change
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages()) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div class="flex flex-col h-full overflow-auto">
      {/* Table */}
      <div class="flex-shrink-0">
        <table class="table table-zebra w-full">
          <thead class="sticky top-0 bg-base-200 z-10">
            <tr>
              <th 
                class="cursor-pointer group hover:bg-base-300 transition-colors"
                onClick={() => toggleSort('id')}
              >
                ID <SortIndicator field="id" />
              </th>
              <th 
                class="cursor-pointer group hover:bg-base-300 transition-colors"
                onClick={() => toggleSort('name')}
              >
                Name <SortIndicator field="name" />
              </th>
              <th 
                class="cursor-pointer group hover:bg-base-300 transition-colors"
                onClick={() => toggleSort('type')}
              >
                Type <SortIndicator field="type" />
              </th>
              <th 
                class="cursor-pointer group hover:bg-base-300 transition-colors"
                onClick={() => toggleSort('status')}
              >
                Status <SortIndicator field="status" />
              </th>
              <th>Location</th>
              <th 
                class="cursor-pointer group hover:bg-base-300 transition-colors"
                onClick={() => toggleSort('speed')}
              >
                Speed <SortIndicator field="speed" />
              </th>
              <th 
                class="cursor-pointer group hover:bg-base-300 transition-colors"
                onClick={() => toggleSort('last_update')}
              >
                Last Update <SortIndicator field="last_update" />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <Show 
              when={paginatedAssets().length > 0}
              fallback={
                <tr>
                  <td colspan="8" class="text-center py-8 text-base-content/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No assets found</p>
                    <p class="text-sm mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              }
            >
              <For each={paginatedAssets()}>
                {(asset) => (
                  <tr class="hover">
                    <td class="font-mono text-sm">{asset.id}</td>
                    <td>
                      <div class="flex items-center gap-2">
                        <span class="text-lg">{getAssetIcon(asset.type)}</span>
                        <span class="font-medium">{asset.name}</span>
                      </div>
                    </td>
                    <td class="capitalize">{asset.type}</td>
                    <td>
                      <span class={`badge badge-sm ${getStatusBadge(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td class="max-w-48 truncate">
                      {asset.current_location?.address || '-'}
                    </td>
                    <td>
                      {asset.current_location ? (
                        <span class={asset.current_location.speed > 0 ? 'text-success font-medium' : 'text-base-content/50'}>
                          {asset.current_location.speed} km/h
                        </span>
                      ) : '-'}
                    </td>
                    <td class="text-sm text-base-content/70">
                      {formatRelativeTime(asset.last_update)}
                    </td>
                    <td>
                      <div class="flex gap-1">
                        <A 
                          href={`/assets/${asset.id}`}
                          class="btn btn-ghost btn-xs"
                          title="View details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </A>
                        <button class="btn btn-ghost btn-xs" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button class="btn btn-ghost btn-xs text-error" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Show when={pages() > 1}>
        <div class="flex items-center justify-center gap-4 p-4 border-t border-base-200 bg-base-100 flex-shrink-0">
          <div class="text-sm text-base-content/70">
            Showing {((page() - 1) * itemsPerPage) + 1} - {Math.min(page() * itemsPerPage, assets().length)} of {assets().length} assets
          </div>
          <div class="join">
            <button 
              class="join-item btn btn-sm"
              disabled={page() === 1}
              onClick={() => goToPage(page() - 1)}
            >
              «
            </button>
            <For each={Array.from({ length: pages() }, (_, i) => i + 1)}>
              {(pageNum) => (
                <button 
                  class={`join-item btn btn-sm ${page() === pageNum ? 'btn-active' : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              )}
            </For>
            <button 
              class="join-item btn btn-sm"
              disabled={page() === pages()}
              onClick={() => goToPage(page() + 1)}
            >
              »
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default AssetTable;
