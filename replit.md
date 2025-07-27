# EcoLens - AI-Powered Recycling App

## Overview

EcoLens is a React-based mobile-first application that uses AI to detect recyclable items through camera input and rewards users with green coins for proper recycling. The app features real-time object detection, a reward system, and QR code generation for redeeming earned coins.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphic design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for monorepo setup

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot module replacement with Vite integration

### Mobile-First Design
- **Responsive Design**: Tailwind CSS with mobile breakpoints
- **Camera Integration**: WebRTC getUserMedia API for camera access
- **Touch Optimized**: Custom touch-friendly UI components
- **PWA Ready**: Structured for progressive web app capabilities

## Key Components

### AI Detection System
- **Primary**: Teachable Machine integration for custom model training
- **Fallback**: Clarifai API for general object recognition
- **Processing**: Client-side image capture and base64 encoding
- **Confidence Scoring**: Multi-tier confidence thresholds for accuracy

### Camera System
- **Video Streaming**: Real-time camera feed with WebRTC
- **Image Capture**: Canvas-based image capture and processing
- **Mobile Optimization**: Automatic back camera selection on mobile devices
- **Error Handling**: Graceful camera permission and access error handling

### Reward System
- **Green Coins**: Virtual currency earned through recycling detection
- **Transaction History**: Complete audit trail of earnings and spending
- **QR Code Generation**: Server-side QR code creation for redemption
- **Real-time Updates**: Immediate UI updates with optimistic updates

### Database Schema
- **Users**: Authentication, coin balance, and profile information
- **Detections**: AI detection results with confidence scores and rewards
- **Transactions**: Complete financial history for coins earned and spent

## Data Flow

1. **Camera Capture**: User captures image through camera interface
2. **AI Processing**: Image sent to AI detection service (Teachable Machine/Clarifai)
3. **Results Processing**: Detection results mapped to recyclable categories and rewards
4. **Database Storage**: Detection and transaction records saved to PostgreSQL
5. **UI Updates**: Real-time updates to user balance and transaction history
6. **Reward Redemption**: QR code generation for spending coins at partner locations

## External Dependencies

### AI Services
- **@teachablemachine/image**: Primary AI detection service
- **Clarifai API**: Fallback detection service for broader object recognition

### Database & Storage
- **@neondatabase/serverless**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe database operations and migrations
- **connect-pg-simple**: PostgreSQL session storage

### UI & Styling
- **@radix-ui/***: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management
- **lucide-react**: Icon library

### Development Tools
- **Vite**: Build tool with HMR and optimized bundling
- **ESBuild**: Fast JavaScript bundler for production
- **TypeScript**: Static type checking across the entire stack

## Deployment Strategy

### Replit Deployment (Recommended)
- **One-Click Deploy**: Use Replit's built-in deployment system
- **Automatic SSL**: HTTPS enabled by default
- **Custom Domain**: Optional .replit.app domain or custom domain
- **Zero Configuration**: No additional setup required

### Firebase Hosting (Optional)
- **Static Hosting**: Firebase configuration files included
- **Global CDN**: Fast worldwide content delivery
- **Custom Domains**: Easy domain management
- **Setup**: Use `firebase.json` and `.firebaserc` configuration files

### Build Process
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Database Migrations**: Drizzle Kit manages PostgreSQL schema migrations

### Environment Configuration
- **Firebase**: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`
- **AI Services**: `VITE_TEACHABLE_MACHINE_MODEL_URL`, `VITE_CLARIFAI_API_KEY`
- **Development**: Local development with Vite dev server proxy
- **Production**: Static file serving with Express for SPA routing

### Performance Optimizations
- **Code Splitting**: Vite automatic code splitting for optimal loading
- **Image Optimization**: Client-side image compression before AI processing
- **Caching**: TanStack Query with infinite stale time for optimal UX
- **Bundle Size**: Tree shaking and modern JavaScript targeting

The application uses a monorepo structure with shared TypeScript types and schemas, enabling type safety across the full stack while maintaining clear separation between client and server concerns.

## Recent Changes

### July 27, 2025
- **Firebase Migration**: Successfully migrated from PostgreSQL to Firebase Firestore database
- **Production Firebase**: Set up production-mode Firebase with proper security rules (not test mode)
- **Statistics System**: Added comprehensive stats tracking (detections, coins, item types)
- **Achievement System**: Implemented unlockable achievements for user engagement
- **Stats Dashboard**: Created `/stats` page with detailed analytics and progress tracking
- **Teachable Machine Primary**: Set Teachable Machine as primary AI detection method  
- **Database Schema**: Added stats and achievements collections with full user progress tracking

### January 21, 2025
- **Custom Branding**: Added professional SVG logos throughout the app
- **Enhanced UI**: Replaced Font Awesome icons with custom-designed SVG icons  
- **Visual Identity**: Created consistent EcoLens branding with camera/leaf logo
- **Professional Polish**: Added branded coin icons, camera interface, and navigation icons
- **Firebase Integration**: Configured Firebase project (eco-lens-54294) for future database features
- **Deployment Ready**: Created deployment guides for both Replit and Firebase hosting options