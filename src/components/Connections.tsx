
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User as UserType, Community, Listing } from '@/pages/Index';
import { Plus, Users, User, MapPin, ArrowLeft, Settings, Search, UserPlus, UserMinus } from 'lucide-react';

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
  listings: Listing[];
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
  onEditProfile,
  listings
}: ConnectionsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<UserType | null>(null);
  const [showAllMembers, setShowAllMembers] = useState(false);

  const currentCommunityName = isVisiting && visitingCommunityName ? visitingCommunityName : community.name;

  // Generate community members including users from listings
  const getCommunityMembers = (): UserType[] => {
    const staticMembers: UserType[] = [
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
    },
    {
      id: '8',
      name: 'Deepika Sharma',
      gender: 'Female' as const,
      designation: 'Freelancer' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '9',
      name: 'Arjun Krishnan',
      gender: 'Male' as const,
      designation: 'Student' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '10',
      name: 'Meera Pillai',
      gender: 'Female' as const,
      designation: 'Business' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '11',
      name: 'Suresh Kumar',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '12',
      name: 'Kavya Nambiar',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '13',
      name: 'Ravi Menon',
      gender: 'Male' as const,
      designation: 'Freelancer' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '14',
      name: 'Sneha Iyer',
      gender: 'Female' as const,
      designation: 'Business' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '15',
      name: 'Arun Nair',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '16',
      name: 'Divya Krishnan',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '17',
      name: 'Kiran Jose',
      gender: 'Male' as const,
      designation: 'Freelancer' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '18',
      name: 'Lakshmi Warrier',
      gender: 'Female' as const,
      designation: 'Business' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '19',
      name: 'Vinod Kumar',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '20',
      name: 'Anjali Menon',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '21',
      name: 'Rajesh Nair',
      gender: 'Male' as const,
      designation: 'Freelancer' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    }
    ];

    // Extract users from listings that belong to the current community
    const listingUsers: UserType[] = [];
    
    listings.forEach(listing => {
      if (!listing.user) return;
      
      let belongsToCurrentCommunity = false;
      
      if (appliedFilter) {
        if (appliedFilter.includes(' - ')) {
          const [homeDistrict, currentLocation] = appliedFilter.split(' - ');
          belongsToCurrentCommunity = listing.user.homeDistrict === homeDistrict && 
            (listing.user.currentState === currentLocation || listing.user.currentDistrict === currentLocation);
        } else if (appliedFilter.includes(' in ')) {
          const parts = appliedFilter.split(' in ');
          const homeStateMap: { [key: string]: string } = {
            'Keralites': 'Kerala',
            'Tamilians': 'Tamil Nadu',
            'Delhites': 'Delhi'
          };
          const homeState = homeStateMap[parts[0]] || parts[0];
          const currentState = parts[1];
          
          belongsToCurrentCommunity = listing.user.homeState === homeState && listing.user.currentState === currentState;
        }
      } else if (isVisiting && visitingCommunityName) {
        if (visitingCommunityName.includes(' in ')) {
          const parts = visitingCommunityName.split(' in ');
          const homeStateMap: { [key: string]: string } = {
            'Keralites': 'Kerala',
            'Tamilians': 'Tamil Nadu',
            'Delhites': 'Delhi'
          };
          const homeState = homeStateMap[parts[0]] || parts[0];
          const currentState = parts[1];
          
          belongsToCurrentCommunity = listing.user.homeState === homeState && listing.user.currentState === currentState;
        } else {
          belongsToCurrentCommunity = listing.user.homeState === visitingCommunityName && listing.user.currentState === visitingCommunityName;
        }
      } else {
        // Default to user's own community
        belongsToCurrentCommunity = listing.user.homeState === user.homeState && 
          listing.user.currentState === user.currentState;
      }
      
      if (belongsToCurrentCommunity && !listingUsers.find(u => u.id === listing.user.id)) {
        listingUsers.push(listing.user);
      }
    });

    // Combine static members with listing users, remove duplicates
    const allMembers = [...staticMembers];
    listingUsers.forEach(listingUser => {
      if (!allMembers.find(member => member.id === listingUser.id)) {
        allMembers.push(listingUser);
      }
    });

    return allMembers;
  };

  const communityMembers = getCommunityMembers();

  const isConnected = (memberId: string) => {
    return connections.some(conn => conn.id === memberId);
  };

  const handleToggleConnection = (member: UserType) => {
    if (isConnected(member.id)) {
      onRemoveConnection(member.id);
    } else {
      onAddConnection(member);
    }
  };

  const filteredMembers = communityMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotCurrentUser = member.id !== user.id;
    
    return matchesSearch && isNotCurrentUser;
  });

  const displayedMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 6);

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
        {/* Search and Controls */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Community Members</span>
                <Badge variant="outline" className="ml-2">{filteredMembers.length}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="border-gray-200 hover:border-rose-300"
              >
                {showAllMembers ? 'Show Less' : 'See All Members'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search community members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Community Members Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {displayedMembers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No members found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedMembers.map((member) => (
                  <Card key={member.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{member.name}</h4>
                            {isConnected(member.id) && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                Friend
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{member.designation}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{member.homeDistrict}, {member.homeState}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{member.currentDistrict}, {member.currentState}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        {isConnected(member.id) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContact(member)}
                            className="text-xs"
                          >
                            Contact
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={isConnected(member.id) ? "destructive" : "default"}
                          onClick={() => handleToggleConnection(member)}
                          className="text-xs ml-auto"
                        >
                          {isConnected(member.id) ? (
                            <>
                              <UserMinus className="w-4 h-4 mr-1" />
                              Remove
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-1" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Connections Section */}
        {connections.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>My Connections</span>
                <Badge variant="outline" className="ml-2">{connections.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
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
