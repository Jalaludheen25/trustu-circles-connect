import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Camera, Edit, Trash2, Eye } from 'lucide-react';
import { User, Community } from '@/pages/Index';

interface ConnectionsProps {
  user: User;
  community: Community;
  connections: User[];
  onAddConnection: (user: User) => void;
  onRemoveConnection: (userId: string) => void;
  onBack: () => void;
  appliedFilter?: string;
  isVisiting?: boolean;
  visitingCommunityName?: string;
  onDeleteProfile?: () => void;
  onEditProfile?: () => void;
}

const Connections = ({ 
  user, 
  community, 
  connections, 
  onAddConnection, 
  onRemoveConnection, 
  onBack,
  appliedFilter,
  isVisiting = false,
  visitingCommunityName,
  onDeleteProfile,
  onEditProfile
}: ConnectionsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);

  const handleViewProfile = (member: User) => {
    setSelectedProfile(member);
    setShowProfileView(true);
  };

  const handleDeleteProfile = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProfile = () => {
    if (onDeleteProfile) {
      onDeleteProfile();
    }
    setShowDeleteConfirm(false);
  };

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
                <p className="text-sm text-gray-600">Manage your profile settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* My Profile Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={handleEditProfile}
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                  onClick={handleDeleteProfile}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="absolute -bottom-1 -right-1 rounded-full w-6 h-6 p-0"
                  onClick={() => {/* Handle photo edit */}}
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline">{user.gender}</Badge>
                  <Badge variant="outline">{user.designation}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {user.homeDistrict}, {user.homeState} → {user.currentDistrict}, {user.currentState}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile View Dialog */}
      <Dialog open={showProfileView} onOpenChange={setShowProfileView}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-3">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-lg">
                    {selectedProfile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-800">{selectedProfile.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{selectedProfile.gender}</Badge>
                  <Badge variant="outline">{selectedProfile.designation}</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Home Location</p>
                  <p className="text-gray-600">{selectedProfile.homeDistrict}, {selectedProfile.homeState}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Current Location</p>
                  <p className="text-gray-600">{selectedProfile.currentDistrict}, {selectedProfile.currentState}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Profile Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Are you sure you want to delete your profile? This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteProfile}
            >
              Delete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Connections;
