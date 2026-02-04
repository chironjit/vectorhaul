import { Component, For, Show } from 'solid-js';
import type { Event } from '~/types';

interface EventsTimelineProps {
  events: Event[];
}

// Event type to icon and color mapping
const getEventStyle = (type: Event['type']) => {
  switch (type) {
    case 'geofence_entry':
      return { icon: '📍', bg: 'bg-success/20', text: 'text-success' };
    case 'geofence_exit':
      return { icon: '📤', bg: 'bg-warning/20', text: 'text-warning' };
    case 'speed_change':
      return { icon: '⚡', bg: 'bg-info/20', text: 'text-info' };
    case 'status_change':
      return { icon: '🔄', bg: 'bg-primary/20', text: 'text-primary' };
    case 'location_update':
      return { icon: '📌', bg: 'bg-base-200', text: 'text-base-content' };
    default:
      return { icon: '📋', bg: 'bg-base-200', text: 'text-base-content' };
  }
};

// Format relative time
const formatTime = (timestamp: string): string => {
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

// Format absolute time
const formatAbsoluteTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

const EventsTimeline: Component<EventsTimelineProps> = (props) => {
  return (
    <div class="space-y-1">
      <Show 
        when={props.events.length > 0}
        fallback={
          <div class="text-center py-8 text-base-content/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm">No events recorded</p>
          </div>
        }
      >
        <ul class="timeline timeline-vertical timeline-compact">
          <For each={props.events}>
            {(event, index) => {
              const style = getEventStyle(event.type);
              return (
                <li>
                  <Show when={index() !== 0}>
                    <hr class="bg-base-300" />
                  </Show>
                  <div class="timeline-start text-xs text-base-content/50 w-20">
                    <div class="tooltip" data-tip={formatAbsoluteTime(event.timestamp)}>
                      {formatTime(event.timestamp)}
                    </div>
                  </div>
                  <div class={`timeline-middle ${style.bg} w-8 h-8 rounded-full flex items-center justify-center`}>
                    <span class="text-sm">{style.icon}</span>
                  </div>
                  <div class="timeline-end timeline-box border-base-200 ml-2">
                    <div class="text-sm font-medium">{event.description}</div>
                    <Show when={event.data}>
                      <div class="text-xs text-base-content/60 mt-1">
                        {JSON.stringify(event.data)}
                      </div>
                    </Show>
                  </div>
                  <Show when={index() !== props.events.length - 1}>
                    <hr class="bg-base-300" />
                  </Show>
                </li>
              );
            }}
          </For>
        </ul>
      </Show>
    </div>
  );
};

export default EventsTimeline;
