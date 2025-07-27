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

### July 27, 2025 - Latest Update
- **Comprehensive Personalization & Analytics System**: Fully implemented advanced analytics dashboard with:
  - Personal Impact Dashboard showing real-time environmental metrics (CO₂, water, energy, trees saved)
  - Custom Goals system with progress tracking, completion status, and goal management
  - Smart Reminders that automatically adapt to user recycling habits
  - Habit Analytics with streak tracking, weekly patterns, and favorite recycling times
  - Complete analytics API with full CRUD operations and PostgreSQL database integration
  - New Analytics tab in bottom navigation for easy access
- **Enhanced UI/UX**: Complete redesign with glassmorphic effects, smooth animations, and premium mobile interface
- **Clean Camera Interface**: Removed live detection for streamlined user experience with professional viewfinder
- **Enhanced Animations**: Added smooth slide-in transitions, confetti effects, and floating animations throughout
- **Mobile Optimization**: Improved touch-friendly controls, responsive layouts, and enhanced bottom navigation
- **Professional Design**: Upgraded glassmorphic cards with depth, hover effects, and modern visual hierarchy
- **PostgreSQL Database**: Migrated back to PostgreSQL from Firebase due to permission issues
- **Statistics System**: Added comprehensive stats tracking (detections, coins, item types)
- **Achievement System**: Implemented unlockable achievements for user engagement
- **Profile System**: Replaced Awards section with comprehensive Profile page including login placeholders and user management
- **4K Display Support**: Added complete 4K and 8K display optimizations with enhanced scaling, typography, and visual effects
- **Detection System Fixes**: Resolved rapid API calls, proper coin rewards, and database storage issues
- **Premium Component Library**: Created comprehensive enhanced UI components including buttons, cards, notifications, and loading states
- **Advanced Achievement System**: Implemented dynamic achievement tracking with rarity levels, progress tracking, and reward systems
- **Performance Optimization**: Added hardware acceleration, smooth scrolling, accessibility support, and high contrast mode
- **Enhanced Notification System**: Integrated toast notifications with multiple types and animations throughout the app
- **Responsive Excellence**: Complete responsive design from mobile to 8K displays with proper scaling and typography
- **Advanced Animation System**: Created comprehensive animation library with fade-in, slide-in, scale, pulse glow, floating, shimmer, and count-up effects
- **Interactive Dashboard**: Built enhanced dashboard with animated statistics, progress tracking, and real-time data visualization
- **Confetti Celebrations**: Added success confetti system for achievement unlocks and milestone celebrations  
- **Progress Visualization**: Implemented circular and linear progress bars with multiple variants and animations
- **Enhanced Results System**: Upgraded detection results with animations, confetti effects, and premium visual feedback
- **Stats Widgets**: Created reusable statistics components with trends, icons, colors, and enhanced hover effects
- **Ultimate Performance**: Optimized all components for hardware acceleration, smooth animations, and accessibility compliance
- **Comprehensive Responsive Design**: Implemented mobile-first responsive design system with complete device support from 320px phones to 8K displays (3840px+)
- **Mobile-First Breakpoints**: Added comprehensive breakpoint system (xs: 475px, sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px, 4k: 2560px, 8k: 3840px)
- **Responsive Utility Classes**: Created extensive responsive utility system for text sizing, spacing, icons, and containers with automatic scaling
- **Touch-Optimized Profile**: Enhanced profile page with mobile-first layouts, flexible grids, stacked buttons, and readable text at all screen sizes
- **Cross-Device Consistency**: Ensured perfect visual consistency and usability across phones, tablets, laptops, desktops, and ultra-high resolution displays

### January 21, 2025
- **Custom Branding**: Added professional SVG logos throughout the app
- **Enhanced UI**: Replaced Font Awesome icons with custom-designed SVG icons  
- **Visual Identity**: Created consistent EcoLens branding with camera/leaf logo
- **Professional Polish**: Added branded coin icons, camera interface, and navigation icons
- **Firebase Integration**: Configured Firebase project (eco-lens-54294) for future database features
- **Deployment Ready**: Created deployment guides for both Replit and Firebase hosting options