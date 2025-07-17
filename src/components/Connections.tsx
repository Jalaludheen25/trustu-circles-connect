import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserType, Community } from '@/pages/Index';
import { Plus, Users, User, MapPin, ArrowLeft, Settings } from 'lucide-react';

interface ConnectionsProps {
  user: UserType;
  community: Community;
  connections: UserType[];
  onAddConnection: (newConnection: UserType) => void;
  onRemoveConnection: (connectionId: string) => void;
  onBack: () => void;
  appliedFilter?: string;
  isVisiting?: boolean;
  visitingCommunityName?: string;
  onDeleteProfile: () => void;
  onEditProfile: () => void;
}

const Connections = ({ 
  user, 
  community, 
  connections, 
  onAddConnection, 
  onRemoveConnection, 
  onBack,
  appliedFilter,
  isVisiting,
  visitingCommunityName,
  onDeleteProfile,
  onEditProfile
}: ConnectionsProps) => {
  const [newConnection, setNewConnection] = useState<Partial<UserType>>({
    name: '',
    gender: 'Male',
    designation: 'Student',
    homeState: user.homeState,
    homeDistrict: user.homeDistrict,
    currentState: user.currentState,
    currentDistrict: user.currentDistrict
  });
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<UserType | null>(null);

  const currentCommunityName = isVisiting && visitingCommunityName ? visitingCommunityName : community.name;

  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    onAddConnection(newConnection as UserType);
    setNewConnection({
      name: '',
      gender: 'Male',
      designation: 'Student',
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict
    });
  };

  const handleContact = (connection: UserType) => {
    setSelectedConnection(connection);
    setShowContactDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-gray-200 hover:border-rose-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Circle</h1>
                <p className="text-sm text-gray-600">{currentCommunityName}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onEditProfile}
              className="border-gray-200 hover:border-rose-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              My Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Community Members Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Community Members</span>
              <Badge variant="outline" className="ml-2">{connections.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No connections yet</h3>
                <p className="text-gray-500">Connect with community members to build your network!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection) => (
                  <Card key={connection.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {connection.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{connection.name}</h4>
                          <p className="text-sm text-gray-600">{connection.designation}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{connection.homeDistrict}, {connection.homeState}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{connection.currentDistrict}, {connection.currentState}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContact(connection)}
                          className="text-xs"
                        >
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRemoveConnection(connection.id)}
                          className="text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Connection Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Connection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddConnection} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    value={newConnection.name}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <Select value={newConnection.designation} onValueChange={(value) => setNewConnection(prev => ({ ...prev, designation: value as any }))}>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home State</label>
                  <Input
                    value={newConnection.homeState}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, homeState: e.target.value }))}
                    placeholder="Enter home state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home District</label>
                  <Input
                    value={newConnection.homeDistrict}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, homeDistrict: e.target.value }))}
                    placeholder="Enter home district"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current State</label>
                  <Input
                    value={newConnection.currentState}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, currentState: e.target.value }))}
                    placeholder="Enter current state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current District</label>
                  <Input
                    value={newConnection.currentDistrict}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, currentDistrict: e.target.value }))}
                    placeholder="Enter current district"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Connection
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {selectedConnection?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {selectedConnection?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{selectedConnection?.name}</h4>
                <p className="text-sm text-gray-600">{selectedConnection?.designation}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {selectedConnection?.phone && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Phone:</span>
                  <span>{selectedConnection.phone}</span>
                </div>
              )}
              {selectedConnection?.email && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Email:</span>
                  <span>{selectedConnection.email}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Connections;
