import { Component, For, createMemo } from 'solid-js';
import { geofences } from '~/data/dummy-data';

const GeofencesPage: Component = () => {
  const summary = createMemo(() => {
    const byType = geofences.reduce<Record<string, number>>((acc, g) => {
      acc[g.type] = (acc[g.type] || 0) + 1;
      return acc;
    }, {});
    return {
      total: geofences.length,
      warehouses: byType.warehouse || 0,
      ports: byType.port || 0,
      hubs: (byType.hub || 0) + (byType.depot || 0),
    };
  });

  return (
    <div class="flex flex-col h-full w-full bg-base-100">
      <div class="flex items-center justify-between p-4 border-b border-base-200">
        <div>
          <h1 class="text-2xl font-bold">Geofences</h1>
          <p class="text-sm text-base-content/70">Operational boundaries for facilities and ports</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm">Import GeoJSON</button>
          <button class="btn btn-primary btn-sm">Create Geofence</button>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-base-200 bg-base-200/30">
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Total</div>
          <div class="text-xl font-semibold">{summary().total}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Warehouses</div>
          <div class="text-xl font-semibold text-primary">{summary().warehouses}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Ports</div>
          <div class="text-xl font-semibold text-info">{summary().ports}</div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Hubs</div>
          <div class="text-xl font-semibold text-success">{summary().hubs}</div>
        </div>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table table-zebra w-full">
          <thead class="sticky top-0 bg-base-200 z-10">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Radius</th>
              <th>Country</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <For each={geofences}>
              {(geofence) => (
                <tr class="hover">
                  <td class="font-medium">{geofence.name}</td>
                  <td class="capitalize">{geofence.type}</td>
                  <td>{geofence.radius} m</td>
                  <td>{geofence.country}</td>
                  <td>
                    <span class="badge badge-success badge-sm">Active</span>
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

export default GeofencesPage;
