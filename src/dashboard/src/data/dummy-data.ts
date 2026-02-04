import type { Asset, Geofence, LocationHistory, Event, Location } from '~/types';

// Helper to generate timestamps
const hoursAgo = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

const minutesAgo = (minutes: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

// Southeast Asia locations from POC spec
export const LOCATIONS = {
  // Singapore
  SINGAPORE_CBD: { lat: 1.2900, lng: 103.8500, address: 'Central Business District, Singapore' },
  CHANGI_AIRPORT: { lat: 1.3644, lng: 103.9944, address: 'Changi Airport, Singapore' },
  JURONG_PORT: { lat: 1.3167, lng: 103.7167, address: 'Jurong Port, Singapore' },
  TUAS_PORT: { lat: 1.2833, lng: 103.6333, address: 'Tuas Port, Singapore' },
  
  // Malaysia
  KUALA_LUMPUR: { lat: 3.1390, lng: 101.6869, address: 'Kuala Lumpur, Malaysia' },
  PORT_KLANG: { lat: 3.0000, lng: 101.3833, address: 'Port Klang, Malaysia' },
  JOHOR_BAHRU: { lat: 1.4927, lng: 103.7636, address: 'Johor Bahru, Malaysia' },
  PENANG: { lat: 5.4164, lng: 100.3297, address: 'Penang, Malaysia' },
  
  // Thailand
  BANGKOK: { lat: 13.7563, lng: 100.5018, address: 'Bangkok, Thailand' },
  LAEM_CHABANG: { lat: 13.0833, lng: 100.8833, address: 'Laem Chabang Port, Thailand' },
  RAYONG: { lat: 12.6814, lng: 101.2569, address: 'Rayong, Thailand' },
  CHIANG_MAI: { lat: 18.7883, lng: 98.9853, address: 'Chiang Mai, Thailand' },
  
  // Indonesia
  JAKARTA: { lat: -6.2088, lng: 106.8451, address: 'Jakarta, Indonesia' },
  SURABAYA: { lat: -7.2575, lng: 112.7521, address: 'Surabaya, Indonesia' },
  BATAM: { lat: 1.0833, lng: 104.0167, address: 'Batam, Indonesia' },
  MEDAN: { lat: 3.5952, lng: 98.6722, address: 'Medan, Indonesia' },
  
  // Philippines
  MANILA: { lat: 14.5995, lng: 120.9842, address: 'Manila, Philippines' },
  CEBU: { lat: 10.3157, lng: 123.8854, address: 'Cebu, Philippines' },
  DAVAO: { lat: 7.1907, lng: 125.6128, address: 'Davao, Philippines' },
  SUBIC_BAY: { lat: 14.8000, lng: 120.2833, address: 'Subic Bay, Philippines' },
  
  // Vietnam
  HO_CHI_MINH: { lat: 10.8231, lng: 106.6297, address: 'Ho Chi Minh City, Vietnam' },
  HANOI: { lat: 21.0278, lng: 105.8342, address: 'Hanoi, Vietnam' },
  HAI_PHONG: { lat: 20.8561, lng: 106.6822, address: 'Hai Phong, Vietnam' },
  DA_NANG: { lat: 16.0544, lng: 108.2208, address: 'Da Nang, Vietnam' },
} as const;

// 15 Assets across Southeast Asia
export const assets: Asset[] = [
  {
    id: 'TRUCK-SG-001',
    name: 'Singapore Express Delivery',
    type: 'truck',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.CHANGI_AIRPORT.lat,
      longitude: LOCATIONS.CHANGI_AIRPORT.lng,
      address: LOCATIONS.CHANGI_AIRPORT.address,
      timestamp: minutesAgo(2),
      speed: 45.5,
      heading: 180,
      accuracy: 5.0,
    },
    last_update: minutesAgo(2),
    driver: {
      name: 'Ahmad bin Hassan',
      phone: '+65 9123 4567',
    },
    route: {
      origin: 'Singapore Warehouse',
      destination: 'Kuala Lumpur Distribution Center',
      progress: 35.5,
    },
    created_at: hoursAgo(720), // 30 days ago
  },
  {
    id: 'VAN-MY-002',
    name: 'KL Express Van',
    type: 'van',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.KUALA_LUMPUR.lat,
      longitude: LOCATIONS.KUALA_LUMPUR.lng,
      address: LOCATIONS.KUALA_LUMPUR.address,
      timestamp: minutesAgo(5),
      speed: 60.0,
      heading: 90,
      accuracy: 8.0,
    },
    last_update: minutesAgo(5),
    driver: {
      name: 'Siti Nurhaliza',
      phone: '+60 12-345 6789',
    },
    created_at: hoursAgo(480),
  },
  {
    id: 'MOTO-TH-003',
    name: 'Bangkok Courier',
    type: 'motorcycle',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.BANGKOK.lat,
      longitude: LOCATIONS.BANGKOK.lng,
      address: LOCATIONS.BANGKOK.address,
      timestamp: minutesAgo(1),
      speed: 35.0,
      heading: 270,
      accuracy: 10.0,
    },
    last_update: minutesAgo(1),
    driver: {
      name: 'Somchai Jaidee',
      phone: '+66 81 234 5678',
    },
    created_at: hoursAgo(360),
  },
  {
    id: 'TRUCK-ID-004',
    name: 'Jakarta Freight',
    type: 'truck',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.JAKARTA.lat,
      longitude: LOCATIONS.JAKARTA.lng,
      address: LOCATIONS.JAKARTA.address,
      timestamp: minutesAgo(8),
      speed: 25.0,
      heading: 45,
      accuracy: 12.0,
    },
    last_update: minutesAgo(8),
    driver: {
      name: 'Budi Santoso',
      phone: '+62 812 3456 7890',
    },
    route: {
      origin: 'Jakarta Distribution Hub',
      destination: 'Bandung',
      progress: 15.0,
    },
    created_at: hoursAgo(600),
  },
  {
    id: 'VAN-PH-005',
    name: 'Manila Delivery',
    type: 'van',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.MANILA.lat,
      longitude: LOCATIONS.MANILA.lng,
      address: LOCATIONS.MANILA.address,
      timestamp: minutesAgo(3),
      speed: 40.0,
      heading: 180,
      accuracy: 6.0,
    },
    last_update: minutesAgo(3),
    driver: {
      name: 'Juan dela Cruz',
      phone: '+63 917 123 4567',
    },
    created_at: hoursAgo(240),
  },
  {
    id: 'TRUCK-VN-006',
    name: 'Ho Chi Minh Transport',
    type: 'truck',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.HO_CHI_MINH.lat,
      longitude: LOCATIONS.HO_CHI_MINH.lng,
      address: LOCATIONS.HO_CHI_MINH.address,
      timestamp: minutesAgo(4),
      speed: 55.0,
      heading: 0,
      accuracy: 7.0,
    },
    last_update: minutesAgo(4),
    driver: {
      name: 'Nguyen Van Minh',
      phone: '+84 90 123 4567',
    },
    route: {
      origin: 'Ho Chi Minh City',
      destination: 'Vung Tau',
      progress: 45.0,
    },
    created_at: hoursAgo(480),
  },
  {
    id: 'MOTO-SG-007',
    name: 'Singapore Last Mile',
    type: 'motorcycle',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.SINGAPORE_CBD.lat,
      longitude: LOCATIONS.SINGAPORE_CBD.lng,
      address: LOCATIONS.SINGAPORE_CBD.address,
      timestamp: minutesAgo(1),
      speed: 28.0,
      heading: 120,
      accuracy: 4.0,
    },
    last_update: minutesAgo(1),
    driver: {
      name: 'Tan Wei Ming',
      phone: '+65 8234 5678',
    },
    created_at: hoursAgo(120),
  },
  {
    id: 'VAN-MY-008',
    name: 'Penang Express',
    type: 'van',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.PENANG.lat,
      longitude: LOCATIONS.PENANG.lng,
      address: LOCATIONS.PENANG.address,
      timestamp: minutesAgo(15),
      speed: 0.0,
      heading: 90,
      accuracy: 5.0,
    },
    last_update: minutesAgo(15),
    driver: {
      name: 'Lee Chong Wei',
      phone: '+60 16-789 0123',
    },
    created_at: hoursAgo(360),
  },
  {
    id: 'TRUCK-TH-009',
    name: 'Rayong Logistics',
    type: 'truck',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.RAYONG.lat,
      longitude: LOCATIONS.RAYONG.lng,
      address: LOCATIONS.RAYONG.address,
      timestamp: minutesAgo(6),
      speed: 70.0,
      heading: 225,
      accuracy: 8.0,
    },
    last_update: minutesAgo(6),
    driver: {
      name: 'Prasert Chai',
      phone: '+66 89 012 3456',
    },
    route: {
      origin: 'Rayong',
      destination: 'Bangkok Warehouse',
      progress: 60.0,
    },
    created_at: hoursAgo(400),
  },
  {
    id: 'VAN-ID-010',
    name: 'Surabaya Delivery',
    type: 'van',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.SURABAYA.lat,
      longitude: LOCATIONS.SURABAYA.lng,
      address: LOCATIONS.SURABAYA.address,
      timestamp: minutesAgo(10),
      speed: 45.0,
      heading: 315,
      accuracy: 10.0,
    },
    last_update: minutesAgo(10),
    driver: {
      name: 'Dewi Lestari',
      phone: '+62 856 7890 1234',
    },
    created_at: hoursAgo(500),
  },
  {
    id: 'MOTO-PH-011',
    name: 'Cebu Courier',
    type: 'motorcycle',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.CEBU.lat,
      longitude: LOCATIONS.CEBU.lng,
      address: LOCATIONS.CEBU.address,
      timestamp: minutesAgo(2),
      speed: 32.0,
      heading: 60,
      accuracy: 6.0,
    },
    last_update: minutesAgo(2),
    driver: {
      name: 'Pedro Santos',
      phone: '+63 927 890 1234',
    },
    created_at: hoursAgo(180),
  },
  {
    id: 'TRUCK-VN-012',
    name: 'Hanoi Freight',
    type: 'truck',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.HANOI.lat,
      longitude: LOCATIONS.HANOI.lng,
      address: LOCATIONS.HANOI.address,
      timestamp: minutesAgo(7),
      speed: 50.0,
      heading: 135,
      accuracy: 9.0,
    },
    last_update: minutesAgo(7),
    driver: {
      name: 'Tran Van Duc',
      phone: '+84 91 234 5678',
    },
    route: {
      origin: 'Hanoi',
      destination: 'Hai Phong Port',
      progress: 30.0,
    },
    created_at: hoursAgo(550),
  },
  {
    id: 'VAN-SG-013',
    name: 'Tuas Port Van',
    type: 'van',
    status: 'inactive',
    current_location: {
      latitude: LOCATIONS.TUAS_PORT.lat,
      longitude: LOCATIONS.TUAS_PORT.lng,
      address: LOCATIONS.TUAS_PORT.address,
      timestamp: hoursAgo(2),
      speed: 0.0,
      heading: 0,
      accuracy: 5.0,
    },
    last_update: hoursAgo(2),
    created_at: hoursAgo(600),
  },
  {
    id: 'TRUCK-MY-014',
    name: 'Port Klang Transport',
    type: 'truck',
    status: 'active',
    current_location: {
      latitude: LOCATIONS.PORT_KLANG.lat,
      longitude: LOCATIONS.PORT_KLANG.lng,
      address: LOCATIONS.PORT_KLANG.address,
      timestamp: minutesAgo(12),
      speed: 30.0,
      heading: 270,
      accuracy: 8.0,
    },
    last_update: minutesAgo(12),
    driver: {
      name: 'Razak Abdullah',
      phone: '+60 19-456 7890',
    },
    route: {
      origin: 'Port Klang',
      destination: 'Kuala Lumpur',
      progress: 25.0,
    },
    created_at: hoursAgo(450),
  },
  {
    id: 'MOTO-TH-015',
    name: 'Chiang Mai Courier',
    type: 'motorcycle',
    status: 'maintenance',
    current_location: {
      latitude: LOCATIONS.CHIANG_MAI.lat,
      longitude: LOCATIONS.CHIANG_MAI.lng,
      address: LOCATIONS.CHIANG_MAI.address,
      timestamp: hoursAgo(4),
      speed: 0.0,
      heading: 0,
      accuracy: 5.0,
    },
    last_update: hoursAgo(4),
    driver: {
      name: 'Niran Srikam',
      phone: '+66 85 678 9012',
    },
    created_at: hoursAgo(300),
  },
];

