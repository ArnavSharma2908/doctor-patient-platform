# Doctor-Patient Platform

A minimal full-stack web application that implements Google Maps API for a doctor-patient platform with location-based features.

## Features

### Doctor Features
- Add clinic location using Google Maps (drop a pin or search an address)
- Save clinic's address and geo-coordinates in MongoDB
- Register with personal and clinic information

### Patient Features
- Search for doctors by location with customizable radius
- Search for doctors by area name (e.g., "JP Nagar", "Koramangala")
- View doctors on an interactive map
- View detailed doctor information including contact details

## Tech Stack

- **Backend**: Express.js, MongoDB with geospatial queries
- **Frontend**: React.js with TypeScript
- **Maps**: Google Maps API
- **Database**: MongoDB with 2dsphere indexing for geospatial queries

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Maps API Key

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional, for enhanced search)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
PORT=12000
MONGODB_URI=mongodb://localhost:27017/doctor-patient-platform
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
PORT=12001
```

### 4. Start MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or start manually
mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017
```

### 5. Run the Application
```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:12001
- Backend API: http://localhost:12000

## API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add a new doctor
- `GET /api/doctors/search?lat=12.9716&lng=77.5946&radius=5000` - Search doctors by location
- `GET /api/doctors/search-by-area?area=JP Nagar` - Search doctors by area name
- `DELETE /api/doctors/:id` - Delete a doctor

### Request/Response Examples

#### Add Doctor
```json
POST /api/doctors
{
  "name": "Dr. John Doe",
  "specialty": "Cardiology",
  "clinicName": "Heart Care Clinic",
  "address": "123 Main St, JP Nagar, Bangalore",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "phone": "+91-9876543210",
  "email": "john.doe@example.com"
}
```

#### Search Response
```json
[
  {
    "_id": "...",
    "name": "Dr. John Doe",
    "specialty": "Cardiology",
    "clinicName": "Heart Care Clinic",
    "address": "123 Main St, JP Nagar, Bangalore",
    "location": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    },
    "phone": "+91-9876543210",
    "email": "john.doe@example.com"
  }
]
```

## Database Schema

### Doctor Collection
```javascript
{
  name: String (required),
  specialty: String (required),
  clinicName: String (required),
  address: String (required),
  location: {
    type: "Point",
    coordinates: [longitude, latitude] // GeoJSON format
  },
  phone: String,
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

The `location` field uses MongoDB's 2dsphere index for efficient geospatial queries.

## Usage

### For Doctors
1. Click on "Doctor Registration" tab
2. Fill in your personal and clinic information
3. Click on the map to select your clinic location
4. The address will be auto-filled using reverse geocoding
5. Submit the form to register

### For Patients
1. Click on "Find Doctors" tab
2. **Search by Location**: Click on the map to set search center, select radius, and search
3. **Search by Area**: Enter area name (e.g., "JP Nagar") and search
4. View results on the map and in the list below

## Security Considerations

- API key should be restricted to specific domains in production
- Input validation is implemented on the backend
- CORS is configured to allow frontend access
- MongoDB connection should use authentication in production

## Future Enhancements

- User authentication and authorization
- Doctor profiles with photos and detailed information
- Appointment booking system
- Reviews and ratings
- Real-time availability status
- Advanced search filters (specialty, rating, availability)
- Mobile responsive design improvements