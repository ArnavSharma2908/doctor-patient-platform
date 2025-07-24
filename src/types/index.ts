// Doctor type definition
export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  clinic: {
    name: string;
    address: string;
    location: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

// Location type
export interface Location {
  lat: number;
  lng: number;
}