// Geofences for warehouses and ports
export const geofences: Geofence[] = [
  {
    id: 'geofence-001',
    name: 'Singapore Warehouse',
    type: 'warehouse',
    center: { latitude: LOCATIONS.JURONG_PORT.lat, longitude: LOCATIONS.JURONG_PORT.lng },
    radius: 500,
    country: 'Singapore',
  },
  {
    id: 'geofence-002',
    name: 'Port Klang',
    type: 'port',
    center: { latitude: LOCATIONS.PORT_KLANG.lat, longitude: LOCATIONS.PORT_KLANG.lng },
    radius: 2000,
    country: 'Malaysia',
  },
  {
    id: 'geofence-003',
    name: 'KL Distribution Center',
    type: 'hub',
    center: { latitude: LOCATIONS.KUALA_LUMPUR.lat, longitude: LOCATIONS.KUALA_LUMPUR.lng },
    radius: 800,
    country: 'Malaysia',
  },
  {
    id: 'geofence-004',
    name: 'Bangkok Warehouse',
    type: 'warehouse',
    center: { latitude: LOCATIONS.BANGKOK.lat, longitude: LOCATIONS.BANGKOK.lng },
    radius: 600,
    country: 'Thailand',
  },
  {
    id: 'geofence-005',
    name: 'Laem Chabang Port',
    type: 'port',
    center: { latitude: LOCATIONS.LAEM_CHABANG.lat, longitude: LOCATIONS.LAEM_CHABANG.lng },
    radius: 2500,
    country: 'Thailand',
  },
  {
    id: 'geofence-006',
    name: 'Jakarta Distribution Hub',
    type: 'hub',
    center: { latitude: LOCATIONS.JAKARTA.lat, longitude: LOCATIONS.JAKARTA.lng },
    radius: 700,
    country: 'Indonesia',
  },
  {
    id: 'geofence-007',
    name: 'Manila Port',
    type: 'port',
    center: { latitude: LOCATIONS.MANILA.lat, longitude: LOCATIONS.MANILA.lng },
    radius: 1500,
    country: 'Philippines',
  },
  {
    id: 'geofence-008',
    name: 'Ho Chi Minh Depot',
    type: 'depot',
    center: { latitude: LOCATIONS.HO_CHI_MINH.lat, longitude: LOCATIONS.HO_CHI_MINH.lng },
    radius: 600,
    country: 'Vietnam',
  },
];

