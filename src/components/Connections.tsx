
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, UserPlus, UserMinus, User as UserIcon } from 'lucide-react';
import { User, Community } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Mock community members (in a real app, this would come from the backend)
  const mockCommunityMembers: User[] = [
    {
      id: '2',
      name: 'Priya Sharma',
      gender: 'Female',
      designation: 'Student',
      homeState: user.homeState,
      homeDistrict: 'Thiruvananthapuram',
      currentState: user.currentState,
      currentDistrict: 'South Delhi'
    },
    {
      id: '3',
      name: 'Raj Kumar',
      gender: 'Male',
      designation: 'Working Professional',
      homeState: user.homeState,
      homeDistrict: 'Kottayam',
      currentState: user.currentState,
      currentDistrict: 'North Delhi'
    },
    {
      id: '4',
      name: 'Sneha Nair',
      gender: 'Female',
      designation: 'Freelancer',
      homeState: user.homeState,
      homeDistrict: 'Ernakulam',
      currentState: user.currentState,
      currentDistrict: 'East Delhi'
    },
    {
      id: '5',
      name: 'Arjun Menon',
      gender: 'Male',
      designation: 'Business',
      homeState: user.homeState,
      homeDistrict: 'Kozhikode',
      currentState: user.currentState,
      currentDistrict: 'West Delhi'
    }
  ].filter(member => member.id !== user.id);

  const filteredMembers = mockCommunityMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isConnected = (memberId: string) => {
    return connections.some(conn => conn.id === memberId);
  };

  const handleConnect = (member: User) => {
    onAddConnection(member);
    toast({
      title: "Connection Added",
      description: `You are now connected with ${member.name}`,
    });
  };

  const handleDisconnect = (memberId: string, memberName: string) => {
    onRemoveConnection(memberId);
    toast({
      title: "Connection Removed",
      description: `You have disconnected from ${memberName}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={onBack} className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">My Circle</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search community members by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Community Members */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Community Members ({filteredMembers.length})
          </h2>
          <p className="text-sm text-gray-600">
            Connect with people in your community: {community.name}
          </p>
        </div>

        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No members found matching your search.' : 'No community members found.'}
              </p>
              <p className="text-sm text-gray-400">
                Community members will appear here as more people join.
              </p>
            </Card>
          ) : (
            filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{member.gender}</Badge>
                          <Badge variant="outline">{member.designation}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          From {member.homeDistrict} • Currently in {member.currentDistrict}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isConnected(member.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(member.id, member.name)}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="w-4 h-4" />
                          <span>Remove</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(member)}
                          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Connect</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* My Connections */}
        {connections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              My Connections ({connections.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection) => (
                <Card key={connection.id} className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{connection.name}</h4>
                          <p className="text-sm text-gray-600">{connection.designation}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(connection.id, connection.name)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
