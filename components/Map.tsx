'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import type { DrivingData } from '@/lib/validation';

// Add type declarations for rotated marker
declare module 'leaflet' {
  interface Marker {
    setRotationAngle(angle: number): void;
    setRotationOrigin(origin: string): void;
  }
}

// Helper function to calculate bearing between two points
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const λ1 = toRad(lon1);
  const λ2 = toRad(lon2);

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  
  return (toDeg(θ) + 360) % 360;
}

interface MapProps {
  data: DrivingData;
  showMarkers?: boolean;
  currentPosition?: number;
}

export default function Map({ data, showMarkers = false, currentPosition = 0 }: MapProps) {
  const routeCoordinates = data.data.map(point => [point.latitude, point.longitude] as [number, number]);
  const center = routeCoordinates[0];
  const prevBearingRef = useRef<number>(0);

  // Create segments with colors based on speed changes
  const segments = routeCoordinates.slice(1).map((coord, i) => {
    const currentSpeed = data.data[i + 1].speed;
    const prevSpeed = data.data[i].speed;
    const color = currentSpeed > prevSpeed ? '#22c55e' : '#ef4444';
    return {
      coordinates: [routeCoordinates[i], coord],
      color
    };
  });

  // Calculate bearing for current position
  const getBearing = (): number => {
    if (currentPosition <= 0 || currentPosition >= routeCoordinates.length - 1) return 0;

    // Use a window of points before and after current position
    const windowSize = 3;
    const startIdx = Math.max(0, currentPosition - windowSize);
    const endIdx = Math.min(routeCoordinates.length - 1, currentPosition + windowSize);

    // Calculate average position before current point
    let prevLat = 0, prevLon = 0, count = 0;
    for (let i = startIdx; i < currentPosition; i++) {
      prevLat += routeCoordinates[i][0];
      prevLon += routeCoordinates[i][1];
      count++;
    }
    prevLat = count > 0 ? prevLat / count : routeCoordinates[currentPosition][0];
    prevLon = count > 0 ? prevLon / count : routeCoordinates[currentPosition][1];

    // Calculate average position after current point
    let nextLat = 0, nextLon = 0;
    count = 0;
    for (let i = currentPosition + 1; i <= endIdx; i++) {
      nextLat += routeCoordinates[i][0];
      nextLon += routeCoordinates[i][1];
      count++;
    }
    nextLat = count > 0 ? nextLat / count : routeCoordinates[currentPosition][0];
    nextLon = count > 0 ? nextLon / count : routeCoordinates[currentPosition][1];

    // Check if there's enough movement to calculate new bearing
    const minMovement = 0.00001;
    if (Math.abs(nextLat - prevLat) > minMovement || Math.abs(nextLon - prevLon) > minMovement) {
      const newBearing = calculateBearing(prevLat, prevLon, nextLat, nextLon);
      prevBearingRef.current = newBearing;
      return newBearing;
    }

    // If not enough movement, maintain previous bearing
    return prevBearingRef.current;
  };

  const markerRef = useRef<L.Marker | null>(null);
  const bearing = getBearing();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setRotationAngle(bearing);
      markerRef.current.setRotationOrigin('center center');
    }
  }, [bearing, currentPosition]);

  // Create navigation arrow icon for current position
  const arrowIcon = new L.Icon({
    iconUrl: '/arrow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    className: 'arrow-icon'
  });

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="dark-theme"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Draw colored segments */}
        {segments.map((segment, i) => (
          <Polyline
            key={i}
            positions={segment.coordinates}
            pathOptions={{ color: segment.color, weight: 3 }}
          />
        ))}

        {/* Show start and end markers if enabled */}
        {showMarkers && (
          <>
            <Marker 
              position={routeCoordinates[0]}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
            <Marker 
              position={routeCoordinates[routeCoordinates.length - 1]}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
          </>
        )}

        {/* Show current position marker */}
        {currentPosition > 0 && (
          <Marker 
            position={routeCoordinates[currentPosition]}
            icon={arrowIcon}
            ref={markerRef}
          />
        )}
      </MapContainer>
    </div>
  );
}

