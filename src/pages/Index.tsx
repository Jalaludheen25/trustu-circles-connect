import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import SignIn from '@/components/SignIn';
import ProfileCreation from '@/components/ProfileCreation';
import JoinCommunity from '@/components/JoinCommunity';
import CommunityFeed from '@/components/CommunityFeed';
import AddService from '@/components/AddService';
import SellProduct from '@/components/SellProduct';
import Connections from '@/components/Connections';
import CommunityMembers from '@/components/CommunityMembers';

export type User = {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  designation: 'Student' | 'Working Professional' | 'Business' | 'Freelancer' | 'Other';
  homeState: string;
  homeDistrict: string;
  currentState: string;
  currentDistrict: string;
  phone?: string;
  email?: string;
  isProfileLocked?: boolean;
  institute?: string;
  company?: string;
  bio?: string;
  interests?: string;
};

export type Community = {
  id: string;
  name: string;
  members: User[];
};

export type Listing = {
  id: string;
  userId: string;
  user: User;
  type: 'accommodation' | 'proxy' | 'product';
  title: string;
  description: string;
  location: string;
  contact: string;
  price?: string;
  details: any;
  createdAt: Date;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [connections, setConnections] = useState<User[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<string>('');
  const [isVisitingCommunity, setIsVisitingCommunity] = useState(false);
  const [visitingCommunityData, setVisitingCommunityData] = useState<{
    homeState: string;
    homeDistrict: string;
    currentState: string;
    currentDistrict: string;
  } | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('trustu_user');
    const savedListings = localStorage.getItem('trustu_listings');
    const savedConnections = localStorage.getItem('trustu_connections');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (userData.currentState) {
        setCurrentStep('feed');
        // Generate community based on user data
        const communityName = generateCommunityName(userData);
        setCommunity({ id: '1', name: communityName, members: [userData] });
      } else {
        setCurrentStep('join-community');
      }
    }
    
    if (savedListings) {
      setListings(JSON.parse(savedListings));
    }
    
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('trustu_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('trustu_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('trustu_connections', JSON.stringify(connections));
  }, [connections]);

  const generateCommunityName = (userData: User) => {
    if (userData.homeState === userData.currentState) {
      return userData.homeState;
    }
    
    const homeStateMap: { [key: string]: string } = {
      'Kerala': 'Keralites',
      'Tamil Nadu': 'Tamilians',
      'Delhi': 'Delhites'
    };
    
    const homePeople = homeStateMap[userData.homeState] || userData.homeState;
    return `${homePeople} in ${userData.currentState}`;
  };

  const generateVisitingCommunityName = (homeState: string, currentState: string) => {
    if (homeState === currentState) {
      return homeState;
    }
    
    const homeStateMap: { [key: string]: string } = {
      'Kerala': 'Keralites',
      'Tamil Nadu': 'Tamilians',
      'Delhi': 'Delhites'
    };
    
    const homePeople = homeStateMap[homeState] || homeState;
    return `${homePeople} in ${currentState}`;
  };

  const handleSignIn = (userData: Partial<User>) => {
    if (userData.name) {
      setCurrentStep('join-community');
    } else {
      setCurrentStep('profile');
    }
    setUser(prev => ({ ...prev, ...userData } as User));
  };

  const handleProfileCreation = (profileData: { 
    name: string; 
    gender: 'Male' | 'Female'; 
    designation: 'Student' | 'Working Professional' | 'Business' | 'Freelancer' | 'Other';
    isProfileLocked?: boolean;
    institute?: string;
    company?: string;
    bio?: string;
    phone?: string;
    email?: string;
    interests?: string;
  }) => {
    setUser(prev => ({ ...prev, ...profileData } as User));
    setCurrentStep('join-community');
  };

  const handleJoinCommunity = (communityData: Partial<User>) => {
    const updatedUser = { ...user, ...communityData } as User;
    setUser(updatedUser);
    
    const communityName = generateCommunityName(updatedUser);
    setCommunity({ id: '1', name: communityName, members: [updatedUser] });
    
    setCurrentStep('feed');
  };

  const handleAddListing = (listing: Omit<Listing, 'id' | 'userId' | 'user' | 'createdAt'>) => {
    if (!user) return;
    
    if (editingListing) {
      // Update existing listing
      const updatedListing: Listing = {
        ...editingListing,
        ...listing,
        user: user
      };
      
      setListings(prev => prev.map(l => l.id === editingListing.id ? updatedListing : l));
      setEditingListing(null);
    } else {
      // Create new listing
      const newListing: Listing = {
        ...listing,
        id: Date.now().toString(),
        userId: user.id,
        user: user,
        createdAt: new Date()
      };
      
      setListings(prev => [newListing, ...prev]);
    }
    
    setCurrentStep('feed');
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    if (listing.type === 'product') {
      setCurrentStep('sell-product');
    } else {
      setCurrentStep('add-service');
    }
  };

  const handleEditProfile = () => {
    setCurrentStep('profile');
  };

  const handleDeleteListing = (listingId: string) => {
    setListings(prev => prev.filter(listing => listing.id !== listingId));
  };

  const handleDeleteProfile = () => {
    // Clear all data and return to landing page
    localStorage.removeItem('trustu_user');
    localStorage.removeItem('trustu_listings');
    localStorage.removeItem('trustu_connections');
    setUser(null);
    setCommunity(null);
    setListings([]);
    setConnections([]);
    setCurrentStep('landing');
  };

  const handleAddConnection = (newConnection: User) => {
    setConnections(prev => [...prev, newConnection]);
  };

  const handleRemoveConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  const handleFilterApplied = (filter: string) => {
    setAppliedFilter(filter);
  };

  const handleVisitCommunity = (homeState: string, homeDistrict: string, currentState: string, currentDistrict: string) => {
    setVisitingCommunityData({ homeState, homeDistrict, currentState, currentDistrict });
    setIsVisitingCommunity(true);
    setAppliedFilter('');
  };

  const handleBackToMyCommunity = () => {
    setIsVisitingCommunity(false);
    setVisitingCommunityData(null);
    setAppliedFilter('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage onContinue={() => setCurrentStep('signin')} />;
      case 'signin':
        return <SignIn onSignIn={handleSignIn} />;
      case 'profile':
        return (
          <ProfileCreation 
            onComplete={editingListing ? () => setCurrentStep('feed') : handleProfileCreation}
            user={user}
            isEditing={!!user && currentStep === 'profile'}
            onUpdateUser={setUser}
          />
        );
      case 'join-community':
        return <JoinCommunity onComplete={handleJoinCommunity} user={user} />;
      case 'feed':
        const visitingCommunityName = visitingCommunityData 
          ? generateVisitingCommunityName(visitingCommunityData.homeState, visitingCommunityData.currentState)
          : '';
        
        return (
          <CommunityFeed
            user={user!}
            community={community!}
            listings={listings}
            onNavigate={setCurrentStep}
            appliedFilter={appliedFilter}
            onFilterApplied={handleFilterApplied}
            isVisiting={isVisitingCommunity}
            visitingCommunityName={visitingCommunityName}
            onBackToMyCommunity={handleBackToMyCommunity}
            onVisitCommunity={handleVisitCommunity}
            onDeleteListing={handleDeleteListing}
            onEditListing={handleEditListing}
            connections={connections}
          />
        );
      case 'add-service':
        return (
          <AddService
            user={user!}
            onComplete={handleAddListing}
            onBack={() => setCurrentStep('feed')}
            existingListing={editingListing}
            isEditing={!!editingListing}
          />
        );
      case 'sell-product':
        return (
          <SellProduct
            user={user!}
            onComplete={handleAddListing}
            onBack={() => setCurrentStep('feed')}
            existingListing={editingListing}
            isEditing={!!editingListing}
          />
        );
      case 'connections':
        return (
          <Connections
            user={user!}
            community={community!}
            connections={connections}
            onAddConnection={handleAddConnection}
            onRemoveConnection={handleRemoveConnection}
            onBack={() => setCurrentStep('feed')}
            appliedFilter={appliedFilter}
            isVisiting={isVisitingCommunity}
            visitingCommunityName={visitingCommunityData 
              ? generateVisitingCommunityName(visitingCommunityData.homeState, visitingCommunityData.currentState)
              : ''}
            onDeleteProfile={handleDeleteProfile}
            onEditProfile={handleEditProfile}
          />
        );
      case 'community-members':
        return (
          <CommunityMembers
            user={user!}
            community={community!}
            connections={connections}
            onAddConnection={handleAddConnection}
            onRemoveConnection={handleRemoveConnection}
            onBack={() => setCurrentStep('feed')}
            appliedFilter={appliedFilter}
            isVisiting={isVisitingCommunity}
            visitingCommunityName={visitingCommunityData 
              ? generateVisitingCommunityName(visitingCommunityData.homeState, visitingCommunityData.currentState)
              : ''}
            onDeleteProfile={handleDeleteProfile}
            onEditProfile={handleEditProfile}
          />
        );
      default:
        return <LandingPage onContinue={() => setCurrentStep('signin')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {renderCurrentStep()}
    </div>
  );
};

export default Index;
