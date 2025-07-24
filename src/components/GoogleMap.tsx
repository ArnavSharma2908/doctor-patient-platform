import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Doctor, Location } from '@/types';

interface MapProps {
  initialCenter?: Location;
  zoom?: number;
  doctors?: Doctor[];
  onMapClick?: (location: Location) => void;
  height?: string;
  width?: string;
  showMarkers?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const GoogleMapComponent = ({
  initialCenter = { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore
  zoom = 12,
  doctors = [],
  onMapClick,
  height = '400px',
  width = '100%',
  showMarkers = true,
}: MapProps) => {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Store map reference when the map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle map click to get coordinates
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (onMapClick && e.latLng) {
      onMapClick({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  }, [onMapClick]);

  return (
    <div style={{ height, width }}>
      <LoadScript googleMapsApiKey={"AIzaSyCP2EbMP8dQp3UPlfiMTmNYcAIURRuKgPQ"}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={initialCenter}
          zoom={zoom}
          onClick={handleMapClick}
          onLoad={onMapLoad}
        >
          {/* Pin for selected location */}
          {onMapClick && (
            <Marker
              position={initialCenter}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
            />
          )}

          {/* Show doctor markers if showMarkers is true */}
          {showMarkers &&
            doctors.map((doctor) => (
              <Marker
                key={doctor._id}
                position={{
                  lat: doctor.clinic.location.coordinates[1],
                  lng: doctor.clinic.location.coordinates[0],
                }}
                onClick={() => setSelected(doctor)}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                }}
              />
            ))}

          {/* Info window for selected doctor */}
          {selected && (
            <InfoWindow
              position={{
                lat: selected.clinic.location.coordinates[1],
                lng: selected.clinic.location.coordinates[0],
              }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="p-2">
                <h3 className="font-bold">{selected.name}</h3>
                <p className="text-sm">{selected.specialization}</p>
                <p className="text-xs">{selected.clinic.name}</p>
                <p className="text-xs text-gray-500">{selected.clinic.address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;