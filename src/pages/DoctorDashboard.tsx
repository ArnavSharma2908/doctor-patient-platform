import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import GoogleMapComponent from '@/components/GoogleMap';
import { createDoctor, DoctorInput } from '@/lib/api';
import { Location } from '@/types';

export default function DoctorDashboard() {
  const [formData, setFormData] = useState<DoctorInput>({
    name: '',
    specialization: '',
    clinic: {
      name: '',
      address: '',
      location: {
        coordinates: [77.5946, 12.9716] // Default [lng, lat] for Bangalore
      }
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle map click to update clinic location
  const handleMapClick = (location: Location) => {
    setFormData({
      ...formData,
      clinic: {
        ...formData.clinic,
        location: {
          coordinates: [location.lng, location.lat] // MongoDB stores as [lng, lat]
        }
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createDoctor(formData);
      toast.success('Clinic location saved successfully.');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        specialization: '',
        clinic: {
          name: '',
          address: '',
          location: {
            coordinates: [77.5946, 12.9716]
          }
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to save clinic information.';
        
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Your Clinic Location</CardTitle>
            <CardDescription>
              Click on the map to select your clinic location or search for an address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Doctor Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  placeholder="Cardiologist, Dentist, etc."
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinic.name">Clinic Name</Label>
                <Input
                  id="clinic.name"
                  name="clinic.name"
                  placeholder="Health First Clinic"
                  value={formData.clinic.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinic.address">Clinic Address</Label>
                <Input
                  id="clinic.address"
                  name="clinic.address"
                  placeholder="123 Main St, JP Nagar, Bangalore"
                  value={formData.clinic.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Selected Location:</h3>
                <p className="text-sm text-gray-500 mb-1">
                  Latitude: {formData.clinic.location.coordinates[1]}
                </p>
                <p className="text-sm text-gray-500">
                  Longitude: {formData.clinic.location.coordinates[0]}
                </p>
              </div>
              
              <CardFooter className="px-0 pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Clinic Location'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        
        <div className="h-[600px]">
          <GoogleMapComponent
            initialCenter={{
              lat: formData.clinic.location.coordinates[1],
              lng: formData.clinic.location.coordinates[0]
            }}
            height="600px"
            onMapClick={handleMapClick}
          />
        </div>
      </div>
    </div>
  );
}