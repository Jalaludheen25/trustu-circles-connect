import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, ArrowLeft } from 'lucide-react';

interface ProfileCreationProps {
  onComplete: (profileData: {
    name: string;
    gender: 'Male' | 'Female';
    designation: 'Student' | 'Working Professional' | 'Business' | 'Freelancer' | 'Other';
    isProfileLocked?: boolean;
    institute?: string;
    company?: string;
    bio?: string;
    phone?: string;
    email?: string;
    interests?: string;
  }) => void;
  user: User | null;
  isEditing?: boolean;
  onUpdateUser?: (user: User) => void;
}

const ProfileCreation = ({ onComplete, user, isEditing = false, onUpdateUser }: ProfileCreationProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    designation: user?.designation || '',
    isProfileLocked: user?.isProfileLocked || false,
    institute: user?.institute || '',
    company: user?.company || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    email: user?.email || '',
    interests: user?.interests || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
    if (onUpdateUser && user) {
      const updatedUser = { ...user, ...formData };
      onUpdateUser(updatedUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          {isEditing && (
            <div className="flex justify-start mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="border-gray-200 hover:border-rose-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          )}
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Profile' : 'Complete Your Profile'}
          </CardTitle>
          <p className="text-gray-600">
            {isEditing ? 'Update your profile information' : 'Tell us about yourself to get started'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Select value={formData.designation} onValueChange={(value) => handleSelectChange('designation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Working Professional">Working Professional</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="institute">Institute/College (Optional)</Label>
              <Input
                type="text"
                id="institute"
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                placeholder="Enter your institute/college name"
              />
            </div>

            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Input
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short bio about yourself"
              />
            </div>

            <div>
              <Label htmlFor="interests">Interests (Optional)</Label>
              <Input
                type="text"
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Enter your interests (e.g., coding, hiking, music)"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3"
              disabled={!formData.name || !formData.gender || !formData.designation}
            >
              {isEditing ? 'Update Profile' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCreation;
