import { useState, useRef, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import CameraPermission from './components/CameraPermission';
import FaceRegistration from './components/FaceRegistration';
import HomeScreen from './components/HomeScreen';
import DetectionAlert from './components/DetectionAlert';
import { storage } from './utils/storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [showAlert, setShowAlert] = useState(false);
  const [detectedFace, setDetectedFace] = useState(null);
  const [isCurrentlyVerified, setIsCurrentlyVerified] = useState(false);

  useEffect(() => {
    // Check if user is already registered locally
    const isRegistered = storage.isRegistered();
    if (isRegistered) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('welcome');
    }
  }, []);

  const handleWelcomeContinue = () => {
    setCurrentScreen('permission');
  };

  const handlePermissionGranted = () => {
    setCurrentScreen('registration');
  };

  const handlePermissionDenied = () => {
    // Stay on permission screen
  };

  const handleRegistrationComplete = () => {
    setCurrentScreen('home');
  };

  const handleUnknownFaceDetected = (detection) => {
    setDetectedFace(detection);
    setShowAlert(true);
  };

  const handleVerificationStatusChange = (status) => {
    setIsCurrentlyVerified(status.isVerified);

    // SEAMLESS RECOVERY: If the owner returns to the frame alone, automatically clear the alert
    if (status.isVerified && showAlert) {
      setShowAlert(false);
      setDetectedFace(null);
    }
  };

  const handleAllowViewing = (force = false) => {
    if (isCurrentlyVerified || force) {
      setShowAlert(false);
      setDetectedFace(null);
    } else {
      console.log("Cannot clear: Identity verification required (Face or Password).");
    }
  };

  const handleBlockScreen = () => {
    // Implementation for dynamic blocking could go here
    console.log("Screen blocked manually");
  };

  return (
    <div className="min-h-screen bg-app-gradient selection:bg-primary-500/30">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onContinue={handleWelcomeContinue} />
      )}

      {currentScreen === 'permission' && (
        <CameraPermission
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
        />
      )}

      {currentScreen === 'registration' && (
        <FaceRegistration onComplete={handleRegistrationComplete} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onUnknownFaceDetected={handleUnknownFaceDetected}
          onVerificationStatusChange={handleVerificationStatusChange}
        />
      )}

      {showAlert && (
        <DetectionAlert
          onAllow={handleAllowViewing}
          onBlock={handleBlockScreen}
          isVerifiedStatus={isCurrentlyVerified}
        />
      )}
    </div>
  );
}
