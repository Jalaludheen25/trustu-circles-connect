
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Mail, Phone, MapPin, Building2, GraduationCap, Heart, Lock, Unlock } from 'lucide-react';

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
  user?: any;
  isEditing?: boolean;
  onUpdateUser?: (user: any) => void;
}

const ProfileCreation = ({ onComplete, user, isEditing = false, onUpdateUser }: ProfileCreationProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || 'Male' as 'Male' | 'Female',
    designation: user?.designation || 'Student' as 'Student' | 'Working Professional' | 'Business' | 'Freelancer' | 'Other',
    isProfileLocked: user?.isProfileLocked || false,
    institute: user?.institute || '',
    company: user?.company || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    email: user?.email || '',
    interests: user?.interests || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive"
      });
      return;
    }

    if (isEditing && onUpdateUser) {
      const updatedUser = { ...user, ...formData };
      onUpdateUser(updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } else {
      onComplete(formData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            {isEditing ? 'Update your information to keep your profile current' : 'Tell us about yourself to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-2xl">
                  {formData.name.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl text-gray-800">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Gender</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Male', 'Female'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => handleInputChange('gender', gender as 'Male' | 'Female')}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.gender === gender
                            ? 'border-rose-500 bg-rose-50 text-rose-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Designation</Label>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="w-full h-12 px-3 border border-gray-200 rounded-lg focus:border-rose-500 focus:ring-rose-500 text-sm"
                  >
                    <option value="Student">Student</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Business">Business</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800">
                {formData.designation === 'Student' ? (
                  <GraduationCap className="w-5 h-5 mr-2 text-rose-500" />
                ) : (
                  <Building2 className="w-5 h-5 mr-2 text-rose-500" />
                )}
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.designation === 'Student' ? (
                <div>
                  <Label htmlFor="institute" className="text-sm font-medium text-gray-700 mb-2 block">
                    Institute/University
                  </Label>
                  <Input
                    id="institute"
                    value={formData.institute}
                    onChange={(e) => handleInputChange('institute', e.target.value)}
                    placeholder="Enter your institute or university name"
                    className="h-12 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700 mb-2 block">
                    Company/Organization
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter your company or organization name"
                    className="h-12 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800">
                <Heart className="w-5 h-5 mr-2 text-rose-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-2 block">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  className="min-h-[100px] border-gray-200 focus:border-rose-500 focus:ring-rose-500 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="interests" className="text-sm font-medium text-gray-700 mb-2 block">
                  Interests & Hobbies
                </Label>
                <Input
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  placeholder="e.g., Photography, Travel, Cooking, Sports..."
                  className="h-12 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800">
                <MapPin className="w-5 h-5 mr-2 text-rose-500" />
                Contact Information
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                This information will only be visible to your connections
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-12 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="h-12 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800">
                {formData.isProfileLocked ? (
                  <Lock className="w-5 h-5 mr-2 text-rose-500" />
                ) : (
                  <Unlock className="w-5 h-5 mr-2 text-rose-500" />
                )}
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Private Profile</Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Only your connections can view your profile details
                  </p>
                </div>
                <Switch
                  checked={formData.isProfileLocked}
                  onCheckedChange={(checked) => handleInputChange('isProfileLocked', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
