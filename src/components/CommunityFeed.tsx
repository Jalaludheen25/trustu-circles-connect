import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, User, Settings, Heart, MapPin, Calendar, Star, Filter, Search, Home, Briefcase, X } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter states
  const [accommodationFilters, setAccommodationFilters] = useState({
    accommodationType: '',
    availableFor: '',
    maxOccupancy: '',
    rentPerDay: '',
    rentPerMonth: ''
  });
  
  const [proxyFilters, setProxyFilters] = useState({
    serviceType: '',
    chargeRange: ''
  });
  
  const [productFilters, setProductFilters] = useState({
    itemType: '',
    priceRange: ''
  });

  const currentCommunityName = isVisiting && visitingCommunityName ? visitingCommunityName : 
    (appliedFilter || community.name);

  const filteredListings = listings.filter(listing => {
    // First apply community filter
    let communityFiltered = true;
    
    if (appliedFilter) {
      if (appliedFilter.includes(' - ')) {
        const [homeDistrict, currentLocation] = appliedFilter.split(' - ');
        communityFiltered = listing.user.homeDistrict === homeDistrict && 
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
        
        communityFiltered = listing.user.homeState === homeState && listing.user.currentState === currentState;
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
        
        communityFiltered = listing.user.homeState === homeState && listing.user.currentState === currentState;
      } else {
        communityFiltered = listing.user.homeState === visitingCommunityName && listing.user.currentState === visitingCommunityName;
      }
    } else {
      communityFiltered = listing.user.homeState === user.homeState && 
        listing.user.homeDistrict === user.homeDistrict &&
        listing.user.currentState === user.currentState && 
        listing.user.currentDistrict === user.currentDistrict;
    }

    if (!communityFiltered) return false;
    
    // Apply tab filter
    if (activeTab !== 'all' && listing.type !== activeTab) return false;
    
    // Apply specific filters based on listing type
    if (listing.type === 'accommodation') {
      if (accommodationFilters.accommodationType && 
          listing.details?.accommodationType !== accommodationFilters.accommodationType) return false;
      if (accommodationFilters.availableFor && 
          !listing.details?.availableFor?.includes(accommodationFilters.availableFor)) return false;
      if (accommodationFilters.maxOccupancy && 
          listing.details?.maxOccupancy !== accommodationFilters.maxOccupancy) return false;
      if (accommodationFilters.rentPerDay && 
          listing.details?.rentPerDay !== accommodationFilters.rentPerDay) return false;
      if (accommodationFilters.rentPerMonth && 
          listing.details?.rentPerMonth !== accommodationFilters.rentPerMonth) return false;
    }
    
    if (listing.type === 'proxy') {
      if (proxyFilters.serviceType && 
          listing.details?.proxyType !== proxyFilters.serviceType) return false;
      if (proxyFilters.chargeRange && 
          !isInChargeRange(listing.details?.charge, proxyFilters.chargeRange)) return false;
    }
    
    if (listing.type === 'product') {
      if (productFilters.itemType && 
          listing.details?.itemType !== productFilters.itemType) return false;
      if (productFilters.priceRange && 
          !isInPriceRange(listing.price, productFilters.priceRange)) return false;
    }
    
    return true;
  });

  const isInChargeRange = (charge: string, range: string) => {
    if (!charge || !range) return true;
    const chargeNum = parseInt(charge);
    switch (range) {
      case '100-200': return chargeNum >= 100 && chargeNum <= 200;
      case '200-500': return chargeNum >= 200 && chargeNum <= 500;
      case '500-700': return chargeNum >= 500 && chargeNum <= 700;
      case '700-1000': return chargeNum >= 700 && chargeNum <= 1000;
      case '1000+': return chargeNum >= 1000;
      default: return true;
    }
  };

  const isInPriceRange = (price: string, range: string) => {
    if (!price || !range) return true;
    const priceNum = parseInt(price);
    switch (range) {
      case '100-500': return priceNum >= 100 && priceNum <= 500;
      case '500-1000': return priceNum >= 500 && priceNum <= 1000;
      case '1000-2000': return priceNum >= 1000 && priceNum <= 2000;
      case '2000-5000': return priceNum >= 2000 && priceNum <= 5000;
      case '5000+': return priceNum >= 5000;
      default: return true;
    }
  };

  const clearFilters = () => {
    setAccommodationFilters({
      accommodationType: '',
      availableFor: '',
      maxOccupancy: '',
      rentPerDay: '',
      rentPerMonth: ''
    });
    setProxyFilters({
      serviceType: '',
      chargeRange: ''
    });
    setProductFilters({
      itemType: '',
      priceRange: ''
    });
  };

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

  const getTabCounts = () => {
    const allListings = listings.filter(listing => {
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

    return {
      all: allListings.length,
      accommodation: allListings.filter(l => l.type === 'accommodation').length,
      proxy: allListings.filter(l => l.type === 'proxy').length,
      product: allListings.filter(l => l.type === 'product').length
    };
  };

  const tabCounts = getTabCounts();

  const renderFilters = () => {
    if (activeTab === 'accommodation') {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filter Accommodations</h3>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={accommodationFilters.accommodationType} onValueChange={(value) => setAccommodationFilters(prev => ({...prev, accommodationType: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Accommodation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flat (Permanent Stay)">Flat (Permanent Stay)</SelectItem>
                <SelectItem value="Flat (Temporary Stay)">Flat (Temporary Stay)</SelectItem>
                <SelectItem value="Hostel">Hostel</SelectItem>
                <SelectItem value="PG">PG</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={accommodationFilters.availableFor} onValueChange={(value) => setAccommodationFilters(prev => ({...prev, availableFor: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Available For" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male Bachelors">Male Bachelors</SelectItem>
                <SelectItem value="Female Bachelors">Female Bachelors</SelectItem>
                <SelectItem value="Families">Families</SelectItem>
                <SelectItem value="Anyone">Anyone</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={accommodationFilters.maxOccupancy} onValueChange={(value) => setAccommodationFilters(prev => ({...prev, maxOccupancy: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Max Occupancy" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={accommodationFilters.rentPerDay} onValueChange={(value) => setAccommodationFilters(prev => ({...prev, rentPerDay: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Rent Per Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100-200">₹100-200</SelectItem>
                <SelectItem value="200-400">₹200-400</SelectItem>
                <SelectItem value="400-600">₹400-600</SelectItem>
                <SelectItem value="600-800">₹600-800</SelectItem>
                <SelectItem value="800-1000">₹800-1000</SelectItem>
                <SelectItem value="1000+">₹1000 and above</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={accommodationFilters.rentPerMonth} onValueChange={(value) => setAccommodationFilters(prev => ({...prev, rentPerMonth: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Rent Per Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1500-2500">₹1500-2500</SelectItem>
                <SelectItem value="2500-3500">₹2500-3500</SelectItem>
                <SelectItem value="3500-4500">₹3500-4500</SelectItem>
                <SelectItem value="4500+">₹4500 and above</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (activeTab === 'proxy') {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filter Proxy Services</h3>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={proxyFilters.serviceType} onValueChange={(value) => setProxyFilters(prev => ({...prev, serviceType: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tourist Guide">Tourist Guide</SelectItem>
                <SelectItem value="Proxy Work (Jamia)">Proxy Work (Jamia)</SelectItem>
                <SelectItem value="Proxy Work (DU)">Proxy Work (DU)</SelectItem>
                <SelectItem value="Proxy Work (Anywhere in Delhi)">Proxy Work (Anywhere in Delhi)</SelectItem>
                <SelectItem value="Room Search Assistance">Room Search Assistance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={proxyFilters.chargeRange} onValueChange={(value) => setProxyFilters(prev => ({...prev, chargeRange: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Charge Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100-200">₹100-200</SelectItem>
                <SelectItem value="200-500">₹200-500</SelectItem>
                <SelectItem value="500-700">₹500-700</SelectItem>
                <SelectItem value="700-1000">₹700-1000</SelectItem>
                <SelectItem value="1000+">₹1000 and above</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (activeTab === 'product') {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filter Products</h3>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={productFilters.itemType} onValueChange={(value) => setProductFilters(prev => ({...prev, itemType: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Item Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Educational Items">Educational Items</SelectItem>
                <SelectItem value="Electronics and Gadgets">Electronics and Gadgets</SelectItem>
                <SelectItem value="Home & Kitchen Items">Home & Kitchen Items</SelectItem>
                <SelectItem value="Vehicle">Vehicle</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={productFilters.priceRange} onValueChange={(value) => setProductFilters(prev => ({...prev, priceRange: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100-500">₹100-500</SelectItem>
                <SelectItem value="500-1000">₹500-1000</SelectItem>
                <SelectItem value="1000-2000">₹1000-2000</SelectItem>
                <SelectItem value="2000-5000">₹2000-5000</SelectItem>
                <SelectItem value="5000+">₹5000 and above</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return null;
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
                      {currentCommunityName}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('connections')}
                      className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 h-6 px-2 text-xs"
                    >
                      {connections.length} connections
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => onNavigate('add-service')}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
                <Button
                  onClick={() => onNavigate('sell-product')}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Sell Product
                </Button>
              </div>
            </div>
            
            {(isVisiting || appliedFilter) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={onBackToMyCommunity}
                  variant="outline"
                  className="border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  Back to My Community
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Listings Section with Tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Community Listings</h2>
            <span className="text-gray-600">{filteredListings.length} listings available</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6 h-12">
              <TabsTrigger value="all" className="flex items-center space-x-2 text-sm font-medium">
                <span>All Listings</span>
                <Badge variant="secondary" className="ml-1">{tabCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="accommodation" className="flex items-center space-x-2 text-sm font-medium">
                <Home className="w-4 h-4" />
                <span>Accommodation</span>
                <Badge variant="secondary" className="ml-1">{tabCounts.accommodation}</Badge>
              </TabsTrigger>
              <TabsTrigger value="proxy" className="flex items-center space-x-2 text-sm font-medium">
                <User className="w-4 h-4" />
                <span>Proxy</span>
                <Badge variant="secondary" className="ml-1">{tabCounts.proxy}</Badge>
              </TabsTrigger>
              <TabsTrigger value="product" className="flex items-center space-x-2 text-sm font-medium">
                <Briefcase className="w-4 h-4" />
                <span>Buy & Sell</span>
                <Badge variant="secondary" className="ml-1">{tabCounts.product}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Render filters based on active tab */}
            {renderFilters()}

            <TabsContent value={activeTab}>
              {filteredListings.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
                    <p className="text-gray-500 mb-6">
                      {activeTab === 'all' 
                        ? "Be the first to add a service or product to your community!"
                        : `No ${activeTab} listings available in your community.`
                      }
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
            </TabsContent>
          </Tabs>
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
