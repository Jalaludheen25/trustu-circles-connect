
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/pages/Index';

interface JoinCommunityProps {
  onComplete: (communityData: { homeState: string; homeDistrict: string; currentState: string; currentDistrict: string }) => void;
  user: User | null;
}

const JoinCommunity = ({ onComplete, user }: JoinCommunityProps) => {
  const [homeState, setHomeState] = useState('');
  const [homeDistrict, setHomeDistrict] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [currentDistrict, setCurrentDistrict] = useState('');
  const { toast } = useToast();

  const states = ['Kerala', 'Tamil Nadu', 'Delhi'];
  
  const districts = {
    'Kerala': ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi', 'Dindigul', 'Thanjavur'],
    'Delhi': ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi', 'Shahdara', 'New Delhi']
  };

  const handleJoin = () => {
    if (!homeState) {
      toast({
        title: "Home State Required",
        description: "Please select your home state",
        variant: "destructive"
      });
      return;
    }

    if (!homeDistrict) {
      toast({
        title: "Home District Required",
        description: "Please select your home district",
        variant: "destructive"
      });
      return;
    }

    if (!currentState) {
      toast({
        title: "Current State Required",
        description: "Please select your current state",
        variant: "destructive"
      });
      return;
    }

    if (!currentDistrict) {
      toast({
        title: "Current District Required",
        description: "Please select your current district",
        variant: "destructive"
      });
      return;
    }

    const communityName = homeState === currentState 
      ? homeState 
      : `${homeState === 'Kerala' ? 'Keralites' : homeState === 'Tamil Nadu' ? 'Tamilians' : 'Delhites'} in ${currentState}`;

    toast({
      title: "Welcome to your community!",
      description: `You've joined: ${communityName}`,
    });

    onComplete({
      homeState,
      homeDistrict,
      currentState,
      currentDistrict
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Join Your Community
          </CardTitle>
          <p className="text-gray-600">Connect with people from your region</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="home-state">Your Home State *</Label>
              <Select value={homeState} onValueChange={(value) => {
                setHomeState(value);
                setHomeDistrict('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your home state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="home-district">Your Home District *</Label>
              <Select 
                value={homeDistrict} 
                onValueChange={setHomeDistrict}
                disabled={!homeState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your home district" />
                </SelectTrigger>
                <SelectContent>
                  {homeState && districts[homeState as keyof typeof districts]?.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-state">Current Place of Living (State) *</Label>
              <Select value={currentState} onValueChange={(value) => {
                setCurrentState(value);
                setCurrentDistrict('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-district">Current District *</Label>
              <Select 
                value={currentDistrict} 
                onValueChange={setCurrentDistrict}
                disabled={!currentState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your current district" />
                </SelectTrigger>
                <SelectContent>
                  {currentState && districts[currentState as keyof typeof districts]?.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3"
          >
            Join Community
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinCommunity;
