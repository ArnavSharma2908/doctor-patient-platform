const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctors near a location
router.get('/near', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query; // maxDistance in meters (default: 5km)
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const doctors = await Doctor.find({
      'clinic.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // [longitude, latitude]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctors by location name (using text search in address)
router.get('/search', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }
    
    // Search for doctors whose clinic address contains the location string
    const doctors = await Doctor.find({
      'clinic.address': { $regex: location, $options: 'i' }
    });
    
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new doctor
router.post('/', async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    specialization: req.body.specialization,
    clinic: {
      name: req.body.clinic.name,
      address: req.body.clinic.address,
      location: {
        type: 'Point',
        coordinates: req.body.clinic.location.coordinates
      }
    }
  });
  
  try {
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;