// Generate location history along a route with waypoints (follows roads, not straight lines)
function generateLocationHistoryWithWaypoints(
  assetId: string, 
  waypoints: { lat: number; lng: number; address: string }[],
  pointsPerSegment: number = 4
): LocationHistory {
  const locations: Location[] = [];
  const now = new Date();
  
  // Generate points along each segment between waypoints
  const totalSegments = waypoints.length - 1;
  const totalPoints = totalSegments * pointsPerSegment + 1;
  let pointIndex = 0;
  
  for (let seg = 0; seg < totalSegments; seg++) {
    const start = waypoints[seg];
    const end = waypoints[seg + 1];
    const pointsInThisSegment = seg === totalSegments - 1 ? pointsPerSegment + 1 : pointsPerSegment;
    
    for (let i = 0; i < pointsInThisSegment; i++) {
      const progress = i / pointsPerSegment;
      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;
      
      const hoursBack = (totalPoints - pointIndex) * 0.5; // 30 min intervals
      const timestamp = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
      
      // Simulate speed variations
      let speed = 0;
      const overallProgress = pointIndex / (totalPoints - 1);
      if (pointIndex === 0 || pointIndex === totalPoints - 1) {
        speed = 0; // Stopped at start/end
      } else if (overallProgress < 0.15 || overallProgress > 0.85) {
        speed = 20 + Math.random() * 20; // Urban speeds near start/end
      } else {
        speed = 50 + Math.random() * 30; // Highway speeds
      }
      
      // Calculate heading based on direction to next waypoint
      const heading = Math.atan2(end.lng - start.lng, end.lat - start.lat) * (180 / Math.PI);
      
      locations.push({
        latitude: lat + (Math.random() - 0.5) * 0.005, // Small variation
        longitude: lng + (Math.random() - 0.5) * 0.005,
        address: i === 0 ? start.address : `En route to ${end.address}`,
        timestamp: timestamp.toISOString(),
        speed: Math.round(speed * 10) / 10,
        heading: (heading + 360) % 360,
        accuracy: 5 + Math.random() * 10,
      });
      
      pointIndex++;
    }
  }
  
  return { asset_id: assetId, locations };
}

