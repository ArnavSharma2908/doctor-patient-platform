import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoogleMapComponent from '@/components/GoogleMap';
import { searchDoctorsByLocation, getDoctorsNearLocation } from '@/lib/api';
import { toast } from 'sonner';
import { Doctor, Location } from '@/types';

export default function PatientDashboard() {
  const [locationSearch, setLocationSearch] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 12.9716, lng: 77.5946 }); // Default: Bangalore
  const [isLoading, setIsLoading] = useState(false);

  // Search doctors by location name
  const handleLocationSearch = async () => {
    if (!locationSearch.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchDoctorsByLocation(locationSearch);
      setDoctors(results);

      // Update map center to the first result if available
      if (results.length > 0) {
        const [lng, lat] = results[0].clinic.location.coordinates;
        setMapCenter({ lat, lng });
      }

      toast.success(`Found ${results.length} doctor(s) in ${locationSearch}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to search doctors.';
        
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Search doctors by clicking on map (near coordinates)
  const handleMapClick = async (location: Location) => {
    setMapCenter(location);
    setIsLoading(true);
    
    try {
      const results = await getDoctorsNearLocation(location.lat, location.lng);
      setDoctors(results);
      
      toast.success(`Found ${results.length} doctor(s) near selected location`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to find nearby doctors.';
        
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find Doctors Near You</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search by Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter location (e.g., Bangalore, Mumbai)"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                />
              </div>
              <Button 
                onClick={handleLocationSearch}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Searching...' : 'Search Doctors'}
              </Button>
            </CardContent>
          </Card>

          {/* Doctor Results */}
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({doctors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {doctors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No doctors found. Try searching by location or clicking on the map.
                </p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <div 
                      key={doctor._id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        const [lng, lat] = doctor.clinic.location.coordinates;
                        setMapCenter({ lat, lng });
                      }}
                    >
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-blue-600">{doctor.specialization}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">{doctor.clinic.name}</p>
                        <p>{doctor.clinic.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map Panel */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Map View</CardTitle>
              <p className="text-sm text-gray-600">
                Click on the map to find doctors near that location
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 lg:h-[600px]">
                <GoogleMapComponent
                  center={mapCenter}
                  doctors={doctors}
                  onLocationClick={handleMapClick}
                  zoom={12}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
