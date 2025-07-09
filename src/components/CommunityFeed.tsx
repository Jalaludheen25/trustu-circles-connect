
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Filter, User as UserIcon, Plus, Search, Phone, MessageCircle, MapPin, Users } from 'lucide-react';
import { User, Community, Listing } from '@/pages/Index';
import CommunityFilter from './CommunityFilter';

interface CommunityFeedProps {
  user: User;
  community: Community;
  listings: Listing[];
  onNavigate: (step: string) => void;
  appliedFilter?: string;
  onFilterApplied?: (filter: string) => void;
}

const CommunityFeed = ({ user, community, listings, onNavigate, appliedFilter, onFilterApplied }: CommunityFeedProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchTerm || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'accommodation' && listing.type === 'accommodation') ||
      (activeTab === 'proxy' && listing.type === 'proxy') ||
      (activeTab === 'buy-sell' && listing.type === 'product');
    
    return matchesSearch && matchesTab;
  });

  const handleContact = (contact: string) => {
    // In a real app, this would open WhatsApp or initiate a call
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

  const displayCommunityName = appliedFilter || community.name;

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
                {appliedFilter && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Filtered View
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
                <span>Profile</span>
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
        </div>
      </div>

      {/* Listings Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No listings found in your community yet.</p>
              <p className="text-sm text-gray-400">Be the first to add a service or product!</p>
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

      {/* Floating Action Buttons */}
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

      {/* Community Filter Modal */}
      {showFilter && (
        <CommunityFilter
          user={user}
          onClose={() => setShowFilter(false)}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default CommunityFeed;
