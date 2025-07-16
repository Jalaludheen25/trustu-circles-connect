import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, User, Settings, Heart, MapPin, Calendar, Star, Filter, Search, Home, Briefcase } from 'lucide-react';
import { User as UserType, Community, Listing } from '@/pages/Index';
import CommunityFilter from './CommunityFilter';

interface CommunityFeedProps {
  user: UserType;
  community: Community;
  listings: Listing[];
  onNavigate: (page: string) => void;
  appliedFilter?: string;
  onFilterApplied: (filter: string) => void;
  isVisiting?: boolean;
  visitingCommunityName?: string;
  onBackToMyCommunity: () => void;
  onVisitCommunity: (homeState: string, homeDistrict: string, currentState: string, currentDistrict: string) => void;
  onDeleteListing: (listingId: string) => void;
  onEditListing: (listing: Listing) => void;
  connections: UserType[];
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
  const { toast } = useToast();
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showListingDetails, setShowListingDetails] = useState(false);

  const currentCommunityName = isVisiting && visitingCommunityName ? visitingCommunityName : 
    (appliedFilter || community.name);

  const filteredListings = listings.filter(listing => {
    if (appliedFilter) {
      if (appliedFilter.includes(' - ')) {
        const [homeDistrict, currentLocation] = appliedFilter.split(' - ');
        return listing.user.homeDistrict === homeDistrict && 
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
        
        return listing.user.homeState === homeState && listing.user.currentState === currentState;
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
        
        return listing.user.homeState === homeState && listing.user.currentState === currentState;
      } else {
        return listing.user.homeState === visitingCommunityName && listing.user.currentState === visitingCommunityName;
      }
    } else {
      return listing.user.homeState === user.homeState && 
        listing.user.homeDistrict === user.homeDistrict &&
        listing.user.currentState === user.currentState && 
        listing.user.currentDistrict === user.currentDistrict;
    }
    
    return true;
  });

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setShowListingDetails(true);
  };

  const getListingIcon = (type: string) => {
    switch (type) {
      case 'accommodation': return <Home className="w-5 h-5" />;
      case 'proxy': return <User className="w-5 h-5" />;
      case 'product': return <Briefcase className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'accommodation': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'proxy': return 'bg-green-50 text-green-700 border-green-200';
      case 'product': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TrustU</h1>
                  <p className="text-sm text-gray-600">{currentCommunityName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterDialog(true)}
                className="border-gray-200 hover:border-rose-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('connections')}
                className="border-gray-200 hover:border-rose-300"
              >
                <Users className="w-4 h-4 mr-2" />
                My Circle
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('profile')}
                className="border-gray-200 hover:border-rose-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                My Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Community Info Card */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {user.homeDistrict}, {user.homeState} → {user.currentDistrict}, {user.currentState}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50">
                      {user.designation}
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      {connections.length} connections
                    </Badge>
                  </div>
                </div>
              </div>
              
              {(isVisiting || appliedFilter) && (
                <Button
                  onClick={onBackToMyCommunity}
                  variant="outline"
                  className="border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  Back to My Community
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => onNavigate('add-service')}
            className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto mb-1" />
              <span className="font-medium">Add Service</span>
            </div>
          </Button>
          
          <Button
            onClick={() => onNavigate('sell-product')}
            className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
          >
            <div className="text-center">
              <Plus className="w-6 h-6 mx-auto mb-1" />
              <span className="font-medium">Sell Product</span>
            </div>
          </Button>
          
          <Button
            onClick={() => onNavigate('community-members')}
            className="h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
          >
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-1" />
              <span className="font-medium">Community Members</span>
            </div>
          </Button>
        </div>

        {/* Listings Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Community Listings</h2>
            <span className="text-gray-600">{filteredListings.length} listings available</span>
          </div>

          {filteredListings.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
                <p className="text-gray-500 mb-6">
                  Be the first to add a service or product to your community!
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => onNavigate('add-service')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    Add Service
                  </Button>
                  <Button
                    onClick={() => onNavigate('sell-product')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    Sell Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card
                  key={listing.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => handleListingClick(listing)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                            {listing.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{listing.user.name}</p>
                          <p className="text-xs text-gray-500">{listing.user.designation}</p>
                        </div>
                      </div>
                      <Badge className={`${getListingTypeColor(listing.type)} border`}>
                        {getListingIcon(listing.type)}
                        <span className="ml-1 capitalize">{listing.type}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{listing.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                      {listing.price && (
                        <span className="font-semibold text-green-600">{listing.price}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {listing.userId === user.id && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditListing(listing);
                            }}
                            className="h-7 px-2 text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteListing(listing.id);
                              toast({
                                title: "Listing Deleted",
                                description: "Your listing has been removed.",
                              });
                            }}
                            className="h-7 px-2 text-xs"
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Communities</DialogTitle>
          </DialogHeader>
          <CommunityFilter
            user={user}
            onClose={() => setShowFilterDialog(false)}
            onFilterChange={(filter) => {
              onFilterApplied(filter);
              setShowFilterDialog(false);
            }}
            onVisitCommunity={(homeState, homeDistrict, currentState, currentDistrict) => {
              onVisitCommunity(homeState, homeDistrict, currentState, currentDistrict);
              setShowFilterDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Listing Details Dialog */}
      <Dialog open={showListingDetails} onOpenChange={setShowListingDetails}>
        <DialogContent className="max-w-2xl">
          {selectedListing && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedListing.title}</DialogTitle>
              </DialogHeader>
              
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                    {selectedListing.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedListing.user.name}</h4>
                  <p className="text-sm text-gray-600">{selectedListing.user.designation}</p>
                </div>
                <Badge className={`${getListingTypeColor(selectedListing.type)} border ml-auto`}>
                  {getListingIcon(selectedListing.type)}
                  <span className="ml-1 capitalize">{selectedListing.type}</span>
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-700">{selectedListing.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">Location</h5>
                    <p className="text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedListing.location}
                    </p>
                  </div>
                  
                  {selectedListing.price && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Price</h5>
                      <p className="text-green-600 font-semibold">{selectedListing.price}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Contact</h5>
                  <p className="text-gray-700">{selectedListing.contact}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(selectedListing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityFeed;