// Define realistic road-following routes for each asset
const ROUTES = {
  // Singapore: CBD to Changi Airport via ECP (East Coast Parkway)
  'TRUCK-SG-001': [
    { lat: 1.2900, lng: 103.8500, address: 'Central Business District, Singapore' },
    { lat: 1.2950, lng: 103.8700, address: 'Marina Bay, Singapore' },
    { lat: 1.3050, lng: 103.9100, address: 'East Coast Park, Singapore' },
    { lat: 1.3200, lng: 103.9400, address: 'Bedok, Singapore' },
    { lat: 1.3400, lng: 103.9650, address: 'Tampines, Singapore' },
    { lat: 1.3644, lng: 103.9944, address: 'Changi Airport, Singapore' },
  ],
  
  // Malaysia: Port Klang to KL via Federal Highway
  'VAN-MY-002': [
    { lat: 3.0000, lng: 101.3833, address: 'Port Klang, Malaysia' },
    { lat: 3.0200, lng: 101.4500, address: 'Klang, Malaysia' },
    { lat: 3.0500, lng: 101.5200, address: 'Shah Alam, Malaysia' },
    { lat: 3.0800, lng: 101.5800, address: 'Petaling Jaya, Malaysia' },
    { lat: 3.1390, lng: 101.6869, address: 'Kuala Lumpur, Malaysia' },
  ],
  
  // Thailand: Bangkok inner city route (motorcycle courier - stays within city)
  'MOTO-TH-003': [
    { lat: 13.7280, lng: 100.5200, address: 'Silom, Bangkok' },
    { lat: 13.7400, lng: 100.5100, address: 'Siam, Bangkok' },
    { lat: 13.7500, lng: 100.5000, address: 'Ratchathewi, Bangkok' },
    { lat: 13.7563, lng: 100.5018, address: 'Victory Monument, Bangkok' },
  ],
  
  // Indonesia: Jakarta to Bandung via toll road (not Surabaya - too far over water)
  'TRUCK-ID-004': [
    { lat: -6.2088, lng: 106.8451, address: 'Jakarta, Indonesia' },
    { lat: -6.3000, lng: 106.9000, address: 'Bekasi, Indonesia' },
    { lat: -6.4000, lng: 107.1000, address: 'Karawang, Indonesia' },
    { lat: -6.5500, lng: 107.3500, address: 'Purwakarta, Indonesia' },
    { lat: -6.7000, lng: 107.5000, address: 'Padalarang, Indonesia' },
    { lat: -6.9175, lng: 107.6191, address: 'Bandung, Indonesia' },
  ],
  
  // Vietnam: Ho Chi Minh City to Vung Tau (coastal but on land)
  'TRUCK-VN-006': [
    { lat: 10.8231, lng: 106.6297, address: 'Ho Chi Minh City, Vietnam' },
    { lat: 10.7500, lng: 106.7000, address: 'Thu Duc, Vietnam' },
    { lat: 10.6500, lng: 106.8500, address: 'Bien Hoa, Vietnam' },
    { lat: 10.5000, lng: 107.0000, address: 'Long Thanh, Vietnam' },
    { lat: 10.4000, lng: 107.1000, address: 'Ba Ria, Vietnam' },
    { lat: 10.3460, lng: 107.0843, address: 'Vung Tau, Vietnam' },
  ],
  
  // Thailand: Rayong to Bangkok via Highway 3 (land route around the bay)
  'TRUCK-TH-009': [
    { lat: 12.6814, lng: 101.2569, address: 'Rayong, Thailand' },
    { lat: 12.9000, lng: 101.1500, address: 'Ban Chang, Thailand' },
    { lat: 13.1200, lng: 100.9200, address: 'Si Racha, Thailand' },
    { lat: 13.3500, lng: 100.9800, address: 'Chonburi, Thailand' },
    { lat: 13.5000, lng: 100.8500, address: 'Bang Pakong, Thailand' },
    { lat: 13.6500, lng: 100.6500, address: 'Samut Prakan, Thailand' },
    { lat: 13.7563, lng: 100.5018, address: 'Bangkok, Thailand' },
  ],
  
  // Vietnam: Hanoi to Hai Phong via Highway 5
  'TRUCK-VN-012': [
    { lat: 21.0278, lng: 105.8342, address: 'Hanoi, Vietnam' },
    { lat: 20.9500, lng: 106.0500, address: 'Gia Lam, Vietnam' },
    { lat: 20.9000, lng: 106.3000, address: 'Hai Duong, Vietnam' },
    { lat: 20.8561, lng: 106.6822, address: 'Hai Phong, Vietnam' },
  ],
  
  // Malaysia: Port Klang to KL (same as VAN-MY-002)
  'TRUCK-MY-014': [
    { lat: 3.0000, lng: 101.3833, address: 'Port Klang, Malaysia' },
    { lat: 3.0300, lng: 101.4800, address: 'Klang Town, Malaysia' },
    { lat: 3.0700, lng: 101.5500, address: 'Subang, Malaysia' },
    { lat: 3.1390, lng: 101.6869, address: 'Kuala Lumpur, Malaysia' },
  ],
};

