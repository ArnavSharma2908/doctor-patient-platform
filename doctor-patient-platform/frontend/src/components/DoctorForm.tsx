import React, { useState, useCallback } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import axios from 'axios';
import GoogleMap from './GoogleMap';

interface Doctor {
  name: string;
  specialty: string;
  clinicName: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
}

const DoctorForm: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor>({
    name: '',
    specialty: '',
    clinicName: '',
    address: '',
    latitude: 12.9716, // Default to Bangalore coordinates
    longitude: 77.5946,
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = useCallback((lat: number, lng: number, address: string) => {
    setDoctor(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address || prev.address
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:12000/api/doctors', doctor);
      setMessage('Doctor registered successfully!');
      setDoctor({
        name: '',
        specialty: '',
        clinicName: '',
        address: '',
        latitude: 12.9716,
        longitude: 77.5946,
        phone: '',
        email: ''
      });
    } catch (error: any) {
      setMessage('Error registering doctor: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  return (
    <div className="doctor-form">
      <h2>Register as a Doctor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={doctor.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialty">Specialty:</label>
          <input
            type="text"
            id="specialty"
            name="specialty"
            value={doctor.specialty}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clinicName">Clinic Name:</label>
          <input
            type="text"
            id="clinicName"
            name="clinicName"
            value={doctor.clinicName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={doctor.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={doctor.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={doctor.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Clinic Location (Click on map to select):</label>
          <div className="map-container">
            <Wrapper apiKey={apiKey}>
              <GoogleMap
                center={{ lat: doctor.latitude, lng: doctor.longitude }}
                zoom={13}
                onLocationSelect={handleLocationSelect}
                markers={[{ lat: doctor.latitude, lng: doctor.longitude }]}
              />
            </Wrapper>
          </div>
          <p>Selected coordinates: {doctor.latitude.toFixed(6)}, {doctor.longitude.toFixed(6)}</p>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Doctor'}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default DoctorForm;