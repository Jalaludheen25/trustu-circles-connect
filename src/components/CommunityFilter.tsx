
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { User } from '@/pages/Index';

interface CommunityFilterProps {
  user: User;
  onClose: () => void;
  onFilterChange: (filter: string) => void;
}

const CommunityFilter = ({ user, onClose, onFilterChange }: CommunityFilterProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const districts = {
    'Kerala': ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi', 'Dindigul', 'Thanjavur'],
    'Delhi': ['Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi', 'Shahdara', 'New Delhi']
  };

  const getAvailableFilters = () => {
    const filters = [];
    
    // User can filter communities based on their own state combinations
    if (user.homeState !== user.currentState) {
      // They're in a cross-state community
      const homeStateDistricts = districts[user.homeState as keyof typeof districts] || [];
      const currentStateDistricts = districts[user.currentState as keyof typeof districts] || [];
      
      homeStateDistricts.forEach(district => {
        currentStateDistricts.forEach(currentDistrict => {
          const homePeople = user.homeState === 'Kerala' ? 'Keralites' : 
                           user.homeState === 'Tamil Nadu' ? 'Tamilians' : 'Delhites';
          filters.push(`${homePeople} in ${currentDistrict}`);
        });
      });
    } else {
      // They're in same state community
      const stateDistricts = districts[user.homeState as keyof typeof districts] || [];
      stateDistricts.forEach(district => {
        if (district !== user.homeDistrict) {
          filters.push(`${user.homeState} - ${district}`);
        }
      });
    }
    
    return filters;
  };

  const availableFilters = getAvailableFilters();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Community Filter</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Community</Label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
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
            <p className="font-medium mb-1">Note:</p>
            <p>You can only join communities related to your registered locations ({user.homeState} and {user.currentState}).</p>
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
                if (selectedDistrict) {
                  onFilterChange(selectedDistrict);
                }
              }}
              disabled={!selectedDistrict}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityFilter;
