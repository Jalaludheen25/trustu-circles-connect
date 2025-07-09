
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
  const [selectedFilter, setSelectedFilter] = useState('');

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
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityFilter;