// Pre-generated location histories for key assets (using realistic road routes)
export const locationHistories: Record<string, LocationHistory> = {
  'TRUCK-SG-001': generateLocationHistoryWithWaypoints('TRUCK-SG-001', ROUTES['TRUCK-SG-001'], 4),
  'VAN-MY-002': generateLocationHistoryWithWaypoints('VAN-MY-002', ROUTES['VAN-MY-002'], 4),
  'MOTO-TH-003': generateLocationHistoryWithWaypoints('MOTO-TH-003', ROUTES['MOTO-TH-003'], 3),
  'TRUCK-ID-004': generateLocationHistoryWithWaypoints('TRUCK-ID-004', ROUTES['TRUCK-ID-004'], 5),
  'TRUCK-VN-006': generateLocationHistoryWithWaypoints('TRUCK-VN-006', ROUTES['TRUCK-VN-006'], 4),
  'TRUCK-TH-009': generateLocationHistoryWithWaypoints('TRUCK-TH-009', ROUTES['TRUCK-TH-009'], 3),
  'TRUCK-VN-012': generateLocationHistoryWithWaypoints('TRUCK-VN-012', ROUTES['TRUCK-VN-012'], 3),
  'TRUCK-MY-014': generateLocationHistoryWithWaypoints('TRUCK-MY-014', ROUTES['TRUCK-MY-014'], 3),
};

