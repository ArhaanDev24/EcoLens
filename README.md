# EcoLens - AI-Powered Recycling App

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Made with React](https://img.shields.io/badge/built%20with-React-61DAFB?logo=react&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-yellow)

A React-based web application that uses AI to detect recyclable items through camera input and rewards users with green coins for proper recycling.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with a responsive glassmorphic UI  
- 🤖 **AI Detection**: Utilizes Teachable Machine and Clarifai for smart waste recognition  
- 💰 **Reward System**: Earn green coins for identifying recyclable items  
- 🎯 **Smart Bin Recommendations**: Color-coded guidance for proper recycling  
- 📱 **QR Code Generation**: Redeem coins for real-world rewards  
- 🗺️ **Map Integration**: Find nearby recycling centers  
- ✨ **Smooth Animations**: Confetti effects and micro-interactions for feedback

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite  
- **Backend**: Express.js, Node.js  
- **AI**: Teachable Machine, Clarifai API  
- **Database**: Firebase (optional) or In-memory storage  
- **Hosting**: Localhost / Firebase Hosting / Ngrok

## Deployment Options

### 🔧 Local Deployment (Recommended for Development)

1. **Clone the repository**  
   ```bash
   git clone https://github.com/ArhaanDev24/ecolens.git
   cd ecolens
   ```

2. **Install frontend dependencies**  
   ```bash
   npm install
   ```

3. **Start the frontend server**  
   ```bash
   npm run dev
   ```

4. **Install and start the backend server**  
   ```bash
   cd server
   npm install
   npm run dev
   ```

5. **Visit the app**  
   Open [http://localhost:5173](http://localhost:5173) in your browser and allow camera access.

### 🌐 Using Ngrok for Public Access

Ngrok allows you to share your local development server over the internet — useful for mobile device testing with camera input.

1. [Download Ngrok](https://ngrok.com/download) and install it  
2. Authenticate (only once):  
   ```bash
   ngrok config add-authtoken <your_token>
   ```

3. Start tunneling your Vite dev server (default: port 5173):  
   ```bash
   ngrok http 5173
   ```

4. Ngrok will generate a public URL like `https://abcd1234.ngrok.io`.  
   Open that link on your phone or share it for external testing.

> ⚠️ Make sure your device allows camera access over Ngrok HTTPS links.

---

### ☁️ Firebase Hosting (Optional)

1. Install Firebase CLI  
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase  
   ```bash
   firebase login
   ```

3. Update `.firebaserc` with your project ID

4. Build the project  
   ```bash
   npm run build
   ```

5. Deploy  
   ```bash
   firebase deploy
   ```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id  
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_TEACHABLE_MACHINE_MODEL_URL=your_model_url
VITE_CLARIFAI_API_KEY=your_clarifai_key
```

## Getting Started (Quick Commands)

```bash
# Frontend
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```

## Contributing

1. Fork the repository  
2. Create a new feature branch  
3. Commit and push your changes  
4. Submit a pull request

## License

This project is licensed under the MIT License.  
You're free to use, modify, and distribute this project as long as you include the original license.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
