
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, Listing } from '@/pages/Index';

interface SellProductProps {
  user: User;
  onComplete: (listing: Omit<Listing, 'id' | 'userId' | 'user' | 'createdAt'>) => void;
  onBack: () => void;
}

const SellProduct = ({ user, onComplete, onBack }: SellProductProps) => {
  const [formData, setFormData] = useState({
    itemType: '',
    location: '',
    itemDetails: '',
    amount: '',
    contact: '',
    photo: null as File | null
  });
  const { toast } = useToast();

  const itemTypes = [
    'Educational Items',
    'Electronics and Gadgets',
    'Home & Kitchen Items',
    'Vehicle',
    'Other'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, photo: file});
    }
  };

  const handleSubmit = () => {
    if (!formData.itemType || !formData.location || !formData.itemDetails || 
        !formData.amount || !formData.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const listing = {
      type: 'product' as const,
      title: `${formData.itemType} - ${formData.itemDetails.substring(0, 50)}${formData.itemDetails.length > 50 ? '...' : ''}`,
      description: formData.itemDetails,
      location: formData.location,
      contact: formData.contact,
      price: formData.amount,
      details: formData
    };

    toast({
      title: "Product Listed",
      description: "Your product has been listed successfully",
    });

    onComplete(listing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Sell Product</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Item Type *</Label>
              <Select 
                value={formData.itemType} 
                onValueChange={(value) => setFormData({...formData, itemType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {itemTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                placeholder="Enter your location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Item Details *</Label>
              <Textarea
                placeholder="Describe your item in detail..."
                value={formData.itemDetails}
                onChange={(e) => setFormData({...formData, itemDetails: e.target.value})}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                placeholder="Enter selling price"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Photo Upload (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.photo ? formData.photo.name : 'Click to upload photo'}
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Number *</Label>
              <Input
                type="tel"
                placeholder="Enter contact number"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              List Product
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellProduct;
