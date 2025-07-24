const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 12000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor-patient-platform';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  clinicName: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  phone: String,
  email: String
}, { timestamps: true });

// Create geospatial index
doctorSchema.index({ location: '2dsphere' });

const Doctor = mongoose.model('Doctor', doctorSchema);

// Routes

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new doctor
app.post('/api/doctors', async (req, res) => {
  try {
    const { name, specialty, clinicName, address, latitude, longitude, phone, email } = req.body;
    
    const doctor = new Doctor({
      name,
      specialty,
      clinicName,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude] // Note: MongoDB uses [longitude, latitude] format
      },
      phone,
      email
    });

    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search doctors by location
app.get('/api/doctors/search', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters, default 5km
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const doctors = await Doctor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search doctors by area name (using text search on address)
app.get('/api/doctors/search-by-area', async (req, res) => {
  try {
    const { area } = req.query;
    
    if (!area) {
      return res.status(400).json({ error: 'Area name is required' });
    }

    const doctors = await Doctor.find({
      address: { $regex: area, $options: 'i' }
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a doctor
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});