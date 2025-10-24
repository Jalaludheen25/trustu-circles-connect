# TrustU - Community-Based Service Platform

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [User Flows](#user-flows)
7. [Data Models](#data-models)
8. [Component Architecture](#component-architecture)
9. [State Management](#state-management)
10. [API Integration Guide](#api-integration-guide)

---

## Overview

TrustU is a community-based service platform that connects people from the same geographical and cultural background. The platform enables users to find trusted services, accommodations, and products within their community circles, eliminating interactions with strangers.

**Core Concept**: Users are grouped into communities based on their home state and current location (e.g., "Keralites in Delhi"), creating trusted networks for service exchange.

**Target Users**: 
- Students studying away from home
- Working professionals in new cities
- People seeking community-specific services
- Anyone looking for trusted connections in their area

---

## Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.1** - Build tool and dev server

### UI & Styling
- **Tailwind CSS 3.4.11** - Utility-first CSS
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **tailwind-merge** - Conditional class merging

### Routing & State
- **React Router DOM 6.26.2** - Client-side routing
- **TanStack Query 5.56.2** - Server state management (ready for API integration)
- **React Hook Form 7.53.0** - Form handling
- **Zod 3.23.8** - Schema validation

### Additional Libraries
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications
- **next-themes** - Theme management
- **Recharts** - Data visualization (for future analytics)

---

## Features

### 1. Authentication System
- **Multi-method Sign In**: Phone number or email
- **OTP Verification**: 6-digit OTP (demo mode uses `123456`)
- **Session Persistence**: User data stored in localStorage
- **Auto-login**: Returning users automatically signed in

### 2. Profile Management
**Required Fields**:
- Full name
- Gender (Male/Female)
- Designation (Student/Working Professional/Business/Freelancer/Other)

**Optional Fields**:
- Phone number
- Email address
- Institute/College name
- Company name
- Bio
- Interests

**Features**:
- Profile editing
- Profile locking option
- Profile deletion with data cleanup

### 3. Community System

**Community Formation**:
Communities are automatically generated based on:
- Home State + Current State → "Keralites in Delhi"
- Home District + Current Location → "Malappuram - Delhi"
- Institution-based → "Keralites in Jamia"

**Community Features**:
- View community member count
- See connection statistics (direct connections, mutual connections)
- Visit other communities
- Filter by community attributes

**Sample Communities**:
- Keralites in Delhi (50 members)
- Tamilians in Delhi (28 members)
- Delhites in Delhi (85 members)
- Keralites in Jamia (25 members)

### 4. Listing Types

#### A. Accommodation Listings
**Types**:
- Flat (Permanent Stay)
- Flat (Temporary Stay)
- PG (Paying Guest)
- Hostel
- Hotel

**Details**:
- Accommodation type
- Available for (Male Bachelors/Female Bachelors/Families/Anyone)
- Max occupancy (1-10)
- Rent per day
- Rent per month
- Location
- Description
- Contact information

**Filters**:
- Accommodation type
- Availability
- Max occupancy
- Rent range (daily/monthly)

#### B. Proxy Services
**Service Types**:
- Academic/Admission Related Assistance
- Accommodation Assistance
- General Errands/Office Work
- Trusted Carry
- Travel Guide

**Details**:
- Service type
- Location
- Date (if applicable)
- Charge
- Service description
- Contact information

**Filters**:
- Service type
- Charge range (₹100-300, ₹400-600, ₹700-1000, ₹1000+)
- Location
- Date

#### C. Product Listings
**Item Types**:
- Educational Items
- Electronics and Gadgets
- Home & Kitchen Items
- Vehicle
- Clothing and Accessories
- Other

**Details**:
- Item type
- Condition (Excellent/Good/Fair)
- Price
- Location
- Description
- Contact information

**Filters**:
- Item type
- Price range (₹100-500, ₹500-1000, ₹1000-2000, ₹2000-5000, ₹5000+)
- Location
- Item details (search)

### 5. Connections System
- **Add Connections**: Connect with community members
- **Remove Connections**: Disconnect from users
- **View Mutual Connections**: See shared connections
- **Connection Indicators**: Visual badges showing connection status
- **Connection-based Filtering**: Filter listings by connection type

### 6. Community Feed
- **Tab Navigation**: Switch between Accommodation, Proxy, and Product listings
- **Advanced Filtering**: Type-specific filters for each listing category
- **Listing Cards**: Preview with key information
- **Detailed View**: Full listing details with user information
- **CRUD Operations**: Create, Read, Update, Delete own listings
- **Community Switching**: Visit and explore other communities

---

## Project Structure

```
vite_react_shadcn_ts/
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (other UI components)
│   │   │
│   │   ├── LandingPage.tsx      # Welcome/intro screen
│   │   ├── SignIn.tsx           # Authentication component
│   │   ├── ProfileCreation.tsx  # User profile form
│   │   ├── JoinCommunity.tsx    # Community selection
│   │   ├── CommunityFeed.tsx    # Main feed with listings
│   │   ├── AddService.tsx       # Add accommodation/proxy
│   │   ├── SellProduct.tsx      # Add product listing
│   │   ├── Connections.tsx      # Manage connections
│   │   ├── CommunityFilter.tsx  # Community filtering
│   │   └── ProfileUpdateDialog.tsx # Profile editing modal
│   │
│   ├── pages/
│   │   ├── Index.tsx            # Main app container & state
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── hooks/
│   │   └── use-toast.ts         # Toast notification hook
│   │
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   │
│   ├── App.tsx                  # App wrapper with providers
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── components.json              # shadcn/ui config
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- Git

### Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd vite_react_shadcn_ts

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Environment Setup
Currently, the app runs in demo mode with no environment variables required. For production:

```env
# .env.local (create this file)
VITE_API_BASE_URL=your_api_url
VITE_OTP_SERVICE_KEY=your_otp_service_key
```

---

## User Flows

### 1. New User Registration Flow
```
Landing Page
    ↓ (Click "Get Started")
Sign In Page
    ↓ (Enter phone/email → Send OTP)
OTP Verification
    ↓ (Enter OTP → Verify)
Profile Creation
    ↓ (Fill profile details)
Join Community
    ↓ (Select home state & institution)
Community Feed
```

### 2. Returning User Flow
```
Landing Page
    ↓ (Auto-detect localStorage)
Community Feed (Auto-login)
```

### 3. Add Listing Flow
```
Community Feed
    ↓ (Click "Add Service" or "Sell Product")
Listing Form
    ↓ (Fill details)
Community Feed (Updated with new listing)
```

### 4. Edit Listing Flow
```
Community Feed
    ↓ (Click listing → Click "Edit")
Listing Form (Pre-filled)
    ↓ (Update details)
Community Feed (Updated listing)
```

### 5. Visit Community Flow
```
Community Feed
    ↓ (Click community filter icon)
Community Filter Dialog
    ↓ (Select different community)
Community Feed (Filtered view)
    ↓ (Click "Back to My Community")
Community Feed (Original view)
```

---

## Data Models

### User Type
```typescript
type User = {
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
  contact?: string;
  institution?: string;
  isProfileLocked?: boolean;
  institute?: string;
  company?: string;
  bio?: string;
  interests?: string;
};
```

### Community Type
```typescript
type Community = {
  id: string;
  name: string;
  members: User[];
};
```

### Listing Type
```typescript
type Listing = {
  id: string;
  userId: string;
  user: User;
  type: 'accommodation' | 'proxy' | 'product';
  title: string;
  description: string;
  location: string;
  contact: string;
  price?: string;
  details: any; // Type-specific details
  createdAt: Date;
};
```

### Accommodation Details
```typescript
{
  accommodationType: string;
  availableFor: string[];
  maxOccupancy: string;
  rentPerDay: string;
  rentPerMonth: string;
}
```

### Proxy Service Details
```typescript
{
  proxyType: string;
  location: string;
  date: string;
  charge: string;
  serviceDescription: string;
}
```

### Product Details
```typescript
{
  itemType: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  description: string;
}
```

---

## Component Architecture

### Component Hierarchy
```
App
├── BrowserRouter
│   └── Routes
│       ├── Index (Main Container)
│       │   ├── LandingPage
│       │   ├── SignIn
│       │   ├── ProfileCreation
│       │   ├── JoinCommunity
│       │   ├── CommunityFeed
│       │   │   ├── CommunityFilter
│       │   │   ├── ProfileUpdateDialog
│       │   │   └── Listing Cards
│       │   ├── AddService
│       │   ├── SellProduct
│       │   └── Connections
│       └── NotFound
└── Providers
    ├── QueryClientProvider
    ├── TooltipProvider
    ├── Toaster
    └── Sonner
```

### Key Components

#### Index.tsx (Main Container)
- **Purpose**: Central state management and routing logic
- **State**: User, community, listings, connections
- **Responsibilities**:
  - Manage application state
  - Handle localStorage persistence
  - Route between different views
  - Generate sample data
  - Community name generation

#### CommunityFeed.tsx
- **Purpose**: Main feed displaying listings
- **Features**:
  - Tab-based navigation
  - Advanced filtering
  - Listing CRUD operations
  - Community switching
  - Connection management

#### SignIn.tsx
- **Purpose**: User authentication
- **Features**:
  - Phone/email input
  - OTP sending and verification
  - Tab switching between methods

#### ProfileCreation.tsx
- **Purpose**: User profile management
- **Features**:
  - Profile creation
  - Profile editing
  - Form validation

---

## State Management

### Local State (useState)
- Component-specific UI state
- Form inputs
- Dialog visibility
- Filter selections

### Persistent State (localStorage)
```javascript
// Keys used
'trustu_user'        // User profile data
'trustu_listings'    // All listings
'trustu_connections' // User connections
```

### State Flow
```
Index.tsx (Parent)
    ↓ Props
Child Components
    ↓ Callbacks
Index.tsx (State Update)
    ↓ useEffect
localStorage (Persist)
```

---

## API Integration Guide

### Current Implementation
The app currently uses localStorage for data persistence. To integrate with a backend API:

### 1. Authentication API

```typescript
// src/services/auth.ts
export const authService = {
  sendOTP: async (contact: string, type: 'phone' | 'email') => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, type })
    });
    return response.json();
  },
  
  verifyOTP: async (contact: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, otp })
    });
    return response.json();
  }
};
```

### 2. User API

```typescript
// src/services/user.ts
export const userService = {
  createProfile: async (userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  updateProfile: async (userId: string, userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  getProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};
```

### 3. Listings API

```typescript
// src/services/listings.ts
export const listingsService = {
  getListings: async (filters?: any) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/listings?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  
  createListing: async (listingData: Omit<Listing, 'id' | 'createdAt'>) => {
    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listingData)
    });
    return response.json();
  },
  
  updateListing: async (listingId: string, listingData: Partial<Listing>) => {
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listingData)
    });
    return response.json();
  },
  
  deleteListing: async (listingId: string) => {
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};
```

### 4. Connections API

```typescript
// src/services/connections.ts
export const connectionsService = {
  getConnections: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/connections`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  
  addConnection: async (userId: string, connectionId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/connections`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ connectionId })
    });
    return response.json();
  },
  
  removeConnection: async (userId: string, connectionId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/connections/${connectionId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};
```

### 5. Using TanStack Query

```typescript
// src/hooks/useListings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingsService } from '@/services/listings';

export const useListings = (filters?: any) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingsService.getListings(filters)
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: listingsService.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    }
  });
};
```

---

## Future Enhancements

### Phase 1: Core Features
- [ ] Real backend API integration
- [ ] User authentication with JWT
- [ ] Real-time notifications
- [ ] Image upload for listings
- [ ] Chat/messaging system

### Phase 2: Advanced Features
- [ ] Rating and review system
- [ ] Payment integration
- [ ] Advanced search with Elasticsearch
- [ ] Mobile app (React Native)
- [ ] Push notifications

### Phase 3: Community Features
- [ ] Community events
- [ ] Discussion forums
- [ ] Community moderators
- [ ] Verified badges
- [ ] Analytics dashboard

---

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Write meaningful commit messages

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is part of a Lovable.dev project. See the README.md for more details.

---

## Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

---

**Last Updated**: October 2024
**Version**: 0.0.0
**Status**: Demo/Development
