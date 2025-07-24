const mongoose = require('mongoose');
require('dotenv').config();

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

doctorSchema.index({ location: '2dsphere' });
const Doctor = mongoose.model('Doctor', doctorSchema);

// Sample data for Bangalore
const sampleDoctors = [
  {
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    clinicName: "Heart Care Center",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    location: {
      type: "Point",
      coordinates: [77.6033, 12.9716] // MG Road, Bangalore
    },
    phone: "+91-9876543210",
    email: "rajesh.kumar@heartcare.com"
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Dermatology",
    clinicName: "Skin Wellness Clinic",
    address: "456 JP Nagar 7th Phase, Bangalore, Karnataka 560078",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9082] // JP Nagar
    },
    phone: "+91-9876543211",
    email: "priya.sharma@skinwellness.com"
  },
  {
    name: "Dr. Amit Patel",
    specialty: "Orthopedics",
    clinicName: "Bone & Joint Clinic",
    address: "789 Koramangala 4th Block, Bangalore, Karnataka 560034",
    location: {
      type: "Point",
      coordinates: [77.6271, 12.9352] // Koramangala
    },
    phone: "+91-9876543212",
    email: "amit.patel@bonejoint.com"
  },
  {
    name: "Dr. Sunita Reddy",
    specialty: "Pediatrics",
    clinicName: "Children's Health Center",
    address: "321 Indiranagar 100 Feet Road, Bangalore, Karnataka 560038",
    location: {
      type: "Point",
      coordinates: [77.6408, 12.9784] // Indiranagar
    },
    phone: "+91-9876543213",
    email: "sunita.reddy@childhealth.com"
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Neurology",
    clinicName: "Brain & Spine Institute",
    address: "654 Whitefield Main Road, Bangalore, Karnataka 560066",
    location: {
      type: "Point",
      coordinates: [77.7499, 12.9698] // Whitefield
    },
    phone: "+91-9876543214",
    email: "vikram.singh@brainspine.com"
  },
  {
    name: "Dr. Meera Nair",
    specialty: "Gynecology",
    clinicName: "Women's Care Clinic",
    address: "987 Jayanagar 4th Block, Bangalore, Karnataka 560011",
    location: {
      type: "Point",
      coordinates: [77.5833, 12.9279] // Jayanagar
    },
    phone: "+91-9876543215",
    email: "meera.nair@womenscare.com"
  },
  {
    name: "Dr. Arjun Gupta",
    specialty: "ENT",
    clinicName: "Ear Nose Throat Specialists",
    address: "147 HSR Layout Sector 1, Bangalore, Karnataka 560102",
    location: {
      type: "Point",
      coordinates: [77.6387, 12.9116] // HSR Layout
    },
    phone: "+91-9876543216",
    email: "arjun.gupta@entspecialists.com"
  },
  {
    name: "Dr. Kavya Krishnan",
    specialty: "Ophthalmology",
    clinicName: "Vision Care Center",
    address: "258 Malleshwaram 8th Cross, Bangalore, Karnataka 560003",
    location: {
      type: "Point",
      coordinates: [77.5667, 13.0039] // Malleshwaram
    },
    phone: "+91-9876543217",
    email: "kavya.krishnan@visioncare.com"
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert sample data
    const insertedDoctors = await Doctor.insertMany(sampleDoctors);
    console.log(`Inserted ${insertedDoctors.length} sample doctors`);

    // Display inserted doctors
    console.log('\nSample doctors added:');
    insertedDoctors.forEach(doctor => {
      console.log(`- ${doctor.name} (${doctor.specialty}) at ${doctor.clinicName}`);
    });

    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();