// Generate events for an asset
function generateEvents(assetId: string, assetName: string): Event[] {
  const events: Event[] = [];
  const now = new Date();
  
  // Generate various event types
  events.push({
    id: `${assetId}-evt-001`,
    asset_id: assetId,
    type: 'location_update',
    timestamp: minutesAgo(2),
    description: `Location updated for ${assetName}`,
  });
  
  events.push({
    id: `${assetId}-evt-002`,
    asset_id: assetId,
    type: 'speed_change',
    timestamp: minutesAgo(15),
    description: `Speed changed from 45 km/h to 60 km/h`,
    data: { previous_speed: 45, new_speed: 60 },
  });
  
  events.push({
    id: `${assetId}-evt-003`,
    asset_id: assetId,
    type: 'geofence_exit',
    timestamp: minutesAgo(30),
    description: `Exited geofence: Singapore Warehouse`,
    data: { geofence_id: 'geofence-001', geofence_name: 'Singapore Warehouse' },
  });
  
  events.push({
    id: `${assetId}-evt-004`,
    asset_id: assetId,
    type: 'status_change',
    timestamp: hoursAgo(1),
    description: `Status changed to Active`,
    data: { previous_status: 'idle', new_status: 'active' },
  });
  
  events.push({
    id: `${assetId}-evt-005`,
    asset_id: assetId,
    type: 'geofence_entry',
    timestamp: hoursAgo(2),
    description: `Entered geofence: Singapore Warehouse`,
    data: { geofence_id: 'geofence-001', geofence_name: 'Singapore Warehouse' },
  });
  
  return events;
}

