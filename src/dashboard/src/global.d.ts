/// <reference types="@solidjs/start/env" />

// Mapbox GL JS type augmentation
declare module 'mapbox-gl' {
  export interface MapboxOptions {
    accessToken?: string;
  }
}
