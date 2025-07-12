import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, Listing } from '@/pages/Index';

interface AddServiceProps {
  user: User;
  onComplete: (listing: Omit<Listing, 'id' | 'userId' | 'user' | 'createdAt'>) => void;
  onBack: () => void;
  existingListing?: Listing | null;
  isEditing?: boolean;
}

const AddService = ({ user, onComplete, onBack, existingListing, isEditing = false }: AddServiceProps) => {
  const [serviceType, setServiceType] = useState<'accommodation' | 'proxy' | ''>('');
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (existingListing && isEditing) {
      setServiceType(existingListing.type as 'accommodation' | 'proxy');
      setFormData(existingListing.details || {});
    }
  }, [existingListing, isEditing]);

  const accommodationTypes = [
    'Flat (Permanent Stay)',
    'Flat (Temporary Stay)',
    'Hostel',
    'PG',
    'Hotel'
  ];

  const proxyServices = [
    'Tourist Guide',
    'Proxy Work (Jamia)',
    'Proxy Work (DU)',
    'Proxy Work (Anywhere in Delhi)',
    'Room Search Assistance'
  ];

  const delhiDistricts = [
    'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi',
    'Shahdara', 'New Delhi', 'Anywhere in Delhi'
  ];

  const handleSubmit = () => {
    if (!serviceType) {
      toast({
        title: "Service Type Required",
        description: "Please select a service type",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields based on service type
    if (serviceType === 'accommodation') {
      if (!formData.accommodationType || !formData.location || !formData.availableFor || 
          !formData.maxOccupancy || !formData.contact) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    } else if (serviceType === 'proxy') {
      if (!formData.proxyType || !formData.location || !formData.charge || !formData.contact) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }

    const listing = {
      type: serviceType,
      title: serviceType === 'accommodation' 
        ? `${formData.accommodationType} - ${formData.location}`
        : `${formData.proxyType} - ${formData.location}`,
      description: serviceType === 'accommodation'
        ? `Available for: ${Array.isArray(formData.availableFor) ? formData.availableFor.join(', ') : formData.availableFor}. Max occupancy: ${formData.maxOccupancy}. ${formData.rentPerDay ? `₹${formData.rentPerDay}/day` : ''} ${formData.rentPerMonth ? `₹${formData.rentPerMonth}/month` : ''}`
        : `Service charge: ₹${formData.charge}`,
      location: formData.location,
      contact: formData.contact,
      price: serviceType === 'accommodation' 
        ? (formData.rentPerDay || formData.rentPerMonth)
        : formData.charge,
      details: formData
    };

    toast({
      title: isEditing ? "Service Updated" : "Service Added",
      description: isEditing ? "Your service has been updated successfully" : "Your service has been posted successfully",
    });

    onComplete(listing);
  };

  if (!serviceType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Service' : 'Add Service'}
            </h1>
          </div>

          <div className="space-y-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setServiceType('accommodation')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Accommodation</h3>
                <p className="text-gray-600 text-sm">List your flat, PG, hostel, or hotel</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setServiceType('proxy')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Proxy Services</h3>
                <p className="text-gray-600 text-sm">Offer proxy work, tour guide, or assistance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setServiceType('')} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing 
              ? (serviceType === 'accommodation' ? 'Edit Accommodation' : 'Edit Proxy Service')
              : (serviceType === 'accommodation' ? 'Add Accommodation' : 'Add Proxy Service')
            }
          </h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            {serviceType === 'accommodation' ? (
              <>
                <div className="space-y-2">
                  <Label>Accommodation Type *</Label>
                  <Select 
                    value={formData.accommodationType || ''} 
                    onValueChange={(value) => setFormData({...formData, accommodationType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accommodationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input
                    placeholder="Enter location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Available For * (Select multiple)</Label>
                  <div className="space-y-2">
                    {['Male Bachelors', 'Female Bachelors', 'Families', 'Anyone'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={(formData.availableFor || []).includes(option)}
                          onCheckedChange={(checked) => {
                            const current = formData.availableFor || [];
                            if (checked) {
                              setFormData({...formData, availableFor: [...current, option]});
                            } else {
                              setFormData({...formData, availableFor: current.filter((item: string) => item !== option)});
                            }
                          }}
                        />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Occupancy *</Label>
                  <Select 
                    value={formData.maxOccupancy || ''} 
                    onValueChange={(value) => setFormData({...formData, maxOccupancy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select max occupancy" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rent Per Day</Label>
                    <Select 
                      value={formData.rentPerDay || ''} 
                      onValueChange={(value) => setFormData({...formData, rentPerDay: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100-200">₹100-200</SelectItem>
                        <SelectItem value="200-400">₹200-400</SelectItem>
                        <SelectItem value="400-600">₹400-600</SelectItem>
                        <SelectItem value="600-800">₹600-800</SelectItem>
                        <SelectItem value="800-1000">₹800-1000</SelectItem>
                        <SelectItem value="1000+">₹1000 and above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rent Per Month</Label>
                    <Select 
                      value={formData.rentPerMonth || ''} 
                      onValueChange={(value) => setFormData({...formData, rentPerMonth: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1500-2500">₹1500-2500</SelectItem>
                        <SelectItem value="2500-3500">₹2500-3500</SelectItem>
                        <SelectItem value="3500-4500">₹3500-4500</SelectItem>
                        <SelectItem value="4500+">₹4500 and above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contact Number *</Label>
                  <Input
                    type="tel"
                    placeholder="Enter contact number"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Type of Service *</Label>
                  <Select 
                    value={formData.proxyType || ''} 
                    onValueChange={(value) => setFormData({...formData, proxyType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {proxyServices.map((service) => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input
                    placeholder="Enter location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Charge Per Service *</Label>
                  <Input
                    type="number"
                    placeholder="Enter charge amount (₹)"
                    value={formData.charge || ''}
                    onChange={(e) => setFormData({...formData, charge: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact Number *</Label>
                  <Input
                    type="tel"
                    placeholder="Enter contact number"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
              </>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {isEditing ? 'Update Service' : 'Post Service'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddService;
