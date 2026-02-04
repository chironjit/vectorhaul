import { Component, onMount, onCleanup, createEffect, createSignal, Show } from 'solid-js';
import { isServer } from 'solid-js/web';
import type { Asset, Geofence } from '~/types';
import { theme, selectedAssetId, setSelectedAssetId } from '~/lib/stores';
import { MAP_CENTER, MAP_ZOOM } from '~/data/dummy-data';

// MapTiler API Key from environment variable
// Vite requires VITE_ prefix for client-side env vars
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY || import.meta.env.MAPTILER_KEY;

interface MapViewProps {
  assets: Asset[];
  geofences?: Geofence[];
  showGeofences?: boolean;
  showRouteTrails?: boolean;
  focusedAssetId?: string | null;
  onAssetClick?: (assetId: string) => void;
  routeTrail?: [number, number][];
  getRouteTrail?: () => [number, number][];
  getSelectedAsset?: () => Asset | null;
  height?: string;
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

// Status to color mapping
const getStatusColor = (status: Asset['status'], speed?: number): string => {
  if (status === 'maintenance') return '#EF4444'; // Red
  if (status === 'inactive') return '#6B7280'; // Gray
  if (speed && speed > 0) return '#10B981'; // Green (moving)
  return '#F59E0B'; // Yellow (stopped)
};

const MapView: Component<MapViewProps> = (props) => {
  let mapContainer: HTMLDivElement | undefined;
  let map: any;
  let maptilersdk: typeof import('@maptiler/sdk') | undefined;
  const markers: Map<string, any> = new Map();
  const [mounted, setMounted] = createSignal(false);
  const [mapLoaded, setMapLoaded] = createSignal(false);
  const [mapError, setMapError] = createSignal<string | null>(null);
  const [layersReady, setLayersReady] = createSignal(false);
  
  let resizeObserver: ResizeObserver | undefined;
  let lastAppliedTheme: 'light' | 'dark' | null = null;
  
  // Function to add all custom sources and layers
  const setupCustomLayers = () => {
    if (!map) return;
    
    // Check if sources already exist (avoid duplicates)
    if (map.getSource('geofences')) return;
    
    // Add geofence source and layers
    map.addSource('geofences', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    map.addLayer({
      id: 'geofences-fill',
      type: 'fill',
      source: 'geofences',
      paint: {
        'fill-color': '#2563EB',
        'fill-opacity': 0.1,
      },
    });

    map.addLayer({
      id: 'geofences-line',
      type: 'line',
      source: 'geofences',
      paint: {
        'line-color': '#2563EB',
        'line-width': 2,
        'line-dasharray': [2, 2],
      },
    });

    // Active assets dots source and layer
    map.addSource('active-assets', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    map.addLayer({
      id: 'active-assets-dots',
      type: 'circle',
      source: 'active-assets',
      paint: {
        'circle-radius': 6,
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
      },
    });

    // Add route trail source and layer
    map.addSource('route-trail', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      },
    });

    map.addLayer({
      id: 'route-trail-line',
      type: 'line',
      source: 'route-trail',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3B82F6',
        'line-width': 5,
        'line-opacity': 0.8,
      },
    });
    
    // Add history points source and layer (circles along the trail)
    map.addSource('history-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    
    // Outer glow for history points
    map.addLayer({
      id: 'history-points-glow',
      type: 'circle',
      source: 'history-points',
      paint: {
        'circle-radius': 10,
        'circle-color': '#3B82F6',
        'circle-opacity': 0.3,
      },
    });
    
    // Main history point circles
    map.addLayer({
      id: 'history-points-circle',
      type: 'circle',
      source: 'history-points',
      paint: {
        'circle-radius': 6,
        'circle-color': '#3B82F6',
        'circle-opacity': 1,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
      },
    });
    
    // Start point layer (green circle for journey start)
    map.addSource('start-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    
    map.addLayer({
      id: 'start-point-glow',
      type: 'circle',
      source: 'start-point',
      paint: {
        'circle-radius': 14,
        'circle-color': '#6B7280',
        'circle-opacity': 0.3,
      },
    });
    
    map.addLayer({
      id: 'start-point-circle',
      type: 'circle',
      source: 'start-point',
      paint: {
        'circle-radius': 8,
        'circle-color': '#6B7280',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
      },
    });
    
    // Current position layer (end point - colored by status)
    map.addSource('current-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    
    map.addLayer({
      id: 'current-point-glow',
      type: 'circle',
      source: 'current-point',
      paint: {
        'circle-radius': 18,
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.4,
      },
    });
    
    map.addLayer({
      id: 'current-point-circle',
      type: 'circle',
      source: 'current-point',
      paint: {
        'circle-radius': 12,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#FFFFFF',
      },
    });
    
    setLayersReady(true);
  };

  // Get map style based on theme
  const getMapStyle = () => {
    if (!maptilersdk) return '';
    return theme() === 'dark'
      ? maptilersdk.MapStyle.STREETS.DARK
      : maptilersdk.MapStyle.STREETS;
  };

  onMount(async () => {
    setMounted(true);
    
    if (isServer || !mapContainer) return;
    
    if (!MAPTILER_KEY) {
      setMapError('MapTiler API key not found. Please set VITE_MAPTILER_KEY in your .env file.');
      return;
    }
    
    try {
      // Dynamic import for client-side only
      maptilersdk = await import('@maptiler/sdk');
      await import('@maptiler/sdk/dist/maptiler-sdk.css');
      
      // Set the API key
      maptilersdk.config.apiKey = MAPTILER_KEY;

      // Initialize map
      map = new maptilersdk.Map({
        container: mapContainer,
        style: getMapStyle(),
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        navigationControl: true,
        geolocateControl: false,
      });

      map.on('load', () => {
        setMapLoaded(true);
        
        // Trigger resize to ensure map fills container
        setTimeout(() => {
          map?.resize();
        }, 100);
        
        // Setup custom layers
        setupCustomLayers();
      });
      
      // Re-add layers after style changes (theme toggle)
      // Using 'idle' event as it's more reliable across MapLibre versions
      map.on('idle', () => {
        if (!layersReady() && map.isStyleLoaded()) {
          setupCustomLayers();
        }
      });
      // Set up ResizeObserver to handle container size changes
      resizeObserver = new ResizeObserver(() => {
        if (map) {
          map.resize();
        }
      });
      resizeObserver.observe(mapContainer);
      
    } catch (error) {
      console.error('Failed to load map:', error);
      setMapError('Failed to load map. Please check your MapTiler API key.');
    }
  });

  onCleanup(() => {
    resizeObserver?.disconnect();
    markers.forEach(marker => marker.remove());
    markers.clear();
    map?.remove();
  });

  // Update map style when theme changes
  createEffect(() => {
    if (!map || !mapLoaded() || !maptilersdk) return;
    const currentTheme = theme();
    
    // Skip if theme hasn't actually changed (avoid re-setting on initial load)
    if (lastAppliedTheme === currentTheme) return;
    
    // Skip on initial load - the map was already created with the correct style
    if (lastAppliedTheme === null) {
      lastAppliedTheme = currentTheme;
      return;
    }
    
    lastAppliedTheme = currentTheme;
    const newStyle = currentTheme === 'dark'
      ? maptilersdk.MapStyle.STREETS.DARK
      : maptilersdk.MapStyle.STREETS;
    
    // Mark layers as not ready before style change
    setLayersReady(false);
    map.setStyle(newStyle);
  });

  // Update markers when assets change
  createEffect(() => {
    if (!map || !mapLoaded() || !maptilersdk) return;
    
    const currentAssets = props.assets;
    const currentAssetIds = new Set(currentAssets.map(a => a.id));
    const currentSelectedId = props.focusedAssetId || selectedAssetId();

    // Remove markers for assets that no longer exist
    markers.forEach((marker, id) => {
      if (!currentAssetIds.has(id)) {
        marker.remove();
        markers.delete(id);
      }
    });

    // Add or update markers
    currentAssets.forEach(asset => {
      if (!asset.current_location) return;

      const coords: [number, number] = [
        asset.current_location.longitude,
        asset.current_location.latitude,
      ];

      const existingMarker = markers.get(asset.id);
      const color = getStatusColor(asset.status, asset.current_location.speed);
      const icon = getAssetIcon(asset.type);
      const isMoving = asset.current_location.speed > 0;
      const isActive = asset.status === 'active';
      const isSelected = asset.id === currentSelectedId;

      if (existingMarker) {
        // Update position
        existingMarker.setLngLat(coords);
        // Update selected state
        const el = existingMarker.getElement();
        if (el) {
          const highlightRing = el.querySelector('.selected-highlight-ring');
          if (isSelected && !highlightRing) {
            // Add highlight ring
            const ring = document.createElement('div');
            ring.className = 'selected-highlight-ring';
            ring.innerHTML = `
              <div class="absolute inset-0 -m-3 rounded-full border-4 border-blue-500 animate-ping opacity-50"></div>
              <div class="absolute inset-0 -m-2 rounded-full border-3 border-blue-500 opacity-75"></div>
            `;
            ring.style.cssText = 'position: absolute; inset: 0; pointer-events: none;';
            el.querySelector('.marker-wrapper')?.appendChild(ring);
          } else if (!isSelected && highlightRing) {
            // Remove highlight ring
            highlightRing.remove();
          }

          const activeDot = el.querySelector('.active-status-dot') as HTMLElement | null;
          if (isActive) {
            if (!activeDot) {
              const dot = document.createElement('div');
              dot.className = 'active-status-dot';
              dot.style.cssText = `
                position: absolute;
                bottom: -8px;
                left: 50%;
                width: 10px;
                height: 10px;
                border-radius: 9999px;
                border: 2px solid #FFFFFF;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transform: translateX(-50%);
                background-color: ${color};
              `;
              el.querySelector('.marker-wrapper')?.appendChild(dot);
            } else {
              activeDot.style.backgroundColor = color;
            }
          } else if (activeDot) {
            activeDot.remove();
          }
        }
      } else {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div class="marker-wrapper relative cursor-pointer transition-transform hover:scale-110">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2" 
                 style="background-color: ${color}; border-color: white;">
              ${icon}
            </div>
            ${isMoving ? `
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-pulse"></div>
            ` : ''}
            ${isActive ? `
              <div class="active-status-dot" style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                width: 10px;
                height: 10px;
                border-radius: 9999px;
                border: 2px solid #FFFFFF;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transform: translateX(-50%);
                background-color: ${color};
              "></div>
            ` : ''}
            ${isSelected ? `
              <div class="selected-highlight-ring" style="position: absolute; inset: 0; pointer-events: none;">
                <div class="absolute inset-0 -m-3 rounded-full border-4 border-blue-500 animate-ping opacity-50"></div>
                <div class="absolute inset-0 -m-2 rounded-full border-3 border-blue-500 opacity-75"></div>
              </div>
            ` : ''}
          </div>
        `;

        const popupContent = `
          <div class="p-2 min-w-48">
            <div class="font-semibold text-base">${asset.name}</div>
            <div class="text-sm opacity-70 mt-1">${asset.id}</div>
            <hr class="my-2 border-current opacity-20" />
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div class="opacity-50">Status</div>
                <div class="capitalize font-medium">${asset.status}</div>
              </div>
              <div>
                <div class="opacity-50">Speed</div>
                <div class="font-medium">${asset.current_location?.speed ?? 0} km/h</div>
              </div>
            </div>
            <div class="mt-2 text-sm">
              <div class="opacity-50">Location</div>
              <div class="truncate">${asset.current_location?.address ?? 'Unknown'}</div>
            </div>
            <a href="/assets/${asset.id}" 
               class="block text-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              View Details
            </a>
          </div>
        `;

        const popup = new maptilersdk!.Popup({ offset: 25, closeButton: true })
          .setHTML(popupContent);

        const marker = new maptilersdk!.Marker({ element: el })
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map);

        el.addEventListener('click', () => {
          setSelectedAssetId(asset.id);
          props.onAssetClick?.(asset.id);
        });

        markers.set(asset.id, marker);
      }
    });

  });

  // Update active assets dot layer
  createEffect(() => {
    if (!map || !mapLoaded() || !layersReady()) return;

    const activeAssets = props.assets
      .filter(asset => asset.status === 'active' && asset.current_location)
      .map(asset => ({
        type: 'Feature' as const,
        properties: {
          id: asset.id,
          color: getStatusColor(asset.status, asset.current_location?.speed),
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            asset.current_location!.longitude,
            asset.current_location!.latitude,
          ],
        },
      }));

    const activeAssetsData = {
      type: 'FeatureCollection' as const,
      features: activeAssets,
    };

    const activeSource = map.getSource('active-assets');
    if (activeSource) {
      activeSource.setData(activeAssetsData);
    }
  });

  // Update geofences
  createEffect(() => {
    if (!map || !mapLoaded() || !layersReady() || !props.showGeofences) return;

    const geofenceData = {
      type: 'FeatureCollection' as const,
      features: (props.geofences || []).map(g => ({
        type: 'Feature' as const,
        properties: { name: g.name, type: g.type },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [createCirclePolygon(g.center.longitude, g.center.latitude, g.radius)],
        },
      })),
    };

    const source = map.getSource('geofences');
    if (source) {
      source.setData(geofenceData);
    }
  });

  // Update route trail and history points when route trail or selection changes
  createEffect(() => {
    // Use getter function if provided, otherwise fall back to prop value
    const trail = props.getRouteTrail ? props.getRouteTrail() : (props.routeTrail || []);
    const selectedAsset = props.getSelectedAsset ? props.getSelectedAsset() : null;
    
    if (!map || !mapLoaded() || !layersReady()) return;
    
    // Update route trail line
    const routeData = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: trail,
      },
    };

    const routeSource = map.getSource('route-trail');
    if (routeSource) {
      routeSource.setData(routeData);
    }
    
    // Create history point features (skip first - that's the start, and last - that's current position)
    const historyFeatures = trail.length > 2 
      ? trail.slice(1, -1).map((coord, index) => ({
          type: 'Feature' as const,
          properties: {
            index,
            checkpoint: index % 4 === 0,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: coord,
          },
        }))
      : [];
    
    const historyData = {
      type: 'FeatureCollection' as const,
      features: historyFeatures,
    };
    
    const historySource = map.getSource('history-points');
    if (historySource) {
      historySource.setData(historyData);
    }
    
    // Update start point (first point in trail - oldest location)
    const startData = {
      type: 'FeatureCollection' as const,
      features: trail.length > 0 ? [{
        type: 'Feature' as const,
        properties: { label: 'Start' },
        geometry: {
          type: 'Point' as const,
          coordinates: trail[0],
        },
      }] : [],
    };
    
    const startSource = map.getSource('start-point');
    if (startSource) {
      startSource.setData(startData);
    }
    
    // Update current point (last point in trail - newest/current location with status color)
    const currentColor = selectedAsset 
      ? getStatusColor(selectedAsset.status, selectedAsset.current_location?.speed)
      : '#3B82F6';
    
    const currentData = {
      type: 'FeatureCollection' as const,
      features: trail.length > 0 ? [{
        type: 'Feature' as const,
        properties: { 
          label: 'Current',
          color: currentColor,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: trail[trail.length - 1],
        },
      }] : [],
    };
    
    const currentSource = map.getSource('current-point');
    if (currentSource) {
      currentSource.setData(currentData);
    }
  });

  // Focus on asset when focusedAssetId changes
  createEffect(() => {
    const focusId = props.focusedAssetId || selectedAssetId();
    if (!map || !mapLoaded() || !focusId) return;

    const asset = props.assets.find(a => a.id === focusId);
    if (asset?.current_location) {
      map.flyTo({
        center: [asset.current_location.longitude, asset.current_location.latitude],
        zoom: 12,
        duration: 1000,
      });

      // Open popup
      const marker = markers.get(focusId);
      if (marker) {
        marker.togglePopup();
      }
    }
  });
  
  // Update marker highlights when selection changes
  createEffect(() => {
    if (!map || !mapLoaded()) return;
    
    const currentSelectedId = props.focusedAssetId || selectedAssetId();
    
    // Update all markers' highlight state
    markers.forEach((marker, assetId) => {
      const el = marker.getElement();
      if (!el) return;
      
      const wrapper = el.querySelector('.marker-wrapper');
      if (!wrapper) return;
      
      const existingRing = wrapper.querySelector('.selected-highlight-ring');
      const isSelected = assetId === currentSelectedId;
      
      if (isSelected && !existingRing) {
        // Add highlight ring
        const ring = document.createElement('div');
        ring.className = 'selected-highlight-ring';
        ring.style.cssText = 'position: absolute; inset: 0; pointer-events: none; z-index: -1;';
        ring.innerHTML = `
          <div style="position: absolute; inset: -12px; border-radius: 9999px; border: 4px solid #3B82F6; opacity: 0.5;"></div>
          <div style="position: absolute; inset: -8px; border-radius: 9999px; border: 3px solid #3B82F6; opacity: 0.75;"></div>
        `;
        wrapper.appendChild(ring);
      } else if (!isSelected && existingRing) {
        // Remove highlight ring
        existingRing.remove();
      }
    });
  });

  return (
    <div 
      class="map-container w-full relative" 
      style={{ height: props.height || '100%' }}
    >
      {/* Loading/Error state */}
      <Show when={!mounted() || mapError()}>
        <div class="absolute inset-0 flex items-center justify-center bg-base-200 z-20">
          <Show when={mapError()} fallback={
            <span class="loading loading-spinner loading-lg text-primary"></span>
          }>
            <div class="text-center p-4">
              <div class="text-error text-lg mb-2">Map Error</div>
              <div class="text-base-content/70 text-sm max-w-md">{mapError()}</div>
            </div>
          </Show>
        </div>
      </Show>
      
      {/* Map container - always in DOM for hydration consistency */}
      <div 
        ref={mapContainer} 
        class="w-full h-full"
      />
    </div>
  );
};

// Helper to create a circle polygon for geofences
function createCirclePolygon(lng: number, lat: number, radiusMeters: number, points = 64): number[][] {
  const coords: number[][] = [];
  const km = radiusMeters / 1000;
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * (2 * Math.PI);
    const dx = km * Math.cos(angle);
    const dy = km * Math.sin(angle);
    
    // Approximate conversion (works for small distances)
    const newLng = lng + (dx / (111.32 * Math.cos(lat * Math.PI / 180)));
    const newLat = lat + (dy / 110.574);
    
    coords.push([newLng, newLat]);
  }
  
  return coords;
}

export default MapView;
