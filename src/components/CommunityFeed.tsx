import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Home, Plus, Search, ShoppingBag, UserCheck, ArrowLeft, Users, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Community, Listing } from '@/pages/Index';
import { formatDistanceToNow } from 'date-fns';

interface CommunityFeedProps {
  user: User;
  community: Community;
  listings: Listing[];
  onNavigate: (step: string) => void;
  appliedFilter?: string;
  onFilterApplied: (filter: string) => void;
  isVisiting?: boolean;
  visitingCommunityName?: string;
  onBackToMyCommunity: () => void;
  onVisitCommunity: (homeState: string, homeDistrict: string, currentState: string, currentDistrict: string) => void;
  onDeleteListing: (listingId: string) => void;
  onEditListing: (listing: Listing) => void;
  connections: User[];
}

const CommunityFeed = ({ 
  user, 
  community, 
  listings, 
  onNavigate, 
  appliedFilter, 
  onFilterApplied, 
  isVisiting = false, 
  visitingCommunityName, 
  onBackToMyCommunity, 
  onVisitCommunity, 
  onDeleteListing, 
  onEditListing,
  connections 
}: CommunityFeedProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);

  useEffect(() => {
    let filtered = listings;
    
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (appliedFilter) {
      if (appliedFilter.includes(' - ')) {
        const [homeDistrict, currentLocation] = appliedFilter.split(' - ');
        filtered = filtered.filter(listing =>
          listing.user.homeDistrict === homeDistrict &&
          (listing.user.currentState === currentLocation || listing.user.currentDistrict === currentLocation)
        );
      } else if (appliedFilter.includes(' in ')) {
        const parts = appliedFilter.split(' in ');
        const homeStateMap: { [key: string]: string } = {
          'Keralites': 'Kerala',
          'Tamilians': 'Tamil Nadu',
          'Delhites': 'Delhi'
        };
        const homeState = homeStateMap[parts[0]] || parts[0];
        const currentState = parts[1];
        
        filtered = filtered.filter(listing => listing.user.homeState === homeState && listing.user.currentState === currentState);
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
        
        filtered = filtered.filter(listing => listing.user.homeState === homeState && listing.user.currentState === currentState);
      } else {
        filtered = filtered.filter(listing => listing.user.homeState === visitingCommunityName && listing.user.currentState === visitingCommunityName);
      }
    } else {
      filtered = filtered.filter(listing =>
        listing.user.homeState === user.homeState &&
        listing.user.homeDistrict === user.homeDistrict &&
        listing.user.currentState === user.currentState &&
        listing.user.currentDistrict === user.currentDistrict
      );
    }
    
    setFilteredListings(filtered);
  }, [listings, searchTerm, appliedFilter, isVisiting, visitingCommunityName, user]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterApplied(e.target.value);
  };

  const getCurrentCommunityName = () => {
    if (isVisiting && visitingCommunityName) {
      return visitingCommunityName;
    }
    
    if (appliedFilter) {
      return appliedFilter;
    }
    
    return community.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {isVisiting && (
                <Button variant="ghost" size="sm" onClick={onBackToMyCommunity}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    {getCurrentCommunityName()}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('community-members')}
                    className="p-1 hover:bg-gray-100"
                  >
                    <Users className="w-5 h-5 text-blue-500" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
                  {appliedFilter && ` • Filtered: ${appliedFilter}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => onNavigate('connections')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>My Circle ({connections.length})</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onNavigate('add-service')}>
                    <Home className="w-4 h-4 mr-2" />
                    Accommodation/Proxy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('sell-product')}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Buy & Sell
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Community Filter Section */}
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <select
              className="px-4 py-2 border rounded-md bg-white"
              onChange={handleFilterChange}
              value={appliedFilter || ''}
            >
              <option value="">Filter Community</option>
              <option value={`${user.homeDistrict} - ${user.currentState}`}>
                {user.homeDistrict} - {user.currentState}
              </option>
              <option value={`${user.homeState} in ${user.currentState}`}>
                {user.homeState} in {user.currentState}
              </option>
              <option value="Keralites in Delhi">Keralites in Delhi</option>
              <option value="Tamilians in Delhi">Tamilians in Delhi</option>
              <option value="Delhites in Delhi">Delhites in Delhi</option>
            </select>
            {!isVisiting && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onVisitCommunity(user.homeState, user.homeDistrict, 'Delhi', 'New Delhi')}
              >
                Visit Delhi Community
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredListings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No listings found in this community.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="bg-white shadow-md rounded-md overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {listing.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm text-gray-600">{listing.user.name}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                  <p className="text-gray-600">{listing.description}</p>
                  <div className="mt-2">
                    {listing.type === 'accommodation' && (
                      <Badge variant="secondary">Accommodation</Badge>
                    )}
                    {listing.type === 'proxy' && (
                      <Badge variant="secondary">Proxy</Badge>
                    )}
                    {listing.type === 'product' && (
                      <Badge variant="secondary">Product</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-blue-600">{listing.location}</div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditListing(listing)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your listing.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteListing(listing.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
