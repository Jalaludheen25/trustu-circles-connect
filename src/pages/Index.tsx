import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import SignIn from '@/components/SignIn';
import ProfileCreation from '@/components/ProfileCreation';
import JoinCommunity from '@/components/JoinCommunity';
import CommunityFeed from '@/components/CommunityFeed';
import AddService from '@/components/AddService';
import SellProduct from '@/components/SellProduct';
import Connections from '@/components/Connections';

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

const generateSampleConnections = (): User[] => {
  return [
    {
      id: 'conn1',
      name: 'Arjun Nair',
      gender: 'Male',
      designation: 'Working Professional',
      homeState: 'Kerala',
      homeDistrict: 'Kottayam',
      currentState: 'Delhi',
      currentDistrict: 'Dwarka',
      phone: '+91 9876543210',
      email: 'arjun.nair@example.com'
    },
    {
      id: 'conn2',
      name: 'Priya Menon',
      gender: 'Female',
      designation: 'Student',
      homeState: 'Kerala',
      homeDistrict: 'Thrissur',
      currentState: 'Delhi',
      currentDistrict: 'South Delhi',
      phone: '+91 9876543211',
      email: 'priya.menon@example.com'
    }
  ];
};

const generateSampleListings = (): Listing[] => {
  const sampleUsers: User[] = [
    {
      id: 'user1',
      name: 'Rahul Krishna',
      gender: 'Male',
      designation: 'Student',
      homeState: 'Kerala',
      homeDistrict: 'Thiruvananthapuram',
      currentState: 'Delhi',
      currentDistrict: 'South Delhi',
      phone: '+91 9876543212',
      email: 'rahul.krishna@example.com'
    },
    {
      id: 'user2',
      name: 'Sneha Pillai',
      gender: 'Female',
      designation: 'Working Professional',
      homeState: 'Kerala',
      homeDistrict: 'Ernakulam',
      currentState: 'Delhi',
      currentDistrict: 'Dwarka',
      phone: '+91 9876543213',
      email: 'sneha.pillai@example.com'
    },
    {
      id: 'user3',
      name: 'Arun Varma',
      gender: 'Male',
      designation: 'Working Professional',
      homeState: 'Kerala',
      homeDistrict: 'Malappuram',
      currentState: 'Delhi',
      currentDistrict: 'Gurgaon',
      phone: '+91 9876543214',
      email: 'arun.varma@example.com'
    },
    {
      id: 'user4',
      name: 'Anjali George',
      gender: 'Female',
      designation: 'Student',
      homeState: 'Kerala',
      homeDistrict: 'Kozhikode',
      currentState: 'Delhi',
      currentDistrict: 'North Delhi',
      phone: '+91 9876543215',
      email: 'anjali.george@example.com'
    },
    {
      id: 'user5',
      name: 'Vishnu Nair',
      gender: 'Male',
      designation: 'Business',
      homeState: 'Kerala',
      homeDistrict: 'Kollam',
      currentState: 'Delhi',
      currentDistrict: 'Central Delhi',
      phone: '+91 9876543216',
      email: 'vishnu.nair@example.com'
    },
    {
      id: 'user6',
      name: 'Maya Thomas',
      gender: 'Female',
      designation: 'Working Professional',
      homeState: 'Kerala',
      homeDistrict: 'Palakkad',
      currentState: 'Delhi',
      currentDistrict: 'East Delhi',
      phone: '+91 9876543217',
      email: 'maya.thomas@example.com'
    }
  ];

  return [
    // Accommodation listings
    {
      id: 'listing1',
      userId: 'user1',
      user: sampleUsers[0],
      type: 'accommodation',
      title: '2BHK Flat for Sharing in Dwarka',
      description: 'Looking for a flatmate to share a spacious 2BHK in Dwarka Sector 12. Fully furnished with all amenities.',
      location: 'Dwarka Sector 12, Delhi',
      contact: '+91 9876543212',
      price: '₹8000/month',
      details: {
        accommodationType: 'Flat (Permanent Stay)',
        availableFor: ['Male Bachelors'],
        maxOccupancy: '2',
        rentPerDay: '',
        rentPerMonth: '8000'
      },
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'listing2',
      userId: 'user2',
      user: sampleUsers[1],
      type: 'accommodation',
      title: 'PG for Female Students near DU',
      description: 'Safe and secure PG accommodation for female students near Delhi University. Home-cooked meals included.',
      location: 'Kamla Nagar, Delhi',
      contact: '+91 9876543213',
      price: '₹6500/month',
      details: {
        accommodationType: 'PG',
        availableFor: ['Female Bachelors'],
        maxOccupancy: '3',
        rentPerDay: '',
        rentPerMonth: '6500'
      },
      createdAt: new Date('2024-01-10')
    },
    // Proxy listings
    {
      id: 'listing3',
      userId: 'user3',
      user: sampleUsers[2],
      type: 'proxy',
      title: 'Tourist Guide Services in Delhi',
      description: 'Experienced guide for Kerala families visiting Delhi. Can help with sightseeing, local transportation, and Malayalam interpretation.',
      location: 'All over Delhi',
      contact: '+91 9876543214',
      price: '',
      details: {
        proxyType: 'Tourist Guide',
        charge: '500',
        serviceDescription: 'Tour guide with Malayalam language support'
      },
      createdAt: new Date('2024-01-12')
    },
    {
      id: 'listing4',
      userId: 'user4',
      user: sampleUsers[3],
      type: 'proxy',
      title: 'Room Search Assistance',
      description: 'Help finding suitable accommodation for new Keralites in Delhi. Know all the best areas and have good connections with landlords.',
      location: 'Delhi NCR',
      contact: '+91 9876543215',
      price: '',
      details: {
        proxyType: 'Room Search Assistance',
        charge: '300',
        serviceDescription: 'Professional room finding service'
      },
      createdAt: new Date('2024-01-08')
    },
    // Product listings
    {
      id: 'listing5',
      userId: 'user5',
      user: sampleUsers[4],
      type: 'product',
      title: 'Engineering Textbooks for Sale',
      description: 'Selling computer science engineering books in excellent condition. Perfect for CSE students.',
      location: 'Lajpat Nagar, Delhi',
      contact: '+91 9876543216',
      price: '₹2500',
      details: {
        itemType: 'Educational Items',
        condition: 'Good',
        description: 'Complete set of CSE textbooks'
      },
      createdAt: new Date('2024-01-14')
    },
    {
      id: 'listing6',
      userId: 'user6',
      user: sampleUsers[5],
      type: 'product',
      title: 'Laptop for Sale - Dell Inspiron',
      description: 'Selling my Dell Inspiron laptop, 8GB RAM, 512GB SSD, excellent for students and professionals.',
      location: 'Karol Bagh, Delhi',
      contact: '+91 9876543217',
      price: '₹35000',
      details: {
        itemType: 'Electronics and Gadgets',
        condition: 'Excellent',
        description: 'Dell Inspiron with warranty'
      },
      createdAt: new Date('2024-01-11')
    }
  ];
};

