# EcoLens - AI-Powered Recycling App

A React-based web application that uses AI to detect recyclable items through camera input and rewards users with green coins for proper recycling.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with responsive glassmorphic UI
- 🤖 **AI Detection**: Uses Teachable Machine and Clarifai for smart waste recognition
- 💰 **Reward System**: Earn green coins for identifying recyclable items
- 🎯 **Smart Bin Recommendations**: Color-coded guidance for proper recycling
- 📱 **QR Code Generation**: Redeem coins for real-world rewards
- 🗺️ **Map Integration**: Find nearby recycling centers
- ✨ **Smooth Animations**: Confetti effects and micro-interactions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **AI**: Teachable Machine, Clarifai API
- **Database**: Firebase (optional), In-memory storage
- **Hosting**: Replit Deployments or Firebase Hosting

## Deployment Options

### 1. Replit Deployments (Recommended)
- Simple one-click deployment from your Replit
- Automatic SSL and domain management
- No additional setup required

### 2. Firebase Hosting (Optional)
If you want to use Firebase Hosting:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Update `.firebaserc` with your project ID
4. Build the project: `npm run build`
5. Deploy: `firebase deploy`

## Environment Variables

Create a `.env` file (if using Firebase):

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id  
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_TEACHABLE_MACHINE_MODEL_URL=your_model_url
VITE_CLARIFAI_API_KEY=your_clarifai_key
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open in browser and allow camera permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own recycling initiatives!