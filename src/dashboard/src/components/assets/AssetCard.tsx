import { Component } from 'solid-js';
import type { Asset } from '~/types';
import { selectedAssetId, setSelectedAssetId } from '~/lib/stores';

interface AssetCardProps {
  asset: Asset;
  onClick?: (id: string) => void;
}

// Asset type to icon mapping
const getAssetIcon = (type: Asset['type']): string => {
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

const AssetCard: Component<AssetCardProps> = (props) => {
  const isSelected = () => selectedAssetId() === props.asset.id;
  const isMoving = () => props.asset.current_location && props.asset.current_location.speed > 0;
  const movementLabel = () => {
    if (props.asset.status === 'maintenance') return 'Maintenance';
    if (props.asset.status === 'inactive') return 'Offline';
    return isMoving() ? 'Moving' : 'Stopped';
  };

  const handleClick = () => {
    setSelectedAssetId(props.asset.id);
    props.onClick?.(props.asset.id);
  };

  return (
    <div 
      class={`card bg-base-100 border cursor-pointer transition-all hover:shadow-md ${
        isSelected() ? 'border-primary shadow-md ring-1 ring-primary/40' : 'border-base-200 hover:border-base-300'
      }`}
      onClick={handleClick}
    >
      <div class="card-body p-3">
        <div class="flex items-start gap-3">
          {/* Icon */}
          <div class={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border ${
            props.asset.status === 'active' 
              ? isMoving() ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'
              : 'bg-base-200 border-base-300'
          }`}>
            {getAssetIcon(props.asset.type)}
          </div>
          
          {/* Content */}
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-medium text-sm truncate">{props.asset.name}</h3>
              <div class="flex items-center gap-1">
                <span class={`badge badge-xs ${getStatusBadge(props.asset.status)}`}>
                  {props.asset.status}
                </span>
                <span class={`badge badge-xs ${isMoving() ? 'badge-info' : 'badge-ghost'}`}>
                  {movementLabel()}
                </span>
              </div>
            </div>
            
            <p class="text-xs text-base-content/60 mt-0.5">{props.asset.id}</p>
            
            {/* Location */}
            {props.asset.current_location && (
              <p class="text-xs text-base-content/70 mt-1 truncate">
                {props.asset.current_location.address}
              </p>
            )}
            
            {/* Speed and time */}
            <div class="flex items-center justify-between mt-2 text-xs text-base-content/60">
              {props.asset.current_location && (
                <span class="flex items-center gap-2">
                  <span class={`h-2 w-2 rounded-full ${isMoving() ? 'bg-success' : 'bg-warning'}`}></span>
                  {isMoving() ? `${props.asset.current_location.speed} km/h` : 'Stopped'}
                </span>
              )}
              <span>{formatRelativeTime(props.asset.last_update)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
