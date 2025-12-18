# PrivacyGuard v1.5 - Advanced Enterprise Privacy Shield

A premium, React-based privacy protection app that leverages on-device Edge AI to secure your screen. It automatically blurs your display when intruders or shoulder-surfers are detected.

## 🌟 Premium Features

### 1. Advanced 5-Angle Identity Signature
The registration process now captures **Center, Left, Right, Up, and Down** head positions. By taking multiple samples for each angle and averaging the biometric vectors, PrivacyGuard v1.5 creates a highly robust "Master Identity" that minimizes false negatives.

### 2. Context-Aware Security Alerts
- 🚨 **Breach Mode (Red)**: Triggers an aggressive red-flashing alert if an **unauthorized face** is detected.
- 🌫️ **Absence Mode (Blue)**: Triggers a standard blue alert if the **registered owner leaves** the frame.
- 🔒 **Hardware-Lock**: Mandatory blur effect that can only be cleared by the registered owner or a master security key.

### 3. Seamless Recovery (Auto-Unblur)
Experience fluid security—if you look away to trigger the shield, simply **looking back at the camera solo** will automatically clear the alert without any manual input.

### 4. Zero-Trust Architecture
- **100% On-Device Processing**: No images or data ever leave your machine.
- **AES-256 Encryption**: Biometric descriptors are encrypted before being stored in local storage.
- **SHA-256 Hashing**: Backup passwords are securely hashed.
- **Strict Camera Control**: The camera shuts down instantly if you switch browser tabs or lock your device.

## 🎨 Design Aesthetics
- **Premium Themes**: Glassmorphism, deep radial gradients, and fluid micro-animations.
- **Real-Time Feedback**: "Identity Confirmed" status badges and high-tech scanning animations.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Automated Model Download (PowerShell)
I have provided a script to automatically fetch the mandatory face-api.js weights:
```powershell
# Run from project root
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$files = @("tiny_face_detector_model-weights_manifest.json", "tiny_face_detector_model-shard1", "face_landmark_68_model-weights_manifest.json", "face_landmark_68_model-shard1", "face_recognition_model-weights_manifest.json", "face_recognition_model-shard1", "face_recognition_model-shard2")
foreach ($file in $files) { curl.exe -L "$baseUrl/$file" -o "public/models/$file" }
```

### 3. Run the App
```bash
npm run dev
```
The app will open at `http://localhost:3000`

## 🛠️ Technology Stack
- **React 18** & **Vite 5**
- **Tailwind CSS 3** (Custom Premium Utilities)
- **Face-api.js** (SOTA On-Device Face Recognition)
- **Crypto-JS** (AES/SHA Security)
- **Lucide-React** (Enterprise Icons)

## 📋 Best Practices for Usage
1. **Lighting**: Ensure even lighting during the 5-angle registration.
2. **Hard Refresh**: If you don't see the **v1.5** tag in the header, press **Ctrl + F5**.
3. **Resetting**: If you change your appearance (glasses, etc.), use the "Reset Application" button on the home screen to update your biometric vault.

## ⚖️ License
MIT - Created for elite privacy-conscious users.
