import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, UserPlus, UserMinus, ArrowLeft, User as UserIcon, Camera, Users, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { User, Community } from '@/pages/Index';

interface CommunityMembersProps {
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

const CommunityMembers = ({ 
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
}: CommunityMembersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMutualConnections, setShowMutualConnections] = useState(false);
  const [selectedUserMutuals, setSelectedUserMutuals] = useState<User[]>([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);

  // Mock community members with Malabar region names
  const communityMembers: User[] = [
    {
      id: '2',
      name: 'Fathima Ashraf',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '3',
      name: 'Mohammed Salim',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '4',
      name: 'Anitha Menon',
      gender: 'Female' as const,
      designation: 'Freelancer' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '5',
      name: 'George Thomas',
      gender: 'Male' as const,
      designation: 'Business' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '6',
      name: 'Priya Nair',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '7',
      name: 'Rashid Ahmed',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    }
  ];

  const filteredMembers = communityMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotCurrentUser = member.id !== user.id;
    
    // Filter based on current community context
    let belongsToCurrentCommunity = true;
    if (appliedFilter) {
      // Parse filter to determine community criteria
      if (appliedFilter.includes(' - ')) {
        // District-level filter like "Malappuram - Delhi"
        const [homeDistrict, currentLocation] = appliedFilter.split(' - ');
        belongsToCurrentCommunity = member.homeDistrict === homeDistrict && 
          (member.currentState === currentLocation || member.currentDistrict === currentLocation);
      } else if (appliedFilter.includes(' in ')) {
        // State-level filter like "Keralites in Delhi"
        const parts = appliedFilter.split(' in ');
        const homeStateMap: { [key: string]: string } = {
          'Keralites': 'Kerala',
          'Tamilians': 'Tamil Nadu',
          'Delhites': 'Delhi'
        };
        const homeState = homeStateMap[parts[0]] || parts[0];
        const currentState = parts[1];
        
        belongsToCurrentCommunity = member.homeState === homeState && member.currentState === currentState;
      }
    } else if (isVisiting && visitingCommunityName) {
      // Filter for visiting community
      if (visitingCommunityName.includes(' in ')) {
        const parts = visitingCommunityName.split(' in ');
        const homeStateMap: { [key: string]: string } = {
          'Keralites': 'Kerala',
          'Tamilians': 'Tamil Nadu',
          'Delhites': 'Delhi'
        };
        const homeState = homeStateMap[parts[0]] || parts[0];
        const currentState = parts[1];
        
        belongsToCurrentCommunity = member.homeState === homeState && member.currentState === currentState;
      } else {
        belongsToCurrentCommunity = member.homeState === visitingCommunityName && member.currentState === visitingCommunityName;
      }
    } else {
      // Default to user's own community
      belongsToCurrentCommunity = member.homeState === user.homeState && 
        member.homeDistrict === user.homeDistrict &&
        member.currentState === user.currentState && 
        member.currentDistrict === user.currentDistrict;
    }
    
    return matchesSearch && isNotCurrentUser && belongsToCurrentCommunity;
  });

  const isConnected = (memberId: string) => {
    return connections.some(conn => conn.id === memberId);
  };

  // Get members who are not friends
  const nonFriendMembers = filteredMembers.filter(member => !isConnected(member.id));

  const handleToggleConnection = (member: User) => {
    if (isConnected(member.id)) {
      onRemoveConnection(member.id);
    } else {
      onAddConnection(member);
    }
  };

  const getMutualConnections = (memberId: string): User[] => {
    // Get actual mutual connections from community members who are connected to both users
    const mutuals = communityMembers.filter(member => {
      // Must be connected to current user and not be the member we're checking
      const isConnectedToCurrentUser = connections.some(conn => conn.id === member.id);
      const isNotTheMemberWeAreChecking = member.id !== memberId;
      const isNotCurrentUser = member.id !== user.id;
      
      // For demo purposes, we'll simulate that some members are mutual connections
      // In a real app, you'd check if this member is also connected to the target member
      return isConnectedToCurrentUser && isNotTheMemberWeAreChecking && isNotCurrentUser;
    });
    
    return mutuals.slice(0, 2); // Limit to 2 for demo
  };

  const handleShowMutuals = (member: User) => {
    const mutuals = getMutualConnections(member.id);
    setSelectedUserMutuals(mutuals);
    setSelectedUserName(member.name);
    setShowMutualConnections(true);
  };

  const handleViewProfile = (member: User) => {
    setSelectedProfile(member);
    setShowProfileView(true);
  };

  // Generate community name for display
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

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  // Calculate total member count
  const totalMemberCount = 1 + connections.length + filteredMembers.length;

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
                <h1 className="text-xl font-bold text-gray-800">Community Members</h1>
                <p className="text-sm text-gray-600">{currentCommunityName} • {totalMemberCount} members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* My Circle Section */}
        {connections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-blue-500" />
              <span>My Circle ({connections.length})</span>
            </h2>
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
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(connection)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onRemoveConnection(connection.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Community Members Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                Discover People ({nonFriendMembers.length})
              </h2>
            </div>
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

        {/* Non-Friend Members List */}
        <div className="space-y-4">
          {nonFriendMembers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No new community members to discover.</p>
            </Card>
          ) : (
            nonFriendMembers.map((member) => {
              const mutualCount = getMutualConnections(member.id).length;
              return (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
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
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(member)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Button>
                        <Button
                          onClick={() => handleToggleConnection(member)}
                          variant="default"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Connect</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
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
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleToggleConnection(selectedProfile)}
                  variant={isConnected(selectedProfile.id) ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isConnected(selectedProfile.id) ? 'Remove Connection' : 'Connect'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

export default CommunityMembers;
