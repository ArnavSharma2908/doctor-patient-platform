import axios from 'axios';
import { Doctor } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

// Doctor API calls
export interface DoctorInput {
  name: string;
  specialization: string;
  clinic: {
    name: string;
    address: string;
    location: {
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
}

export const createDoctor = async (doctorData: DoctorInput): Promise<Doctor> => {
  const response = await axios.post(`${API_BASE_URL}/doctors`, doctorData);
  return response.data;
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await axios.get(`${API_BASE_URL}/doctors`);
  return response.data;
};

export const getDoctorsNearLocation = async (lat: number, lng: number, maxDistance?: number): Promise<Doctor[]> => {
  const response = await axios.get(`${API_BASE_URL}/doctors/near`, {
    params: { lat, lng, maxDistance }
  });
  return response.data;
};

export const searchDoctorsByLocation = async (location: string): Promise<Doctor[]> => {
  const response = await axios.get(`${API_BASE_URL}/doctors/search`, {
    params: { location }
  });
  return response.data;
};