// Pre-generated events for all assets
export const assetEvents: Record<string, Event[]> = {};
assets.forEach(asset => {
  assetEvents[asset.id] = generateEvents(asset.id, asset.name);
});

// Generate speed data for charts (last 24 hours)
export function generateSpeedData(assetId: string): { timestamp: string; speed: number }[] {
  const data: { timestamp: string; speed: number }[] = [];
  const now = new Date();
  
  for (let i = 48; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 min intervals
    
    // Simulate realistic speed patterns
    let baseSpeed = 0;
    const hour = timestamp.getHours();
    
    if (hour >= 22 || hour < 6) {
      // Night - mostly stopped or slow
      baseSpeed = Math.random() < 0.7 ? 0 : 20 + Math.random() * 20;
    } else if (hour >= 7 && hour <= 9) {
      // Morning rush - variable speeds
      baseSpeed = 20 + Math.random() * 40;
    } else if (hour >= 17 && hour <= 19) {
      // Evening rush - variable speeds
      baseSpeed = 15 + Math.random() * 35;
    } else {
      // Normal hours - higher speeds
      baseSpeed = 40 + Math.random() * 40;
    }
    
    data.push({
      timestamp: timestamp.toISOString(),
      speed: Math.round(baseSpeed * 10) / 10,
    });
  }
  
  return data;
}

// Helper functions for data access
export function getAssetById(id: string): Asset | undefined {
  return assets.find(a => a.id === id);
}

export function getLocationHistory(assetId: string): LocationHistory | undefined {
  return locationHistories[assetId];
}

export function getAssetEvents(assetId: string): Event[] {
  return assetEvents[assetId] || [];
}

export function getGeofenceById(id: string): Geofence | undefined {
  return geofences.find(g => g.id === id);
}

// Calculate datahub stats
export function getDatahubStats() {
  const activeAssets = assets.filter(a => a.status === 'active').length;
  const movingAssets = assets.filter(a => 
    a.status === 'active' && 
    a.current_location && 
    a.current_location.speed > 0
  ).length;
  const alerts = assets.filter(a => a.status === 'maintenance').length;
  
  return {
    totalAssets: assets.length,
    activeAssets,
    movingAssets,
    alerts,
  };
}

// Map center for Southeast Asia view
export const MAP_CENTER: [number, number] = [103.8198, 1.3521]; // Singapore
export const MAP_ZOOM = 5;
export const MAP_BOUNDS = {
  north: 20.0,
  south: -10.0,
  east: 130.0,
  west: 95.0,
};
