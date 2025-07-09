
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, UserMinus, ArrowLeft, User as UserIcon } from 'lucide-react';
import { User, Community } from '@/pages/Index';

interface ConnectionsProps {
  user: User;
  community: Community;
  connections: User[];
  onAddConnection: (user: User) => void;
  onRemoveConnection: (userId: string) => void;
  onBack: () => void;
}

const Connections = ({ user, community, connections, onAddConnection, onRemoveConnection, onBack }: ConnectionsProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock community members (in a real app, this would come from an API)
  const communityMembers: User[] = [
    {
      id: '2',
      name: 'Priya Nair',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: 'Kerala',
      homeDistrict: 'Malappuram',
      currentState: 'Delhi',
      currentDistrict: 'South East Delhi',
    },
    {
      id: '3',
      name: 'Arjun Kumar',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: 'Kerala',
      homeDistrict: 'Malappuram',
      currentState: 'Delhi',
      currentDistrict: 'South East Delhi',
    },
    {
      id: '4',
      name: 'Meera Thomas',
      gender: 'Female' as const,
      designation: 'Freelancer' as const,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">My Circle</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search community members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No community members found.</p>
            </Card>
          ) : (
            filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{member.gender}</Badge>
                          <Badge variant="outline">{member.designation}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {member.homeDistrict}, {member.homeState} → {member.currentDistrict}, {member.currentState}
                        </p>
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
            ))
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
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
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
    </div>
  );
};

export default Connections;
