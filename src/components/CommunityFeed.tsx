import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, User, Settings, Heart, MapPin, Calendar, Star, Filter, Search, Home, Briefcase, X, UserCheck, UserX, MessageCircle, TrendingUp, Trash2 } from 'lucide-react';
import { User as UserType, Community, Listing } from '@/pages/Index';
import CommunityFilter from './CommunityFilter';
import ProfileUpdateDialog from './ProfileUpdateDialog';

interface Post {
  id: string;
  userId: string;
  user: UserType;
  content: string;
  upvotes: number;
  responses: number;
  createdAt: string;
  hasUpvoted: boolean;
}

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
  onUpdateUser: (userData: Partial<UserType>) => void;
  onLogout: () => void;
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
  connections,
  onUpdateUser,
  onLogout
}: CommunityFeedProps) => {
  const { toast } = useToast();
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showListingDetails, setShowListingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('community');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  // Posts state
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post1',
      userId: 'user1',
      user: { id: 'user1', name: 'Arjun K', phone: '9876543210', homeState: 'Kerala', homeDistrict: 'Malappuram', currentState: 'Delhi', currentDistrict: 'New Delhi', designation: 'Student', gender: 'Male' },
      content: 'Anyone knows a xerox shop near Noor Nagar? Need to print some documents urgently.',
      upvotes: 7,
      responses: 3,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      hasUpvoted: false
    },
    {
      id: 'post2',
      userId: 'user2',
      user: { id: 'user2', name: 'Priya S', phone: '9876543211', homeState: 'Kerala', homeDistrict: 'Kottayam', currentState: 'Delhi', currentDistrict: 'New Delhi', designation: 'Student', gender: 'Female' },
      content: 'Is there anyone who has taken Indo-Arab as CBCS course? Need some guidance about the syllabus.',
      upvotes: 12,
      responses: 8,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      hasUpvoted: false
    }
  ]);
  const [newPostContent, setNewPostContent] = useState('');
  
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
    chargeRange: '',
    location: '',
    date: ''
  });
  
  const [productFilters, setProductFilters] = useState({
    itemType: '',
    priceRange: '',
    location: '',
    itemDetails: ''
  });

  const currentCommunityName = isVisiting && visitingCommunityName ? visitingCommunityName : 
    (appliedFilter || community.name);

  // Generate logical member counts based on community type
  const getCommunityMemberCounts = () => {
    const communityName = currentCommunityName.toLowerCase();
    
    // Base logic: Larger states/cities have more members, specific districts have fewer
    if (communityName.includes('keralites in delhi')) {
      return { total: 50, connections: Math.min(connections.length, 8), mutual: Math.min(connections.length * 2, 15) };
    } else if (communityName.includes('keralites in tamil nadu')) {
      return { total: 35, connections: Math.min(connections.length, 6), mutual: Math.min(connections.length * 2, 12) };
    } else if (communityName.includes('keralites in chennai') || communityName.includes('chennai')) {
      return { total: 18, connections: Math.min(connections.length, 4), mutual: Math.min(connections.length * 2, 8) };
    } else if (communityName.includes('tamilians in delhi')) {
      return { total: 28, connections: Math.min(connections.length, 5), mutual: Math.min(connections.length * 2, 10) };
    } else if (communityName.includes('tamilians in kerala')) {
      return { total: 12, connections: Math.min(connections.length, 3), mutual: Math.min(connections.length * 2, 6) };
    } else if (communityName.includes('delhites') || communityName.includes('delhi')) {
      return { total: 85, connections: Math.min(connections.length, 12), mutual: Math.min(connections.length * 2, 20) };
    } else if (communityName.includes('malappuram')) {
      return { total: 25, connections: Math.min(connections.length, 5), mutual: Math.min(connections.length * 2, 10) };
    } else if (communityName.includes('kottayam') || communityName.includes('ernakulam')) {
      return { total: 32, connections: Math.min(connections.length, 6), mutual: Math.min(connections.length * 2, 12) };
    } else if (communityName.includes('thiruvananthapuram') || communityName.includes('kozhikode')) {
      return { total: 28, connections: Math.min(connections.length, 5), mutual: Math.min(connections.length * 2, 10) };
    } else {
      // Default for smaller communities
      return { total: 20, connections: Math.min(connections.length, 4), mutual: Math.min(connections.length * 2, 8) };
    }
  };

  const memberCounts = getCommunityMemberCounts();

  const filteredListings = listings.filter(listing => {
    // Check if listing.user exists to prevent null errors
    if (!listing.user) {
      console.log('Filtering listing: No user data for listing', listing.title);
      return false;
    }
    
    console.log('Filtering listing:', listing.title, 'by user:', listing.user.name);
    console.log('User home state:', listing.user.homeState, 'User current state:', listing.user.currentState);
    console.log('Current user home state:', user.homeState, 'Current user current state:', user.currentState);
    
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
      // Modified to show users from same home state and current state (not requiring exact districts)
      communityFiltered = listing.user.homeState === user.homeState && 
        listing.user.currentState === user.currentState;
    }

    if (!communityFiltered) return false;
    
    // Apply tab filter - removed 'all' tab
    if (activeTab && listing.type !== activeTab) return false;
    
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
      if (proxyFilters.location && 
          !listing.location.toLowerCase().includes(proxyFilters.location.toLowerCase())) return false;
    }
    
    if (listing.type === 'product') {
      if (productFilters.itemType && 
          listing.details?.itemType !== productFilters.itemType) return false;
      if (productFilters.priceRange && 
          !isInPriceRange(listing.price, productFilters.priceRange)) return false;
      if (productFilters.location && 
          !listing.location.toLowerCase().includes(productFilters.location.toLowerCase())) return false;
      if (productFilters.itemDetails && 
          !listing.description.toLowerCase().includes(productFilters.itemDetails.toLowerCase())) return false;
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
      chargeRange: '',
      location: '',
      date: ''
    });
    setProductFilters({
      itemType: '',
      priceRange: '',
      location: '',
      itemDetails: ''
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

  const isConnectedTo = (userId: string) => {
    return connections.some(conn => conn.id === userId);
  };

  const getMutualFriends = (userId: string) => {
    // For demo purposes, we'll simulate mutual friends based on some criteria
    // In a real app, this would come from your backend
    const mutualFriendsData: { [key: string]: string[] } = {
      'user1': ['Arjun Nair', 'Priya Menon'],
      'user2': ['Arjun Nair'],
      'user3': [],
      'user4': ['Priya Menon'],
      'user5': ['Arjun Nair', 'Priya Menon'],
      'user6': []
    };
    
    return mutualFriendsData[userId] || [];
  };

  const getTabCounts = () => {
    const allListings = listings.filter(listing => {
      // Check if listing.user exists to prevent null errors
      if (!listing.user) return false;
      
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select value={accommodationFilters.accommodationType} onValueChange={(value) => setAccommodationFilters(prev => ({...prev, accommodationType: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Connection Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="mutual">Mutual Friends</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={proxyFilters.serviceType} onValueChange={(value) => setProxyFilters(prev => ({...prev, serviceType: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academic/Admission Related Assistance">Academic/Admission Related Assistance</SelectItem>
                <SelectItem value="Accommodation Assistance">Accommodation Assistance</SelectItem>
                <SelectItem value="General Errands/Office Work">General Errands/Office Work</SelectItem>
                <SelectItem value="Trusted Carry">Trusted Carry</SelectItem>
                <SelectItem value="Travel Guide">Travel Guide</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={proxyFilters.chargeRange} onValueChange={(value) => setProxyFilters(prev => ({...prev, chargeRange: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Charge Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100-300">₹100-300</SelectItem>
                <SelectItem value="400-600">₹400-600</SelectItem>
                <SelectItem value="700-1000">₹700-1000</SelectItem>
                <SelectItem value="1000+">₹1000 and above</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Location (optional)"
              value={proxyFilters.location}
              onChange={(e) => setProxyFilters(prev => ({...prev, location: e.target.value}))}
            />

            <Input
              type="date"
              placeholder="Date"
              value={proxyFilters.date}
              onChange={(e) => setProxyFilters(prev => ({...prev, date: e.target.value}))}
            />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            
            <input
              type="text"
              placeholder="Location"
              value={productFilters.location}
              onChange={(e) => setProductFilters(prev => ({...prev, location: e.target.value}))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="text"
              placeholder="Item Details"
              value={productFilters.itemDetails}
              onChange={(e) => setProductFilters(prev => ({...prev, itemDetails: e.target.value}))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
                onClick={() => onNavigate('connections')}
                className="border-gray-200 hover:border-rose-300"
              >
                <Users className="w-4 h-4 mr-2" />
                My Circle
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfileDialog(true)}
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
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentCommunityName}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {memberCounts.total} members in this community
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('connections')}
                      className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 h-6 px-2 text-xs"
                    >
                      {memberCounts.connections} connections
                    </Button>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <UserCheck className="w-3 h-3" />
                      <span>{memberCounts.mutual} mutual connections</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {!isVisiting && (
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
              )}
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

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6 h-12">
            <TabsTrigger value="community" className="flex items-center space-x-2 text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              <span>Community</span>
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

          <TabsContent value="community">
            {/* Ask Something Section */}
            <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Ask any query to your community..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="border-gray-200 focus:border-rose-300 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        onClick={() => {
                          if (newPostContent.trim()) {
                            const newPost: Post = {
                              id: `post${Date.now()}`,
                              userId: user.id,
                              user: user,
                              content: newPostContent,
                              upvotes: 0,
                              responses: 0,
                              createdAt: new Date().toISOString(),
                              hasUpvoted: false
                            };
                            setPosts([newPost, ...posts]);
                            setNewPostContent('');
                            toast({
                              title: "Posted Successfully",
                              description: "Your query has been posted to the community.",
                            });
                          }
                        }}
                        disabled={!newPostContent.trim()}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                      >
                        Post Query
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts
                .sort((a, b) => b.upvotes - a.upvotes)
                .map((post) => (
                <Card key={post.id} className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {post.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                            <p className="text-sm text-gray-600">{post.user.designation} • {new Date(post.createdAt).toLocaleTimeString()}</p>
                          </div>
                          {post.userId === user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPosts(posts.filter(p => p.id !== post.id));
                                toast({
                                  title: "Post Deleted",
                                  description: "Your post has been removed.",
                                });
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-gray-800 mt-3">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPosts(posts.map(p => 
                                p.id === post.id 
                                  ? { ...p, upvotes: post.hasUpvoted ? p.upvotes - 1 : p.upvotes + 1, hasUpvoted: !post.hasUpvoted }
                                  : p
                              ));
                            }}
                            className={`flex items-center space-x-1 ${post.hasUpvoted ? 'text-rose-600' : 'text-gray-500'} hover:text-rose-600`}
                          >
                            <TrendingUp className="w-4 h-4" />
                            <span>{post.upvotes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Respond ({post.responses})</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accommodation">
            {renderFilters()}
            
            {filteredListings.filter(l => l.type === 'accommodation').length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No accommodation listings found</h3>
                  <p className="text-gray-500 mb-6">No accommodation listings available in your community.</p>
                  {!isVisiting && (
                    <Button
                      onClick={() => onNavigate('add-service')}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      Add Service
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.filter(l => l.type === 'accommodation').map((listing) => (
                  <Card
                    key={listing.id}
                    className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleListingClick(listing)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xs">
                            {listing.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{listing.user.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="capitalize">{listing.type}</span>
                            <span>•</span>
                            <span>{listing.location}</span>
                            <span>•</span>
                            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                          {listing.userId !== user.id && (
                            <div className="mt-1">
                              {isConnectedTo(listing.userId) ? (
                                <div className="flex items-center text-green-600 text-xs">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  <span>{getMutualFriends(listing.userId).length} mutual friends</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-gray-500 text-xs">
                                  <UserX className="w-3 h-3 mr-1" />
                                  <span>Not Connected • {getMutualFriends(listing.userId).length} mutual friends</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleListingClick(listing);
                          }}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          View More Details
                        </Button>
                        {listing.userId === user.id && (
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditListing(listing);
                              }}
                              className="text-xs px-2 py-1"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteListing(listing.id);
                              }}
                              className="text-xs px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
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

          <TabsContent value="proxy">
            {renderFilters()}
            
            {filteredListings.filter(l => l.type === 'proxy').length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No proxy service listings found</h3>
                  <p className="text-gray-500 mb-6">No proxy service listings available in your community.</p>
                  {!isVisiting && (
                    <Button
                      onClick={() => onNavigate('add-service')}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      Add Service
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.filter(l => l.type === 'proxy').map((listing) => (
                  <Card
                    key={listing.id}
                    className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleListingClick(listing)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xs">
                            {listing.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{listing.user.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="capitalize">{listing.type}</span>
                            <span>•</span>
                            <span>{listing.location}</span>
                            <span>•</span>
                            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                          {listing.userId !== user.id && (
                            <div className="mt-1">
                              {isConnectedTo(listing.userId) ? (
                                <div className="flex items-center text-green-600 text-xs">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  <span>{getMutualFriends(listing.userId).length} mutual friends</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-gray-500 text-xs">
                                  <UserX className="w-3 h-3 mr-1" />
                                  <span>Not Connected • {getMutualFriends(listing.userId).length} mutual friends</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleListingClick(listing);
                          }}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          View More Details
                        </Button>
                        {listing.userId === user.id && (
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditListing(listing);
                              }}
                              className="text-xs px-2 py-1"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteListing(listing.id);
                              }}
                              className="text-xs px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
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

          <TabsContent value="product">
            {renderFilters()}
            
            {filteredListings.filter(l => l.type === 'product').length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No product listings found</h3>
                  <p className="text-gray-500 mb-6">No product listings available in your community.</p>
                  {!isVisiting && (
                    <Button
                      onClick={() => onNavigate('sell-product')}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      Sell Product
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.filter(l => l.type === 'product').map((listing) => (
                  <Card
                    key={listing.id}
                    className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleListingClick(listing)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xs">
                            {listing.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{listing.user.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="capitalize">{listing.type}</span>
                            <span>•</span>
                            <span>{listing.location}</span>
                            <span>•</span>
                            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                          {listing.userId !== user.id && (
                            <div className="mt-1">
                              {isConnectedTo(listing.userId) ? (
                                <div className="flex items-center text-green-600 text-xs">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  <span>{getMutualFriends(listing.userId).length} mutual friends</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-gray-500 text-xs">
                                  <UserX className="w-3 h-3 mr-1" />
                                  <span>Not Connected • {getMutualFriends(listing.userId).length} mutual friends</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleListingClick(listing);
                          }}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          View More Details
                        </Button>
                        {listing.userId === user.id && (
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditListing(listing);
                              }}
                              className="text-xs px-2 py-1"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteListing(listing.id);
                              }}
                              className="text-xs px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
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

      {/* Profile Update Dialog */}
      <ProfileUpdateDialog
        user={user}
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        onUpdate={onUpdateUser}
        onLogout={onLogout}
      />
    </div>
  );
};

export default CommunityFeed;
