import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
}

const GoogleMap: React.FC<MapProps> = ({ center, zoom, onLocationSelect, markers = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
      });
      
      const newGeocoder = new google.maps.Geocoder();
      setGeocoder(newGeocoder);
      setMap(newMap);

      // Add click listener for location selection
      if (onLocationSelect) {
        newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            // Reverse geocode to get address
            newGeocoder.geocode(
              { location: { lat, lng } },
              (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  onLocationSelect(lat, lng, results[0].formatted_address);
                } else {
                  onLocationSelect(lat, lng);
                }
              }
            );
          }
        });
      }
    }
  }, [map, center, zoom, onLocationSelect]);

  // Update map center when center prop changes
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (map) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      markers.forEach(markerData => {
        const marker = new google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map,
          title: markerData.title,
        });
        markersRef.current.push(marker);
      });
    }
  }, [map, markers]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMap;