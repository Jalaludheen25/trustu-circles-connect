import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { User } from '@/pages/Index';

interface CommunityFilterProps {
  user: User;
  onClose: () => void;
  onFilterChange: (filter: string) => void;
  onVisitCommunity: (homeState: string, homeDistrict: string, currentState: string, currentDistrict: string) => void;
}

const CommunityFilter = ({ user, onClose, onFilterChange, onVisitCommunity }: CommunityFilterProps) => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [visitHomeState, setVisitHomeState] = useState('');
  const [visitHomeDistrict, setVisitHomeDistrict] = useState('');
  const [visitCurrentState, setVisitCurrentState] = useState('');
  const [visitCurrentDistrict, setVisitCurrentDistrict] = useState('');

  const getAvailableFilters = () => {
    const filters = [];
    
    // If user is in a cross-state community (home state different from current state)
    if (user.homeState !== user.currentState) {
      const homePeople = user.homeState === 'Kerala' ? 'Keralites' : 
                         user.homeState === 'Tamil Nadu' ? 'Tamilians' : 'Delhites';
      
      // Add filter for specific district combinations
      filters.push(`${homePeople} in ${user.currentDistrict}`);
      
      // Add general state filter
      filters.push(`${homePeople} in ${user.currentState}`);
      
      // Add home district specific filter if different districts
      if (user.homeDistrict !== user.currentDistrict) {
        filters.push(`${user.homeDistrict} - ${user.currentState}`);
      }
    } else {
      // Same state community - filter by districts within the state
      filters.push(`${user.homeState}`); // General state community
      
      // If they're in different districts within the same state
      if (user.homeDistrict !== user.currentDistrict) {
        filters.push(`${user.homeDistrict} - ${user.currentDistrict}`);
        filters.push(`${user.homeState} - ${user.currentDistrict}`);
        filters.push(`${user.homeState} - ${user.homeDistrict}`);
      }
    }
    
    return [...new Set(filters)]; // Remove duplicates
  };

  const availableFilters = getAvailableFilters();

  const states = ['Kerala', 'Tamil Nadu', 'Delhi'];
  
  const getDistricts = (state: string) => {
    switch (state) {
      case 'Kerala':
        return ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'];
      case 'Tamil Nadu':
        return ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Cuddalore', 'Kanchipuram'];
      case 'Delhi':
        return ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi', 'Shahdara', 'New Delhi'];
      default:
        return [];
    }
  };

  const handleVisitCommunity = () => {
    if (visitHomeState && visitHomeDistrict && visitCurrentState && visitCurrentDistrict) {
      onVisitCommunity(visitHomeState, visitHomeDistrict, visitCurrentState, visitCurrentDistrict);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Community Options</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs defaultValue="filter" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="filter">Filter My Community</TabsTrigger>
              <TabsTrigger value="visit">Visit Other Communities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="filter" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Community Filter</Label>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a community filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFilters.map((filter) => (
                      <SelectItem key={filter} value={filter}>
                        {filter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Your Registered Locations:</p>
                <p>Home: {user.homeDistrict}, {user.homeState}</p>
                <p>Current: {user.currentDistrict}, {user.currentState}</p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedFilter) {
                      onFilterChange(selectedFilter);
                    }
                  }}
                  disabled={!selectedFilter}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  Apply Filter
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="visit" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Home State</Label>
                    <Select value={visitHomeState} onValueChange={setVisitHomeState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
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
                    <Label>Home District</Label>
                    <Select value={visitHomeDistrict} onValueChange={setVisitHomeDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistricts(visitHomeState).map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Current State</Label>
                    <Select value={visitCurrentState} onValueChange={setVisitCurrentState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
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
                    <Label>Current District</Label>
                    <Select value={visitCurrentDistrict} onValueChange={setVisitCurrentDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistricts(visitCurrentState).map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Note:</p>
                  <p>When visiting other communities, you can only view listings and contact providers. You cannot add services or sell products.</p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVisitCommunity}
                    disabled={!visitHomeState || !visitHomeDistrict || !visitCurrentState || !visitCurrentDistrict}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Visit Community
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityFilter;
