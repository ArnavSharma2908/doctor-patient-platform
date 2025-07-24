const mongoose = require('mongoose');

// Define the doctor schema with geolocation for the clinic
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  clinic: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  }
}, { timestamps: true });

// Create a geospatial index on clinic.location
doctorSchema.index({ 'clinic.location': '2dsphere' });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;