
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { User, Lock, Unlock, Building2, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/pages/Index';

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
  user?: UserType | null;
  isEditing?: boolean;
  onUpdateUser?: (user: UserType) => void;
}

const ProfileCreation = ({ onComplete, user, isEditing = false, onUpdateUser }: ProfileCreationProps) => {
  const [name, setName] = useState(user?.name || '');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>(user?.gender || '');
  const [designation, setDesignation] = useState<'Student' | 'Working Professional' | 'Business' | 'Freelancer' | 'Other' | ''>(user?.designation || '');
  const [isProfileLocked, setIsProfileLocked] = useState(user?.isProfileLocked || false);
  const [institute, setInstitute] = useState(user?.institute || '');
  const [company, setCompany] = useState(user?.company || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [interests, setInterests] = useState(user?.interests || '');
  const { toast } = useToast();

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
      title: isEditing ? "Profile Updated!" : "Profile Created!",
      description: isEditing ? "Your profile has been updated successfully." : "Your profile has been saved successfully.",
    });

    const profileData = {
      name: name.trim(),
      gender,
      designation,
      isProfileLocked,
      institute: institute.trim(),
      company: company.trim(),
      bio: bio.trim(),
      phone: phone.trim(),
      email: email.trim(),
      interests: interests.trim()
    };

    if (isEditing && user && onUpdateUser) {
      const updatedUser = { ...user, ...profileData };
      onUpdateUser(updatedUser);
      onComplete(profileData);
    } else {
      onComplete(profileData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Your Profile' : 'Create Your Profile'}
          </CardTitle>
          <p className="text-gray-600">{isEditing ? 'Update your information' : 'Tell us a bit about yourself'}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Privacy Settings */}
          {isEditing && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isProfileLocked ? (
                    <Lock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Unlock className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <Label className="text-sm font-medium">Profile Privacy</Label>
                    <p className="text-xs text-gray-600">
                      {isProfileLocked 
                        ? "Only your friends can view your full profile" 
                        : "Anyone in the community can view your profile"
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isProfileLocked}
                  onCheckedChange={setIsProfileLocked}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
              
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
                <Select value={gender} onValueChange={(value: 'Male' | 'Female') => setGender(value)}>
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
                <Select value={designation} onValueChange={(value: 'Student' | 'Working Professional' | 'Business' | 'Freelancer' | 'Other') => setDesignation(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your designation" />
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
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Professional Information</h3>
              
              {(designation === 'Student' || designation === '') && (
                <div className="space-y-2">
                  <Label htmlFor="institute" className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Institute/College</span>
                  </Label>
                  <Input
                    id="institute"
                    type="text"
                    placeholder="Enter your institute or college name"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                  />
                </div>
              )}

              {(designation === 'Working Professional' || designation === 'Business' || designation === 'Freelancer') && (
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Company/Organization</span>
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Enter your company or organization name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contact & Additional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Contact & Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests & Hobbies</Label>
              <Input
                id="interests"
                type="text"
                placeholder="e.g., Photography, Travel, Technology, Sports..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3"
          >
            {isEditing ? 'Update Profile' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCreation;
