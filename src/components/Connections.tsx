
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, UserPlus, UserMinus, ArrowLeft, User as UserIcon, Camera, Users, Edit, Trash2 } from 'lucide-react';
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
  onDeleteProfile
}: ConnectionsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMutualConnections, setShowMutualConnections] = useState(false);
  const [selectedUserMutuals, setSelectedUserMutuals] = useState<User[]>([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock community members with Malabar region names
  const communityMembers: User[] = [
    {
      id: '2',
      name: 'Fathima Ashraf',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: 'Kerala',
      homeDistrict: 'Malappuram',
      currentState: 'Delhi',
      currentDistrict: 'South East Delhi',
    },
    {
      id: '3',
      name: 'Mohammed Salim',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: 'Kerala',
      homeDistrict: 'Malappuram',
      currentState: 'Delhi',
      currentDistrict: 'South East Delhi',
    },
    {
      id: '4',
      name: 'Anitha Menon',
      gender: 'Female' as const,
      designation: 'Freelancer' as const,
      homeState: 'Kerala',
      homeDistrict: 'Malappuram',
      currentState: 'Delhi',
      currentDistrict: 'South East Delhi',
    },
    {
      id: '5',
      name: 'George Thomas',
      gender: 'Male' as const,
      designation: 'Business' as const,
      homeState: 'Kerala',
      homeDistrict: 'Malappuram',
      currentState: 'Delhi',
      currentDistrict: 'South East Delhi',
    }
  ];

  const filteredMembers = communityMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotCurrentUser = member.id !== user.id;
    return matchesSearch && isNotCurrentUser;
  });

  const isConnected = (memberId: string) => {
    return connections.some(conn => conn.id === memberId);
  };

  const handleToggleConnection = (member: User) => {
    if (isConnected(member.id)) {
      onRemoveConnection(member.id);
    } else {
      onAddConnection(member);
    }
  };

  const getMutualConnections = (memberId: string): User[] => {
    // Get actual mutual connections (connections that are connected to both users)
    const mutuals = connections.filter(conn => {
      // Don't include the current user or the member we're checking
      return conn.id !== user.id && conn.id !== memberId;
    });
    return mutuals.slice(0, 2); // Limit to 2 for demo
  };

  const handleShowMutuals = (member: User) => {
    const mutuals = getMutualConnections(member.id);
    setSelectedUserMutuals(mutuals);
    setSelectedUserName(member.name);
    setShowMutualConnections(true);
  };

  // Generate community name for "My Circle" section
  const getCurrentCommunityName = () => {
    if (isVisiting && visitingCommunityName) {
      return visitingCommunityName;
    }
    
    if (appliedFilter) {
      return appliedFilter;
    }
    
    return community.name;
  };

  const currentCommunityName = getCurrentCommunityName();

  const handleDeleteProfile = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProfile = () => {
    if (onDeleteProfile) {
      onDeleteProfile();
    }
    setShowDeleteConfirm(false);
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
              <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
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
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              {/* Profile Photo */}
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => {/* Handle photo edit */}}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h2>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{user.gender}</Badge>
                <Badge variant="outline">{user.designation}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                {user.homeDistrict}, {user.homeState} → {user.currentDistrict}, {user.currentState}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* My Circle Section */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              My Circle <span className="text-sm font-normal text-gray-500">({currentCommunityName})</span>
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search community members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No community members found.</p>
            </Card>
          ) : (
            filteredMembers.map((member) => {
              const mutualCount = getMutualConnections(member.id).length;
              return (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{member.gender}</Badge>
                            <Badge variant="outline">{member.designation}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {member.homeDistrict}, {member.homeState} → {member.currentDistrict}, {member.currentState}
                          </p>
                          {mutualCount > 0 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-xs text-blue-600"
                              onClick={() => handleShowMutuals(member)}
                            >
                              {mutualCount} mutual connection{mutualCount !== 1 ? 's' : ''}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleToggleConnection(member)}
                        variant={isConnected(member.id) ? "destructive" : "default"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        {isConnected(member.id) ? (
                          <>
                            <UserMinus className="w-4 h-4" />
                            <span>Remove</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Connect</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* My Connections Section */}
        {connections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">My Connections ({connections.length})</h2>
            <div className="space-y-4">
              {connections.map((connection) => (
                <Card key={connection.id} className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                            {connection.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-800">{connection.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">{connection.gender}</Badge>
                            <Badge variant="secondary" className="text-xs">{connection.designation}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => onRemoveConnection(connection.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mutual Connections Dialog */}
      <Dialog open={showMutualConnections} onOpenChange={setShowMutualConnections}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mutual Connections with {selectedUserName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedUserMutuals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No mutual connections found.</p>
            ) : (
              selectedUserMutuals.map((mutual) => (
                <div key={mutual.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                      {mutual.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-800">{mutual.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">{mutual.gender}</Badge>
                      <Badge variant="secondary" className="text-xs">{mutual.designation}</Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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
