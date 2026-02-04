import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import AssetTable from '~/components/assets/AssetTable';
import AssetFilters from '~/components/assets/AssetFilters';
import { filteredAssets, datahubStats } from '~/lib/stores';

const AssetsPage: Component = () => {
  const stats = datahubStats;

  return (
    <div class="flex flex-col h-full w-full bg-base-100">
      {/* Header */}
      <div class="flex items-center justify-between p-4 border-b border-base-200">
        <div>
          <h1 class="text-2xl font-bold">Assets</h1>
          <p class="text-sm text-base-content/70">Manage and monitor all your tracked assets</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </button>
          <button class="btn btn-primary btn-sm gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Asset
          </button>
        </div>
      </div>

      {/* Summary */}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-base-200 bg-base-200/30">
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Total</div>
          <div class="text-xl font-semibold">{stats().totalAssets}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Active</div>
          <div class="text-xl font-semibold text-success">{stats().activeAssets}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Moving</div>
          <div class="text-xl font-semibold text-info">{stats().movingAssets}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Alerts</div>
          <div class="text-xl font-semibold text-warning">{stats().alerts}</div>
        </div>
      </div>

      {/* Filters */}
      <div class="border-b border-base-200 bg-base-200/30">
        <AssetFilters />
      </div>

      {/* Results count */}
      <div class="px-4 py-2 text-sm text-base-content/70 border-b border-base-200 bg-base-200/30">
        {filteredAssets().length} asset{filteredAssets().length !== 1 ? 's' : ''} found
      </div>

      {/* Table */}
      <div class="flex-1 overflow-auto">
        <AssetTable />
      </div>
    </div>
  );
};

export default AssetsPage;
