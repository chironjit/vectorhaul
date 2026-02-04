import { Component, For } from 'solid-js';

const exports = [
  { id: 'exp-001', name: 'Daily Asset Summary', format: 'CSV', status: 'Complete', time: 'Today 08:00' },
  { id: 'exp-002', name: 'Incident Report - Bangkok', format: 'JSON', status: 'Queued', time: 'Today 07:15' },
  { id: 'exp-003', name: 'Fleet Performance', format: 'CSV', status: 'Complete', time: 'Yesterday 18:30' },
];

const schedules = [
  { id: 'sch-001', name: 'Daily Ops Summary', cadence: 'Daily', recipients: 'ops@company.com' },
  { id: 'sch-002', name: 'Weekly KPI Review', cadence: 'Weekly', recipients: 'exec@company.com' },
];

const ReportsPage: Component = () => {
  return (
    <div class="flex flex-col h-full w-full bg-base-100">
      <div class="flex items-center justify-between p-4 border-b border-base-200">
        <div>
          <h1 class="text-2xl font-bold">Reports</h1>
          <p class="text-sm text-base-content/70">Exports, audit-ready reporting, and data access</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm">Create Schedule</button>
          <button class="btn btn-primary btn-sm">New Export</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 p-4 border-b border-base-200 bg-base-200/30">
        <div class="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Data Access</div>
          <div class="mt-2 space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span>REST API</span>
              <span class="badge badge-success badge-sm">Enabled</span>
            </div>
            <div class="flex items-center justify-between">
              <span>GraphQL</span>
              <span class="badge badge-ghost badge-sm">Planned</span>
            </div>
            <div class="flex items-center justify-between">
              <span>WebSocket Streams</span>
              <span class="badge badge-success badge-sm">Enabled</span>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Compliance</div>
          <div class="mt-2 text-sm text-base-content/70">
            Exports include lineage metadata and audit timestamps for regulatory reviews.
          </div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Export Formats</div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="badge badge-outline">CSV</span>
            <span class="badge badge-outline">JSON</span>
            <span class="badge badge-outline">Parquet</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-base-200 font-semibold">Recent Exports</div>
          <table class="table table-zebra w-full">
            <thead class="bg-base-200">
              <tr>
                <th>Report</th>
                <th>Format</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <For each={exports}>
                {(item) => (
                  <tr>
                    <td class="font-medium">{item.name}</td>
                    <td>{item.format}</td>
                    <td>
                      <span class={`badge badge-sm ${item.status === 'Complete' ? 'badge-success' : 'badge-warning'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.time}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        <div class="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-base-200 font-semibold">Scheduled Reports</div>
          <table class="table table-zebra w-full">
            <thead class="bg-base-200">
              <tr>
                <th>Schedule</th>
                <th>Cadence</th>
                <th>Recipients</th>
              </tr>
            </thead>
            <tbody>
              <For each={schedules}>
                {(item) => (
                  <tr>
                    <td class="font-medium">{item.name}</td>
                    <td>{item.cadence}</td>
                    <td class="text-sm text-base-content/70">{item.recipients}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
