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
  connections?: User[];
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
  connections = []
}: CommunityFeedProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; listing: Listing | null }>({ show: false, listing: null });
  const [showOnlyFriends, setShowOnlyFriends] = useState(false);
  const [showMutualConnections, setShowMutualConnections] = useState(false);
  const [selectedUserMutuals, setSelectedUserMutuals] = useState<User[]>([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  
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

  // Mock community members for generating friend listings
  const mockCommunityMembers: User[] = [
    {
      id: '2',
      name: 'Fathima Ashraf',
      gender: 'Female' as const,
      designation: 'Student' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '3',
      name: 'Mohammed Salim',
      gender: 'Male' as const,
      designation: 'Working Professional' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    },
    {
      id: '4',
      name: 'Anitha Menon',
      gender: 'Female' as const,
      designation: 'Freelancer' as const,
      homeState: user.homeState,
      homeDistrict: user.homeDistrict,
      currentState: user.currentState,
      currentDistrict: user.currentDistrict,
    }
  ];

  // Generate mock listings from friends
  const generateMockListings = (): Listing[] => {
    const mockListings: Listing[] = [];
    
    // Only show mock listings if user has connections
    if (connections.length > 0) {
      // Generate accommodation listings
      mockListings.push({
        id: 'mock-acc-1',
        userId: connections[0]?.id || '2',
        user: connections[0] || mockCommunityMembers[0],
        type: 'accommodation',
        title: 'Cozy 2BHK Flat for Students',
        description: 'Well-furnished flat near metro station, perfect for students',
        location: `${user.currentDistrict}, ${user.currentState}`,
        contact: '9876543210',
        price: '₹3000',
        details: {
          accommodationType: 'Flat (Permanent Stay)',
          availableFor: ['Male Bachelors', 'Female Bachelors'],
          maxOccupancy: 3,
          rentPerDay: '150',
          rentPerMonth: '3000'
        },
        createdAt: new Date()
      });

      // Generate proxy service listings
      if (connections.length > 1) {
        mockListings.push({
          id: 'mock-proxy-1',
          userId: connections[1]?.id || '3',
          user: connections[1] || mockCommunityMembers[1],
          type: 'proxy',
          title: 'Tourist Guide Services',
          description: 'Professional guide for Delhi sightseeing and local assistance',
          location: `${user.currentState}`,
          contact: '9876543211',
          price: '₹500',
          details: {
            proxyType: 'Tourist Guide',
            charge: '500'
          },
          createdAt: new Date()
        });
      }

      // Generate product listings
      if (connections.length > 2 || connections.length > 0) {
        mockListings.push({
          id: 'mock-product-1',
          userId: connections[0]?.id || '2',
          user: connections[0] || mockCommunityMembers[0],
          type: 'product',
          title: 'Engineering Books Set',
          description: 'Complete set of engineering textbooks in excellent condition',
          location: `${user.currentDistrict}, ${user.currentState}`,
          contact: '9876543210',
          price: '₹2500',
          details: {
            itemType: 'Educational Items',
            amount: '2500'
          },
          createdAt: new Date()
        });
      }
    }
    
    return mockListings;
  };

  const mockListings = generateMockListings();
  const allListings = [...listings, ...mockListings];

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

  // Function to get mutual connections
  const getMutualConnections = (userId: string): User[] => {
    // For demo purposes, return some connections as mutual
    if (connections.length > 1 && userId !== user.id) {
      return connections.slice(0, Math.min(2, connections.length));
    }
    return [];
  };

  const handleShowMutuals = (listing: Listing) => {
    const mutuals = getMutualConnections(listing.userId);
    setSelectedUserMutuals(mutuals);
    setSelectedUserName(listing.user.name);
    setShowMutualConnections(true);
  };

  const filteredListings = allListings.filter(listing => {
    const matchesSearch = !searchTerm || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'accommodation' && listing.type === 'accommodation') ||
      (activeTab === 'proxy' && listing.type === 'proxy') ||
      (activeTab === 'buy-sell' && listing.type === 'product');
    
    // Filter based on friends only option
    const matchesFriendsFilter = !showOnlyFriends || 
      connections.some(conn => conn.id === listing.userId) ||
      listing.userId === user.id;
    
    // Filter listings based on community membership
    let belongsToCommunity = true;
    
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
    
    return matchesSearch && matchesTab && belongsToCommunity && matchesSectionFilter && matchesFriendsFilter;
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

  // Calculate real member count including connections
  const getMemberCount = () => {
    const baseCount = 1; // Current user
    const connectionsCount = connections.length;
    const totalMembers = baseCount + connectionsCount + mockCommunityMembers.length;
    
    if (isVisiting && visitingCommunityName) {
      return Math.max(totalMembers, 8); // Show realistic number for visited communities
    } else if (appliedFilter) {
      return Math.max(totalMembers, 6);
    } else {
      return totalMembers;
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
    const friendsFilterSelect = (
      <Select value={showOnlyFriends ? 'friends' : 'all'} onValueChange={(value) => setShowOnlyFriends(value === 'friends')}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Listings</SelectItem>
          <SelectItem value="friends">Only Friends</SelectItem>
        </SelectContent>
      </Select>
    );

    if (activeTab === 'accommodation') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {friendsFilterSelect}
          
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
          {friendsFilterSelect}
          
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
          {friendsFilterSelect}
          
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
    } else {
      return (
        <div className="mt-4">
          {friendsFilterSelect}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('community-members')}
                className="flex items-center space-x-2"
              >
                <Users className="w-6 h-6 text-blue-500" />
              </Button>
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
            filteredListings.map((listing) => {
              const mutualCount = getMutualConnections(listing.userId).length;
              const isFromConnection = connections.some(conn => conn.id === listing.userId);
              
              return (
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
                            {isFromConnection && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                Friend
                              </Badge>
                            )}
                          </div>
                          {mutualCount > 0 && listing.userId !== user.id && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-xs text-blue-600"
                              onClick={() => handleShowMutuals(listing)}
                            >
                              {mutualCount} mutual connection{mutualCount !== 1 ? 's' : ''}
                            </Button>
                          )}
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
              );
            })
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

      {/* Mutual Connections Dialog */}
      <Dialog open={showMutualConnections} onOpenChange={setShowMutualConnections}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mutual Connections with {selectedUserName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedUserMutuals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No mutual connections found.</p>
            ) : (
              selectedUserMutuals.map((mutual) => (
                <div key={mutual.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{mutual.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">{mutual.gender}</Badge>
                      <Badge variant="secondary" className="text-xs">{mutual.designation}</Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

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
