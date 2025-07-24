import React, { useState, useCallback } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import axios from 'axios';
import GoogleMap from './GoogleMap';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  clinicName: string;
  address: string;
  location: {
    coordinates: [number, number];
  };
  phone?: string;
  email?: string;
}

const PatientSearch: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState({
    lat: 12.9716, // Default to Bangalore coordinates
    lng: 77.5946
  });
  const [searchArea, setSearchArea] = useState('');
  const [radius, setRadius] = useState(5000); // 5km default
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState('');

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setSearchLocation({ lat, lng });
  }, []);

  const searchByLocation = async () => {
    setIsSearching(true);
    setMessage('');

    try {
      const response = await axios.get('http://localhost:12000/api/doctors/search', {
        params: {
          lat: searchLocation.lat,
          lng: searchLocation.lng,
          radius: radius
        }
      });
      setDoctors(response.data);
      setMessage(`Found ${response.data.length} doctors within ${radius/1000}km`);
    } catch (error: any) {
      setMessage('Error searching doctors: ' + (error.response?.data?.error || error.message));
      setDoctors([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchByArea = async () => {
    if (!searchArea.trim()) {
      setMessage('Please enter an area name');
      return;
    }

    setIsSearching(true);
    setMessage('');

    try {
      const response = await axios.get('http://localhost:12000/api/doctors/search-by-area', {
        params: { area: searchArea }
      });
      setDoctors(response.data);
      setMessage(`Found ${response.data.length} doctors in ${searchArea}`);
    } catch (error: any) {
      setMessage('Error searching doctors: ' + (error.response?.data?.error || error.message));
      setDoctors([]);
    } finally {
      setIsSearching(false);
    }
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  const doctorMarkers = doctors.map(doctor => ({
    lat: doctor.location.coordinates[1],
    lng: doctor.location.coordinates[0],
    title: `${doctor.name} - ${doctor.clinicName}`
  }));

  return (
    <div className="patient-search">
      <h2>Find Doctors</h2>
      
      <div className="search-options">
        <div className="search-by-location">
          <h3>Search by Location</h3>
          <div className="form-group">
            <label>Search Radius:</label>
            <select 
              value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              <option value={1000}>1 km</option>
              <option value={2000}>2 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={20000}>20 km</option>
            </select>
          </div>
          
          <div className="map-container">
            <Wrapper apiKey={apiKey}>
              <GoogleMap
                center={searchLocation}
                zoom={13}
                onLocationSelect={handleLocationSelect}
                markers={[
                  { ...searchLocation, title: 'Search Center' },
                  ...doctorMarkers
                ]}
              />
            </Wrapper>
          </div>
          
          <p>Search center: {searchLocation.lat.toFixed(6)}, {searchLocation.lng.toFixed(6)}</p>
          <button onClick={searchByLocation} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search by Location'}
          </button>
        </div>

        <div className="search-by-area">
          <h3>Search by Area Name</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter area name (e.g., JP Nagar, Koramangala)"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
            />
          </div>
          <button onClick={searchByArea} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search by Area'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {doctors.length > 0 && (
        <div className="doctors-list">
          <h3>Search Results</h3>
          {doctors.map(doctor => (
            <div key={doctor._id} className="doctor-card">
              <h4>{doctor.name}</h4>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
              <p><strong>Clinic:</strong> {doctor.clinicName}</p>
              <p><strong>Address:</strong> {doctor.address}</p>
              {doctor.phone && <p><strong>Phone:</strong> {doctor.phone}</p>}
              {doctor.email && <p><strong>Email:</strong> {doctor.email}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;