# EcoLens - AI-Powered Recycling App

## Overview
EcoLens is a React-based mobile-first application with professional-grade anti-fraud security that leverages AI for real-time detection of recyclable items via camera input. The app enforces strict daily scan limits (10 scans/day) and reduced coin rewards to prevent cheating while encouraging proper recycling habits. Virtual "green coins" can be redeemed through QR codes after comprehensive fraud validation. The project integrates AI-driven object recognition with enterprise-level security measures to ensure authentic recycling behavior.

## Recent Changes (August 22, 2025)
- ✅ Fixed critical frontend display bug: Skip verification now shows "+1 Green Coins" instead of "+2 Green Coins"
- ✅ Updated failed verification logic: Users now get 0 coins for failed verification but scan still counts toward daily limit
- ✅ Enhanced verification system with proper status tracking (verified/partial/failed/skipped)
- ✅ Daily scan limit reset functionality working properly (0/10 scans available)
- ✅ Proof-in-Bin verification system implemented with AI-powered comparison
- ✅ Verification UI appears correctly when high-value items are detected
- ✅ All coin award logic synchronized between frontend and backend:
  * Successful verification: 2 coins ✅
  * Skipped verification: 1 coin ✅  
  * Failed verification: 0 coins ✅
- ✅ Transaction history properly records all verification outcomes
- ✅ Fixed UI bugs in verification system (August 22, 2025):
  * Added distinct "Verification Skipped" UI with yellow theme and penalty message
  * Fixed animation logic: No coin animation for 0-coin awards (failed verification)
  * Enhanced error handling: Network errors properly set failed verification state
  * Added processing states: Disabled buttons and loading text during verification
  * Improved fraud score logic: High fraud (≥70) now correctly awards 0 coins

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with a custom glassmorphic design system
- **UI Components**: Radix UI primitives and shadcn/ui components
- **State Management**: TanStack Query for server state; React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for monorepo setup
- **UI/UX Decisions**: Emphasis on professional glassmorphic design, smooth animations, touch-friendly controls, and responsive layouts supporting displays up to 8K. Includes interactive welcome pages, premium wallet interfaces, and enhanced results displays with confetti and visual feedback. Custom SVG logos and icons define the visual identity.
- **Mobile-First Design**: Implemented with Tailwind CSS mobile breakpoints, WebRTC for camera access, and custom touch-optimized UI components, structured for PWA capabilities.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM, utilizing Neon Database for serverless PostgreSQL.
- **API Design**: RESTful endpoints with JSON responses.
- **Data Flow**: Camera capture -> AI processing (Teachable Machine/Clarifai) -> Results processing (mapping to categories/rewards) -> Database storage (detections/transactions) -> UI updates -> Reward redemption via QR code.
- **System Design Choices**:
    - **AI Detection System**: Primary integration with Teachable Machine for custom models, with Clarifai API as fallback. Features client-side image capture, base64 encoding, and multi-tier confidence thresholds.
    - **Camera System**: Real-time video streaming with WebRTC, canvas-based image capture, mobile optimization for back camera selection, and robust error handling for permissions.
    - **Reward System**: Tracks "green coins" as virtual currency, maintains transaction history, generates server-side QR codes for redemption, and provides real-time UI updates.
    - **Professional Anti-Fraud System**: Comprehensive security with daily scan limits (6 scans/day), reduced coin rewards (30% reduction), fraud scoring, image hash verification, rapid scanning detection (5-minute intervals), suspicious pattern detection, device fingerprinting, time-based analysis, and account status monitoring. Enhanced verification requirements for high-value items.
    - **Database Schema**: Includes tables for Users (authentication, coin balance, profile), Detections (AI results, confidence, rewards), and Transactions (financial history).
    - **Analytics & Personalization**: Features an analytics dashboard with personal impact metrics, custom goals, smart reminders, habit analytics, and an achievement system.
    - **Performance Optimizations**: Utilizes code splitting, client-side image optimization, TanStack Query for caching, tree shaking, and modern JavaScript targeting.
    - **Monorepo Structure**: Shared TypeScript types and schemas ensure type safety across client and server.

## External Dependencies
### AI Services
- **@teachablemachine/image**: Primary AI detection service.
- **Clarifai API**: Fallback detection service.

### Database & Storage
- **@neondatabase/serverless**: Serverless PostgreSQL database provider.
- **Drizzle ORM**: Type-safe database operations and migrations.
- **connect-pg-simple**: PostgreSQL session storage.

### UI & Styling
- **@radix-ui/***: Accessible, unstyled UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **class-variance-authority**: Type-safe variant management.
- **lucide-react**: Icon library.

### Development Tools
- **Vite**: Build tool with HMR and optimized bundling.
- **ESBuild**: Fast JavaScript bundler for production.
- **TypeScript**: Static type checking.