// Asset types based on POC specification

export type AssetType = 'truck' | 'van' | 'motorcycle' | 'ship' | 'aircraft';
export type AssetStatus = 'active' | 'inactive' | 'maintenance';
export type MovementStatus = 'moving' | 'stopped' | 'idle';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
  speed: number; // km/h
  heading: number; // degrees (0-360)
  accuracy: number; // meters
}

export interface Driver {
  name: string;
  phone: string;
}

export interface Route {
  origin: string;
  destination: string;
  progress: number; // percentage (0-100)
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  current_location?: Location;
  last_update: string;
  driver?: Driver;
  route?: Route;
  created_at: string;
}

export interface LocationHistory {
  asset_id: string;
  locations: Location[];
}

export interface Geofence {
  id: string;
  name: string;
  type: 'warehouse' | 'port' | 'depot' | 'hub';
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // meters
  country: string;
}

export interface Event {
  id: string;
  asset_id: string;
  type: 'geofence_entry' | 'geofence_exit' | 'speed_change' | 'status_change' | 'location_update';
  timestamp: string;
  description: string;
  data?: Record<string, unknown>;
}

// Stats for datahub
export interface DatahubStats {
  totalAssets: number;
  activeAssets: number;
  movingAssets: number;
  alerts: number;
}

// Filter options
export interface AssetFilters {
  status: AssetStatus | 'all';
  type: AssetType | 'all';
  search: string;
}

// Map marker representation
export interface MapMarker {
  id: string;
  coordinates: [number, number]; // [lng, lat]
  type: AssetType;
  status: AssetStatus;
  isMoving: boolean;
  name: string;
}

// Chart data point
export interface SpeedDataPoint {
  timestamp: string;
  speed: number;
}
