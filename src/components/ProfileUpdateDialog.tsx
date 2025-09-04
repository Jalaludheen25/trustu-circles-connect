import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/pages/Index';

interface ProfileUpdateDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (userData: Partial<User>) => void;
  onLogout: () => void;
}

const ProfileUpdateDialog = ({ user, open, onOpenChange, onUpdate, onLogout }: ProfileUpdateDialogProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    gender: user.gender,
    designation: user.designation,
    contact: user.contact || '',
    email: user.email || ''
  });
  const { toast } = useToast();

  const handleUpdate = () => {
    if (!formData.name || !formData.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in name and contact details",
        variant: "destructive"
      });
      return;
    }

    onUpdate(formData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    onOpenChange(false);
  };

  const handleLogout = () => {
    onLogout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value: 'Male' | 'Female') => setFormData({...formData, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Select value={formData.designation} onValueChange={(value: 'Student' | 'Working Professional' | 'Business' | 'Freelancer' | 'Other') => setFormData({...formData, designation: value})}>
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

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number *</Label>
            <Input
              id="contact"
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              placeholder="Enter contact number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <Button onClick={handleUpdate} className="w-full">
              Update Profile
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Log Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpdateDialog;