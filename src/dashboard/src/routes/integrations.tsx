import { Component, For } from 'solid-js';

const integrations = [
  {
    id: 'src-001',
    name: 'Partner GPS Stream',
    protocol: 'WebSocket',
    status: 'connected',
    lastSync: '2m ago',
    throughput: '4.2k msg/min',
  },
  {
    id: 'src-002',
    name: 'IoT Sensor Gateway',
    protocol: 'MQTT',
    status: 'connected',
    lastSync: '5m ago',
    throughput: '1.1k msg/min',
  },
  {
    id: 'src-003',
    name: 'Carrier API',
    protocol: 'HTTP/REST',
    status: 'degraded',
    lastSync: '18m ago',
    throughput: '320 req/min',
  },
  {
    id: 'src-004',
    name: 'Port Authority Feed',
    protocol: 'File Upload',
    status: 'scheduled',
    lastSync: '1h ago',
    throughput: '12 files/day',
  },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'connected':
      return 'badge-success';
    case 'degraded':
      return 'badge-warning';
    case 'scheduled':
      return 'badge-ghost';
    default:
      return 'badge-ghost';
  }
};

const IntegrationsPage: Component = () => {
  return (
    <div class="flex flex-col h-full w-full bg-base-100">
      <div class="flex items-center justify-between p-4 border-b border-base-200">
        <div>
          <h1 class="text-2xl font-bold">Integrations</h1>
          <p class="text-sm text-base-content/70">Unified ingestion from partners and devices</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm">View API Docs</button>
          <button class="btn btn-primary btn-sm">Add Data Source</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 p-4 border-b border-base-200 bg-base-200/30">
        <div class="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Protocols</div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="badge badge-outline">HTTP/REST</span>
            <span class="badge badge-outline">MQTT</span>
            <span class="badge badge-outline">WebSocket</span>
            <span class="badge badge-outline">File Upload</span>
          </div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Normalization</div>
          <div class="mt-2 text-sm text-base-content/70">
            All partner feeds are transformed into a unified asset schema with lineage tracking.
          </div>
        </div>
        <div class="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm">
          <div class="text-xs uppercase tracking-wide text-base-content/60">Realtime Updates</div>
          <div class="mt-2 text-sm text-base-content/70">
            Streaming updates are delivered within 2s SLA to datahub consumers.
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-auto">
        <table class="table table-zebra w-full">
          <thead class="sticky top-0 bg-base-200 z-10">
            <tr>
              <th>Source</th>
              <th>Protocol</th>
              <th>Status</th>
              <th>Last Sync</th>
              <th>Throughput</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <For each={integrations}>
              {(source) => (
                <tr class="hover">
                  <td>
                    <div class="flex flex-col">
                      <span class="font-medium">{source.name}</span>
                      <span class="text-xs text-base-content/60">{source.id}</span>
                    </div>
                  </td>
                  <td>{source.protocol}</td>
                  <td>
                    <span class={`badge badge-sm ${statusBadge(source.status)}`}>
                      {source.status}
                    </span>
                  </td>
                  <td>{source.lastSync}</td>
                  <td>{source.throughput}</td>
                  <td>
                    <button class="btn btn-ghost btn-xs">Configure</button>
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

export default IntegrationsPage;
