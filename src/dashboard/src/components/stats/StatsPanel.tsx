import { Component, createMemo } from 'solid-js';
import { dashboardStats } from '~/lib/stores';

const StatsPanel: Component = () => {
  const stats = dashboardStats;
  const activeRate = createMemo(() => {
    if (!stats().totalAssets) return 0;
    return Math.round((stats().activeAssets / stats().totalAssets) * 100);
  });
  const movingRate = createMemo(() => {
    if (!stats().activeAssets) return 0;
    return Math.round((stats().movingAssets / stats().activeAssets) * 100);
  });

  return (
    <div class="w-full border-b border-base-200 bg-base-100/90 backdrop-blur">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
        <div class="rounded-2xl border border-base-200 bg-base-100 shadow-sm px-4 py-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs uppercase tracking-wide text-base-content/60">Total Assets</div>
              <div class="text-2xl font-semibold mt-1">{stats().totalAssets}</div>
            </div>
            <div class="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div class="mt-3 text-xs text-base-content/60">
            Coverage across Southeast Asia
          </div>
        </div>

        <div class="rounded-2xl border border-base-200 bg-base-100 shadow-sm px-4 py-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs uppercase tracking-wide text-base-content/60">Active Assets</div>
              <div class="text-2xl font-semibold mt-1 text-success">{stats().activeAssets}</div>
            </div>
            <div class="h-10 w-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <div class="flex items-center justify-between text-xs text-base-content/60 mb-1">
              <span>Utilization</span>
              <span>{activeRate()}%</span>
            </div>
            <progress class="progress progress-success w-full" value={activeRate()} max="100"></progress>
          </div>
        </div>

        <div class="rounded-2xl border border-base-200 bg-base-100 shadow-sm px-4 py-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs uppercase tracking-wide text-base-content/60">Moving Now</div>
              <div class="text-2xl font-semibold mt-1 text-info">{stats().movingAssets}</div>
            </div>
            <div class="h-10 w-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="mt-3 text-xs text-base-content/60">
            {movingRate()}% of active assets in motion
          </div>
        </div>

        <div class="rounded-2xl border border-base-200 bg-base-100 shadow-sm px-4 py-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs uppercase tracking-wide text-base-content/60">Alerts</div>
              <div class="text-2xl font-semibold mt-1 text-warning">{stats().alerts}</div>
            </div>
            <div class="h-10 w-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-3 text-xs text-base-content/60">
            Maintenance and exception events
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
