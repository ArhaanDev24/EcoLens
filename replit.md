# EcoLens - AI-Powered Recycling App

## Overview
EcoLens is a React-based mobile-first application that leverages AI for real-time detection of recyclable items via camera input. Its core purpose is to encourage proper recycling habits by rewarding users with virtual "green coins" which can be redeemed through QR codes. The project aims to integrate AI-driven object recognition with a user-friendly reward system to foster environmental responsibility.

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
    - **Anti-Cheating System**: Incorporates rate limiting, image hash verification (SHA-256), confidence thresholds, pattern detection, location tracking, rapid scanning detection, and a fraud scoring system. High-value items require disposal verification photos.
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