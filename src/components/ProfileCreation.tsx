
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileCreationProps {
  onComplete: (profileData: { name: string; gender: 'Male' | 'Female'; designation: string }) => void;
}

const ProfileCreation = ({ onComplete }: ProfileCreationProps) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [designation, setDesignation] = useState('');
  const { toast } = useToast();

  const designations = [
    'Student',
    'Working Professional',
    'Business',
    'Freelancer',
    'Other'
  ];

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (!gender) {
      toast({
        title: "Gender Required",
        description: "Please select your gender",
        variant: "destructive"
      });
      return;
    }

    if (!designation) {
      toast({
        title: "Designation Required",
        description: "Please select your designation",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Profile Created",
      description: "Your profile has been saved successfully",
    });

    onComplete({
      name: name.trim(),
      gender: gender as 'Male' | 'Female',
      designation
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create Your Profile
          </CardTitle>
          <p className="text-gray-600">Tell us a bit about yourself</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={gender} onValueChange={(value) => setGender(value as 'Male' | 'Female')}>
              <SelectTrigger>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Select value={designation} onValueChange={setDesignation}>
              <SelectTrigger>
                <SelectValue placeholder="Select your designation" />
              </SelectTrigger>
              <SelectContent>
                {designations.map((des) => (
                  <SelectItem key={des} value={des}>
                    {des}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3"
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCreation;
