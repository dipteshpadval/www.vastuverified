# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
PropertyHub is a comprehensive React-based real estate platform that combines features from major property websites like 99acres, Magicbricks, and Housing.com. It's built with React 18 + TypeScript frontend and an Express.js backend with MongoDB, supporting both Firebase and traditional API architectures.

## Development Commands

### Frontend Development
```bash

# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
npm run lint:fix
```

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start backend server (development mode with nodemon)
npm run dev

# Start production server
npm start

# Backend runs on port 3001 by default
```

### Running Full Stack
Start both frontend and backend simultaneously:
1. Terminal 1: `cd backend && npm run dev`
2. Terminal 2: `npm run dev`

### Testing
Currently no test suite is configured. To add tests:
- Consider Jest + React Testing Library for frontend
- Jest + Supertest for backend API testing

## Architecture Overview

### Frontend Architecture
The frontend follows a Context + useReducer pattern for state management with these key contexts:
- **AuthContext** (`src/context/AuthContext.tsx`): User authentication, profile management
- **PropertyContext** (`src/context/PropertyContext.tsx`): Property data, search filters, favorites

### Component Structure
```
src/components/
├── auth/           # Login, Register components
├── common/         # Reusable components (ErrorBoundary, SEO, etc.)
├── forms/          # Form components (Contact, Newsletter, Property listing)
├── layout/         # Navbar, Footer
├── pages/          # Page-level components (Dashboard, PropertyDetails, etc.)
└── sections/       # Homepage sections (Hero, FeaturedProperties, etc.)
```

### State Management Pattern
- Uses React Context + useReducer instead of Redux
- **PropertyContext**: Manages properties array, search filters, favorites
- **AuthContext**: Manages user state, login/logout, profile updates
- Local storage used for persistence of auth tokens and user data

### API Architecture
The application supports dual backend modes:
1. **Firebase Mode**: Direct Firebase Auth + Firestore integration
2. **API Mode**: Traditional REST API with Express.js backend

This is controlled by the `VITE_API_BASE_URL` environment variable. If not set, it defaults to Firebase mode.

### Key Services
- `src/services/firebaseAuth.ts`: Firebase authentication wrapper
- `src/services/firebaseProperties.ts`: Firebase Firestore operations
- `src/utils/apiClient.ts`: HTTP client with automatic fallback to Firebase

## Environment Setup

### Required Environment Variables
Copy `env.example` to `.env` and configure:

**Firebase Configuration (if using Firebase):**
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

**API Configuration (if using backend API):**
```
VITE_API_BASE_URL=http://localhost:3001/api
```

**Backend Environment:**
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

## Deployment

The project includes multiple deployment configurations:

### Hostinger Deployment
- `deploy-to-hostinger.sh` / `deploy-to-hostinger.bat`: Direct deployment scripts
- `npm run deploy:hostinger`: Build and deploy to Hostinger via SCP

### Other Platforms
- **Railway**: `railway.json` configuration
- **Vercel**: `vercel.json` configuration
- **Render**: `render.yaml` configuration

### Build Process
The build outputs to `dist/` directory and includes:
- Static assets optimization
- TypeScript compilation
- Tailwind CSS purging
- Source maps disabled for production

## Key Features Implementation

### Property Search & Filtering
- Complex filtering logic in `PropertyContext.tsx`
- Supports location, price range, property type, bedrooms, amenities
- Real-time filtering with useReducer state updates

### Authentication System
- Dual mode: Firebase Auth or JWT-based API
- Role-based access (user/agent/admin)
- Protected routes via `ProtectedRoute` component
- Persistent login via localStorage

### Property Management
- CRUD operations for properties
- Image upload support
- Property validation and sanitization
- Owner/Agent relationship modeling

## Development Guidelines

### TypeScript Usage
- Strict TypeScript configuration enabled
- All components should use proper TypeScript interfaces
- API responses have typed interfaces in `apiClient.ts`

### Styling Approach
- Tailwind CSS for styling with custom configuration
- Responsive design mobile-first
- Framer Motion for animations
- Lucide React for icons

### Error Handling
- Global ErrorBoundary component wraps the entire app
- API client includes comprehensive error handling
- React Hot Toast for user notifications

### Performance Considerations
- Lazy loading not implemented but recommended for route-level code splitting
- Images should be optimized before upload
- Consider implementing React Query for better caching

## Database Models

### Property Schema (MongoDB/Firestore)
Key fields: id, title, description, price, location, propertyType, transactionType, owner, amenities, features, images

### User Schema
Key fields: id, name, email, role, preferences, verified status

## Common Development Tasks

### Adding a New Page
1. Create component in `src/components/pages/`
2. Add route in `App.tsx`
3. Update Navbar if needed
4. Add SEO component for meta tags

### Adding New Property Fields
1. Update Property interface in `PropertyContext.tsx`
2. Modify property forms in `src/components/forms/`
3. Update backend models if using API mode
4. Update filtering logic in property reducer

### Modifying Search Filters
1. Update SearchFilters interface in `PropertyContext.tsx`
2. Modify filter logic in `FILTER_PROPERTIES` reducer case
3. Update search UI components

### API Integration
- API client automatically handles Firebase fallback
- To add new endpoints, extend `apiClient.ts`
- Ensure error handling for both API and Firebase modes

## Security Considerations
- Input validation and sanitization implemented in auth context
- Rate limiting configured for API endpoints
- CORS properly configured
- Helmet.js for security headers
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
