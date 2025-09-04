
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/pages/Index';

interface JoinCommunityProps {
  onComplete: (communityData: { homeState: string; institution: string }) => void;
  user: User | null;
}

const JoinCommunity = ({ onComplete, user }: JoinCommunityProps) => {
  const [homeState, setHomeState] = useState('');
  const [institution, setInstitution] = useState('');
  const { toast } = useToast();

  const states = ['Kerala'];
  const institutions = ['Jamia Millia Islamia'];

  const handleJoin = () => {
    if (!homeState) {
      toast({
        title: "Home State Required",
        description: "Please select your home state",
        variant: "destructive"
      });
      return;
    }

    if (!institution) {
      toast({
        title: "Institution Required",
        description: "Please select your institution",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Welcome to your community!",
      description: "You've joined: Keralites in Jamia",
    });

    onComplete({
      homeState,
      institution
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
              <Select value={homeState} onValueChange={setHomeState}>
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
              <Label htmlFor="institution">Institution Studying *</Label>
              <Select 
                value={institution} 
                onValueChange={setInstitution}
                disabled={!homeState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((inst) => (
                    <SelectItem key={inst} value={inst}>
                      {inst}
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
