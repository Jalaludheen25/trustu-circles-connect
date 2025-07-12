import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, User as UserIcon, Plus, Search, Phone, MessageCircle, MapPin, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { User, Community, Listing } from '@/pages/Index';
import CommunityFilter from './CommunityFilter';

interface CommunityFeedProps {
  user: User;
  community: Community;
  listings: Listing[];
  onNavigate: (step: string) => void;
  appliedFilter?: string;
  onFilterApplied?: (filter: string) => void;
  isVisiting?: boolean;
  visitingCommunityName?: string;
  onBackToMyCommunity?: () => void;
  onVisitCommunity?: (homeState: string, homeDistrict: string, currentState: string, currentDistrict: string) => void;
  onDeleteListing?: (listingId: string) => void;
  onEditListing?: (listing: Listing) => void;
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
  onEditListing
}: CommunityFeedProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; listing: Listing | null }>({ show: false, listing: null });
  
  // Section-specific filters with proper ranges
  const [accommodationFilters, setAccommodationFilters] = useState({
    accommodationType: '',
    location: '',
    availableFor: '',
    rentPerDay: '',
    rentPerMonth: ''
  });
  
  const [proxyFilters, setProxyFilters] = useState({
    proxyType: '',
    location: '',
    charge: ''
  });
  
  const [productFilters, setProductFilters] = useState({
    itemType: '',
    location: '',
    amount: ''
  });

  // Helper function to check if a price falls within a range
  const isPriceInRange = (price: string | undefined, range: string) => {
    if (!price || !range || range.startsWith('all-')) return true;
    
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    if (isNaN(numericPrice)) return false;
    
    if (range.includes('+')) {
      const minValue = parseFloat(range.replace('+', ''));
      return numericPrice >= minValue;
    }
    
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(val => parseFloat(val));
      return numericPrice >= min && numericPrice <= max;
    }
    
    return false;
  };

  // Function to check if a user belongs to the current community context
  const userBelongsToCommunity = (listingUser: User, homeState: string, homeDistrict: string, currentState: string, currentDistrict: string) => {
    return listingUser.homeState === homeState && 
           listingUser.homeDistrict === homeDistrict &&
           listingUser.currentState === currentState && 
           listingUser.currentDistrict === currentDistrict;
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchTerm || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'accommodation' && listing.type === 'accommodation') ||
      (activeTab === 'proxy' && listing.type === 'proxy') ||
      (activeTab === 'buy-sell' && listing.type === 'product');
    
    // Filter listings based on community membership
    let belongsToCommunity = false;
    
    if (isVisiting && visitingCommunityName) {
      // Extract community info from visiting community name
      if (visitingCommunityName.includes(' in ')) {
        const parts = visitingCommunityName.split(' in ');
        const homeStateMap: { [key: string]: string } = {
          'Keralites': 'Kerala',
          'Tamilians': 'Tamil Nadu',
          'Delhites': 'Delhi'
        };
        const homeState = homeStateMap[parts[0]] || parts[0];
        const currentState = parts[1];
        
        belongsToCommunity = listing.user.homeState === homeState && listing.user.currentState === currentState;
      } else {
        belongsToCommunity = listing.user.homeState === visitingCommunityName && listing.user.currentState === visitingCommunityName;
      }
    } else {
      belongsToCommunity = userBelongsToCommunity(
        listing.user, 
        user.homeState, 
        user.homeDistrict, 
        user.currentState, 
        user.currentDistrict
      );
    }

    // Apply section-specific filters based on actual form data
    let matchesSectionFilter = true;
    if (activeTab === 'accommodation' && listing.type === 'accommodation') {
      if (accommodationFilters.accommodationType && accommodationFilters.accommodationType !== 'all-types' && 
          listing.details?.accommodationType !== accommodationFilters.accommodationType) {
        matchesSectionFilter = false;
      }
      if (accommodationFilters.location && !listing.location.toLowerCase().includes(accommodationFilters.location.toLowerCase())) {
        matchesSectionFilter = false;
      }
      if (accommodationFilters.availableFor && accommodationFilters.availableFor !== 'all-available' && 
          !listing.details?.availableFor?.includes(accommodationFilters.availableFor)) {
        matchesSectionFilter = false;
      }
      if (accommodationFilters.rentPerDay && !isPriceInRange(listing.details?.rentPerDay, accommodationFilters.rentPerDay)) {
        matchesSectionFilter = false;
      }
      if (accommodationFilters.rentPerMonth && !isPriceInRange(listing.details?.rentPerMonth, accommodationFilters.rentPerMonth)) {
        matchesSectionFilter = false;
      }
    } else if (activeTab === 'proxy' && listing.type === 'proxy') {
      if (proxyFilters.proxyType && proxyFilters.proxyType !== 'all-services' && 
          listing.details?.proxyType !== proxyFilters.proxyType) {
        matchesSectionFilter = false;
      }
      if (proxyFilters.location && !listing.location.toLowerCase().includes(proxyFilters.location.toLowerCase())) {
        matchesSectionFilter = false;
      }
      if (proxyFilters.charge && !isPriceInRange(listing.details?.charge, proxyFilters.charge)) {
        matchesSectionFilter = false;
      }
    } else if (activeTab === 'buy-sell' && listing.type === 'product') {
      if (productFilters.itemType && productFilters.itemType !== 'all-items' && 
          listing.details?.itemType !== productFilters.itemType) {
        matchesSectionFilter = false;
      }
      if (productFilters.location && !listing.location.toLowerCase().includes(productFilters.location.toLowerCase())) {
        matchesSectionFilter = false;
      }
      if (productFilters.amount && !isPriceInRange(listing.details?.amount, productFilters.amount)) {
        matchesSectionFilter = false;
      }
    }
    
    return matchesSearch && matchesTab && belongsToCommunity && matchesSectionFilter;
  });

  const handleContact = (contact: string) => {
    window.open(`https://wa.me/91${contact.replace(/\D/g, '')}`, '_blank');
  };

  const formatPrice = (price: string | undefined, type: string) => {
    if (!price) return '';
    if (type === 'accommodation') {
      return `₹${price}`;
    }
    return `₹${price}`;
  };

  const handleFilterChange = (newFilter: string) => {
    onFilterApplied?.(newFilter);
    setShowFilter(false);
  };

  const handleVisitCommunity = (homeState: string, homeDistrict: string, currentState: string, currentDistrict: string) => {
    if (onVisitCommunity) {
      onVisitCommunity(homeState, homeDistrict, currentState, currentDistrict);
    }
    setShowFilter(false);
  };

  const displayCommunityName = isVisiting ? visitingCommunityName : (appliedFilter || community.name);

  // Calculate real member count
  const getMemberCount = () => {
    if (isVisiting && visitingCommunityName) {
      // Count actual users in visited community based on listings
      const uniqueUsers = new Set();
      listings.forEach(listing => {
        if (visitingCommunityName.includes(' in ')) {
          const parts = visitingCommunityName.split(' in ');
          const homeStateMap: { [key: string]: string } = {
            'Keralites': 'Kerala',
            'Tamilians': 'Tamil Nadu',
            'Delhites': 'Delhi'
          };
          const homeState = homeStateMap[parts[0]] || parts[0];
          const currentState = parts[1];
          
          if (listing.user.homeState === homeState && listing.user.currentState === currentState) {
            uniqueUsers.add(listing.user.id);
          }
        } else {
          if (listing.user.homeState === visitingCommunityName && listing.user.currentState === visitingCommunityName) {
            uniqueUsers.add(listing.user.id);
          }
        }
      });
      return uniqueUsers.size;
    } else if (appliedFilter) {
      // For filtered communities, count based on filter
      const uniqueUsers = new Set();
      listings.forEach(listing => {
        // Parse filter to determine community criteria
        if (appliedFilter.includes(' - ')) {
          // District-level filter like "Malappuram - Delhi"
          const [homeDistrict, currentLocation] = appliedFilter.split(' - ');
          if (listing.user.homeDistrict === homeDistrict && 
              (listing.user.currentState === currentLocation || listing.user.currentDistrict === currentLocation)) {
            uniqueUsers.add(listing.user.id);
          }
        } else if (appliedFilter.includes(' in ')) {
          // State-level filter like "Keralites in Delhi"
          const parts = appliedFilter.split(' in ');
          const homeStateMap: { [key: string]: string } = {
            'Keralites': 'Kerala',
            'Tamilians': 'Tamil Nadu',
            'Delhites': 'Delhi'
          };
          const homeState = homeStateMap[parts[0]] || parts[0];
          const currentState = parts[1];
          
          if (listing.user.homeState === homeState && listing.user.currentState === currentState) {
            uniqueUsers.add(listing.user.id);
          }
        }
      });
      return uniqueUsers.size;
    } else {
      // For user's own community, count unique users including themselves
      const uniqueUsers = new Set([user.id]);
      listings.forEach(listing => {
        if (userBelongsToCommunity(listing.user, user.homeState, user.homeDistrict, user.currentState, user.currentDistrict)) {
          uniqueUsers.add(listing.user.id);
        }
      });
      return uniqueUsers.size;
    }
  };

  const memberCount = getMemberCount();

  const handleDeleteListing = (listing: Listing) => {
    setDeleteConfirm({ show: true, listing });
  };

  const confirmDelete = () => {
    if (deleteConfirm.listing && onDeleteListing) {
      onDeleteListing(deleteConfirm.listing.id);
    }
    setDeleteConfirm({ show: false, listing: null });
  };

  const getDeleteMessage = (listing: Listing | null) => {
    if (!listing) return "Are you sure you want to delete this?";
    if (listing.type === 'product') return "Are you sure you want to delete this product listing?";
    return "Are you sure you want to delete this service?";
  };

  const handleEditListing = (listing: Listing) => {
    if (onEditListing) {
      onEditListing(listing);
    }
  };

  const clearSectionFilters = () => {
    setAccommodationFilters({ accommodationType: '', location: '', availableFor: '', rentPerDay: '', rentPerMonth: '' });
    setProxyFilters({ proxyType: '', location: '', charge: '' });
    setProductFilters({ itemType: '', location: '', amount: '' });
  };

  const renderSectionFilters = () => {
    if (activeTab === 'accommodation') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          <Select value={accommodationFilters.accommodationType} onValueChange={(value) => setAccommodationFilters(prev => ({ ...prev, accommodationType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="Flat (Permanent Stay)">Flat (Permanent Stay)</SelectItem>
              <SelectItem value="Flat (Temporary Stay)">Flat (Temporary Stay)</SelectItem>
              <SelectItem value="Hostel">Hostel</SelectItem>
              <SelectItem value="PG">PG</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Location"
            value={accommodationFilters.location}
            onChange={(e) => setAccommodationFilters(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <Select value={accommodationFilters.availableFor} onValueChange={(value) => setAccommodationFilters(prev => ({ ...prev, availableFor: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Available For" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-available">All</SelectItem>
              <SelectItem value="Male Bachelors">Male Bachelors</SelectItem>
              <SelectItem value="Female Bachelors">Female Bachelors</SelectItem>
              <SelectItem value="Families">Families</SelectItem>
              <SelectItem value="Anyone">Anyone</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={accommodationFilters.rentPerDay} onValueChange={(value) => setAccommodationFilters(prev => ({ ...prev, rentPerDay: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Daily Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-day-rates">All Daily Rates</SelectItem>
              <SelectItem value="100-200">₹100-200</SelectItem>
              <SelectItem value="200-400">₹200-400</SelectItem>
              <SelectItem value="400-600">₹400-600</SelectItem>
              <SelectItem value="600-800">₹600-800</SelectItem>
              <SelectItem value="800-1000">₹800-1000</SelectItem>
              <SelectItem value="1000+">₹1000+</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={accommodationFilters.rentPerMonth} onValueChange={(value) => setAccommodationFilters(prev => ({ ...prev, rentPerMonth: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Monthly Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-month-rates">All Monthly Rates</SelectItem>
              <SelectItem value="1500-2500">₹1500-2500</SelectItem>
              <SelectItem value="2500-3500">₹2500-3500</SelectItem>
              <SelectItem value="3500-4500">₹3500-4500</SelectItem>
              <SelectItem value="4500+">₹4500+</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={clearSectionFilters}>
            Clear Filters
          </Button>
        </div>
      );
    } else if (activeTab === 'proxy') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <Select value={proxyFilters.proxyType} onValueChange={(value) => setProxyFilters(prev => ({ ...prev, proxyType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-services">All Services</SelectItem>
              <SelectItem value="Tourist Guide">Tourist Guide</SelectItem>
              <SelectItem value="Proxy Work (Jamia)">Proxy Work (Jamia)</SelectItem>
              <SelectItem value="Proxy Work (DU)">Proxy Work (DU)</SelectItem>
              <SelectItem value="Proxy Work (Anywhere in Delhi)">Proxy Work (Anywhere in Delhi)</SelectItem>
              <SelectItem value="Room Search Assistance">Room Search Assistance</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Location"
            value={proxyFilters.location}
            onChange={(e) => setProxyFilters(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <Select value={proxyFilters.charge} onValueChange={(value) => setProxyFilters(prev => ({ ...prev, charge: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Charge Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-charges">All Charges</SelectItem>
              <SelectItem value="100-200">₹100-200</SelectItem>
              <SelectItem value="200-500">₹200-500</SelectItem>
              <SelectItem value="500-700">₹500-700</SelectItem>
              <SelectItem value="700-1000">₹700-1000</SelectItem>
              <SelectItem value="1000+">₹1000+</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={clearSectionFilters}>
            Clear Filters
          </Button>
        </div>
      );
    } else if (activeTab === 'buy-sell') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <Select value={productFilters.itemType} onValueChange={(value) => setProductFilters(prev => ({ ...prev, itemType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Item Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-items">All Items</SelectItem>
              <SelectItem value="Educational Items">Educational Items</SelectItem>
              <SelectItem value="Electronics and Gadgets">Electronics and Gadgets</SelectItem>
              <SelectItem value="Home & Kitchen Items">Home & Kitchen Items</SelectItem>
              <SelectItem value="Vehicle">Vehicle</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Location"
            value={productFilters.location}
            onChange={(e) => setProductFilters(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <Select value={productFilters.amount} onValueChange={(value) => setProductFilters(prev => ({ ...prev, amount: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-amounts">All Prices</SelectItem>
              <SelectItem value="100-500">₹100-500</SelectItem>
              <SelectItem value="500-1000">₹500-1000</SelectItem>
              <SelectItem value="1000-2000">₹1000-2000</SelectItem>
              <SelectItem value="2000-5000">₹2000-5000</SelectItem>
              <SelectItem value="5000-10000">₹5000-10000</SelectItem>
              <SelectItem value="10000+">₹10000+</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={clearSectionFilters}>
            Clear Filters
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">{displayCommunityName}</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{memberCount} member{memberCount !== 1 ? 's' : ''}</p>
                  {(appliedFilter || isVisiting) && (
                    <Badge variant="secondary" className="text-xs">
                      {isVisiting ? 'Visiting' : 'Filtered View'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isVisiting && onBackToMyCommunity && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBackToMyCommunity}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Back to My Community</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilter(true)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('connections')}
                className="flex items-center space-x-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>My Profile</span>
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Services</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
              <TabsTrigger value="proxy">Proxy</TabsTrigger>
              <TabsTrigger value="buy-sell">Buy & Sell</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search services, products, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Section-specific filters */}
          {renderSectionFilters()}
        </div>
      </div>

      {/* Listings Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No listings found in this community yet.</p>
              {!isVisiting && (
                <p className="text-sm text-gray-400">Be the first to add a service or product!</p>
              )}
            </Card>
          ) : (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{listing.user.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Badge variant="outline">{listing.user.gender}</Badge>
                          <Badge variant="outline">{listing.user.designation}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="default" 
                        className={
                          listing.type === 'accommodation' ? 'bg-blue-100 text-blue-800' :
                          listing.type === 'proxy' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }
                      >
                        {listing.type === 'accommodation' ? 'Accommodation' :
                         listing.type === 'proxy' ? 'Proxy Service' : 'Product'}
                      </Badge>
                      {listing.user.id === user.id && (
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-8 w-8"
                            onClick={() => handleEditListing(listing)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteListing(listing)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">{listing.title}</h4>
                    <p className="text-gray-600 mb-2">{listing.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.location}</span>
                      </div>
                      {listing.price && (
                        <div className="font-semibold text-green-600">
                          {formatPrice(listing.price, listing.type)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      onClick={() => handleContact(listing.contact)}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`tel:${listing.contact}`, '_self')}
                      className="flex items-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Buttons - Only show if not visiting */}
      {!isVisiting && (
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
          <Button
            onClick={() => onNavigate('add-service')}
            size="lg"
            className="rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Service
          </Button>
          <Button
            onClick={() => onNavigate('sell-product')}
            size="lg"
            variant="secondary"
            className="rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Sell Product
          </Button>
        </div>
      )}

      {/* Community Filter Modal */}
      {showFilter && (
        <CommunityFilter
          user={user}
          onClose={() => setShowFilter(false)}
          onFilterChange={handleFilterChange}
          onVisitCommunity={handleVisitCommunity}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.show} onOpenChange={(open) => setDeleteConfirm({ show: open, listing: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{getDeleteMessage(deleteConfirm.listing)}</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ show: false, listing: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityFeed;
