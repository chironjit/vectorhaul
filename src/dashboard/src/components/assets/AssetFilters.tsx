import { Component } from 'solid-js';
import { 
  filters, 
  updateStatusFilter, 
  updateTypeFilter, 
  updateSearchFilter,
  clearFilters 
} from '~/lib/stores';
import type { AssetStatus, AssetType } from '~/types';

interface AssetFiltersProps {
  compact?: boolean;
}

const AssetFilters: Component<AssetFiltersProps> = (props) => {
  return (
    <div class={`flex flex-col gap-3 ${props.compact ? '' : 'p-4'}`}>
      {/* Search */}
      <div class="form-control">
        <label class="input input-bordered input-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search assets, IDs, locations..."
            class="grow"
            value={filters().search}
            onInput={(e) => updateSearchFilter(e.currentTarget.value)}
          />
          {filters().search && (
            <button 
              class="btn btn-ghost btn-xs"
              onClick={() => updateSearchFilter('')}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </label>
      </div>

      {/* Filter row */}
      <div class="flex gap-2 flex-wrap">
        {/* Status filter */}
        <select
          class="select select-bordered select-sm flex-1 min-w-24"
          value={filters().status}
          onChange={(e) => updateStatusFilter(e.currentTarget.value as AssetStatus | 'all')}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>

        {/* Type filter */}
        <select
          class="select select-bordered select-sm flex-1 min-w-24"
          value={filters().type}
          onChange={(e) => updateTypeFilter(e.currentTarget.value as AssetType | 'all')}
        >
          <option value="all">All Types</option>
          <option value="truck">🚛 Truck</option>
          <option value="van">🚐 Van</option>
          <option value="motorcycle">🏍️ Motorcycle</option>
          <option value="ship">🚢 Ship</option>
          <option value="aircraft">✈️ Aircraft</option>
        </select>

        {/* Clear filters */}
        {(filters().status !== 'all' || filters().type !== 'all' || filters().search) && (
          <button 
            class="btn btn-sm btn-ghost text-error"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default AssetFilters;