const generateCommunitySpecificListings = (homeState: string, currentState: string): Listing[] => {
  // Tamil users in Delhi
  if (homeState === 'Tamil Nadu' && currentState === 'Delhi') {
    const tamilUsers: User[] = [
      {
        id: 'tamil1',
        name: 'Karthik Raman',
        gender: 'Male',
        designation: 'Student',
        homeState: 'Tamil Nadu',
        homeDistrict: 'Chennai',
        currentState: 'Delhi',
        currentDistrict: 'South Delhi',
        phone: '+91 9876543218',
        email: 'karthik.raman@example.com'
      },
      {
        id: 'tamil2',
        name: 'Priya Shankar',
        gender: 'Female',
        designation: 'Working Professional',
        homeState: 'Tamil Nadu',
        homeDistrict: 'Coimbatore',
        currentState: 'Delhi',
        currentDistrict: 'Gurgaon',
        phone: '+91 9876543219',
        email: 'priya.shankar@example.com'
      },
      {
        id: 'tamil3',
        name: 'Rajesh Kumar',
        gender: 'Male',
        designation: 'Business',
        homeState: 'Tamil Nadu',
        homeDistrict: 'Madurai',
        currentState: 'Delhi',
        currentDistrict: 'Central Delhi',
        phone: '+91 9876543220',
        email: 'rajesh.kumar@example.com'
      }
    ];

    return [
      {
        id: 'tamil_listing1',
        userId: 'tamil1',
        user: tamilUsers[0],
        type: 'accommodation',
        title: 'Shared Room for Tamil Students',
        description: 'Looking for Tamil speaking flatmate. South Indian food available nearby.',
        location: 'Lajpat Nagar, Delhi',
        contact: '+91 9876543218',
        price: '₹7000/month',
        details: {
          accommodationType: 'PG',
          availableFor: ['Male Bachelors'],
          maxOccupancy: '2',
          rentPerDay: '',
          rentPerMonth: '7000'
        },
        createdAt: new Date('2024-01-20')
      },
      {
        id: 'tamil_listing2',
        userId: 'tamil2',
        user: tamilUsers[1],
        type: 'proxy',
        title: 'Tamil Translation Services',
        description: 'Professional Tamil-Hindi translation for documents and legal work.',
        location: 'All over Delhi',
        contact: '+91 9876543219',
        price: '',
        details: {
          proxyType: 'Tourist Guide',
          charge: '400',
          serviceDescription: 'Tamil language translation services'
        },
        createdAt: new Date('2024-01-18')
      },
      {
        id: 'tamil_listing3',
        userId: 'tamil3',
        user: tamilUsers[2],
        type: 'product',
        title: 'Traditional Tamil Books',
        description: 'Collection of classic Tamil literature and modern novels.',
        location: 'Karol Bagh, Delhi',
        contact: '+91 9876543220',
        price: '₹1500',
        details: {
          itemType: 'Educational Items',
          condition: 'Good',
          description: 'Tamil literature collection'
        },
        createdAt: new Date('2024-01-16')
      }
    ];
  }

  // Local Delhi users
  if (homeState === 'Delhi' && currentState === 'Delhi') {
    const delhiUsers: User[] = [
      {
        id: 'delhi1',
        name: 'Rohit Sharma',
        gender: 'Male',
        designation: 'Working Professional',
        homeState: 'Delhi',
        homeDistrict: 'Central Delhi',
        currentState: 'Delhi',
        currentDistrict: 'Central Delhi',
        phone: '+91 9876543221',
        email: 'rohit.sharma@example.com'
      },
      {
        id: 'delhi2',
        name: 'Anusha Singh',
        gender: 'Female',
        designation: 'Student',
        homeState: 'Delhi',
        homeDistrict: 'South Delhi',
        currentState: 'Delhi',
        currentDistrict: 'South Delhi',
        phone: '+91 9876543222',
        email: 'anusha.singh@example.com'
      }
    ];

    return [
      {
        id: 'delhi_listing1',
        userId: 'delhi1',
        user: delhiUsers[0],
        type: 'accommodation',
        title: 'Premium Apartment in CP',
        description: 'Luxury apartment in Connaught Place, perfect for professionals.',
        location: 'Connaught Place, Delhi',
        contact: '+91 9876543221',
        price: '₹15000/month',
        details: {
          accommodationType: 'Flat (Permanent Stay)',
          availableFor: ['Anyone'],
          maxOccupancy: '1',
          rentPerDay: '',
          rentPerMonth: '15000'
        },
        createdAt: new Date('2024-01-22')
      },
      {
        id: 'delhi_listing2',
        userId: 'delhi2',
        user: delhiUsers[1],
        type: 'product',
        title: 'Designer Clothes Sale',
        description: 'Branded clothes in excellent condition. Perfect for college students.',
        location: 'Khan Market, Delhi',
        contact: '+91 9876543222',
        price: '₹3000',
        details: {
          itemType: 'Clothing and Accessories',
          condition: 'Excellent',
          description: 'Designer clothing collection'
        },
        createdAt: new Date('2024-01-19')
      }
    ];
  }

  return [];
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
      const existingListings = JSON.parse(savedListings);
      const sampleListings = generateSampleListings();
      
      console.log('Existing listings:', existingListings);
      console.log('Sample listings:', sampleListings);
      
      // Check if sample listings are already added (by checking for a specific sample ID)
      const hasSampleListings = existingListings.some((listing: Listing) => listing.id === 'listing1');
      
      console.log('Has sample listings:', hasSampleListings);
      
      if (!hasSampleListings) {
        // Add sample listings from different communities
        const keralaSampleListings = generateSampleListings();
        const tamilSampleListings = generateCommunitySpecificListings('Tamil Nadu', 'Delhi');
        const delhiSampleListings = generateCommunitySpecificListings('Delhi', 'Delhi');
        
        const allSampleListings = [...keralaSampleListings, ...tamilSampleListings, ...delhiSampleListings];
        const combinedListings = [...existingListings, ...allSampleListings];
        
        console.log('Combined listings:', combinedListings);
        setListings(combinedListings);
        localStorage.setItem('trustu_listings', JSON.stringify(combinedListings));
      } else {
        setListings(existingListings);
      }
    } else {
      // Add sample listings from different communities
      const keralaSampleListings = generateSampleListings();
      const tamilSampleListings = generateCommunitySpecificListings('Tamil Nadu', 'Delhi');
      const delhiSampleListings = generateCommunitySpecificListings('Delhi', 'Delhi');
      
      const allSampleListings = [...keralaSampleListings, ...tamilSampleListings, ...delhiSampleListings];
      console.log('Setting sample listings:', allSampleListings);
      setListings(allSampleListings);
    }
    
    if (savedConnections) {
      const existingConnections = JSON.parse(savedConnections);
      const sampleConnections = generateSampleConnections();
      
      // Check if sample connections are already added
      const hasSampleConnections = existingConnections.some((conn: User) => conn.id === 'conn1');
      
      if (!hasSampleConnections) {
        // Add sample connections to existing ones
        const combinedConnections = [...existingConnections, ...sampleConnections];
        setConnections(combinedConnections);
        localStorage.setItem('trustu_connections', JSON.stringify(combinedConnections));
      } else {
        setConnections(existingConnections);
      }
    } else {
      // Add sample connections
      const sampleConnections = generateSampleConnections();
      setConnections(sampleConnections);
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
    const updatedUser = { ...user, ...profileData } as User;
    setUser(updatedUser);
    
    // Only go to join-community if user doesn't have location data yet
    if (!updatedUser.currentState) {
      setCurrentStep('join-community');
    } else {
      // If user already has location data, go back to feed
      setCurrentStep('feed');
    }
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
            onComplete={handleProfileCreation}
            user={user}
            isEditing={!!user && currentStep === 'profile'}
            onUpdateUser={setUser}
            onBack={() => setCurrentStep('feed')}
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
