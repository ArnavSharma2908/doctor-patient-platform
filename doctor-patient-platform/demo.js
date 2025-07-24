const axios = require('axios');

const BASE_URL = 'http://localhost:12000/api';

async function demonstrateAPI() {
  console.log('🏥 Doctor-Patient Platform API Demo\n');

  try {
    // 1. Get all doctors
    console.log('1. Getting all doctors...');
    const allDoctors = await axios.get(`${BASE_URL}/doctors`);
    console.log(`   Found ${allDoctors.data.length} doctors in the database\n`);

    // 2. Search doctors by location (near Bangalore center)
    console.log('2. Searching doctors near Bangalore center (12.9716, 77.5946) within 10km...');
    const nearbyDoctors = await axios.get(`${BASE_URL}/doctors/search`, {
      params: {
        lat: 12.9716,
        lng: 77.5946,
        radius: 10000 // 10km
      }
    });
    console.log(`   Found ${nearbyDoctors.data.length} doctors within 10km:`);
    nearbyDoctors.data.forEach(doctor => {
      console.log(`   - ${doctor.name} (${doctor.specialty}) at ${doctor.clinicName}`);
    });
    console.log();

    // 3. Search doctors by area name
    console.log('3. Searching doctors in "JP Nagar" area...');
    const jpNagarDoctors = await axios.get(`${BASE_URL}/doctors/search-by-area`, {
      params: { area: 'JP Nagar' }
    });
    console.log(`   Found ${jpNagarDoctors.data.length} doctors in JP Nagar:`);
    jpNagarDoctors.data.forEach(doctor => {
      console.log(`   - ${doctor.name} (${doctor.specialty}) at ${doctor.clinicName}`);
    });
    console.log();

    // 4. Add a new doctor
    console.log('4. Adding a new doctor...');
    const newDoctor = {
      name: "Dr. Demo Test",
      specialty: "General Medicine",
      clinicName: "Demo Clinic",
      address: "Test Address, Bangalore",
      latitude: 12.9716,
      longitude: 77.5946,
      phone: "+91-9999999999",
      email: "demo@test.com"
    };

    const addedDoctor = await axios.post(`${BASE_URL}/doctors`, newDoctor);
    console.log(`   Successfully added: ${addedDoctor.data.name}`);
    console.log(`   Doctor ID: ${addedDoctor.data._id}\n`);

    // 5. Search again to show the new doctor
    console.log('5. Searching again to show the new doctor...');
    const updatedDoctors = await axios.get(`${BASE_URL}/doctors/search`, {
      params: {
        lat: 12.9716,
        lng: 77.5946,
        radius: 1000 // 1km
      }
    });
    console.log(`   Found ${updatedDoctors.data.length} doctors within 1km of the center:`);
    updatedDoctors.data.forEach(doctor => {
      console.log(`   - ${doctor.name} (${doctor.specialty}) at ${doctor.clinicName}`);
    });
    console.log();

    // 6. Clean up - delete the demo doctor
    console.log('6. Cleaning up - deleting demo doctor...');
    await axios.delete(`${BASE_URL}/doctors/${addedDoctor.data._id}`);
    console.log('   Demo doctor deleted successfully\n');

    console.log('✅ API Demo completed successfully!');
    console.log('\n📱 Frontend Application:');
    console.log('   URL: http://localhost:12001');
    console.log('   - Use "Doctor Registration" tab to add new doctors');
    console.log('   - Use "Find Doctors" tab to search for doctors');
    console.log('   - Note: You need a Google Maps API key for the maps to work');

  } catch (error) {
    console.error('❌ Error during demo:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the demo
demonstrateAPI();