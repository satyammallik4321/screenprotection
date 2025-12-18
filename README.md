# PrivacyGuard - Face Detection Privacy Protection App

A React-based privacy protection app that uses face detection to alert you when someone else is looking at your screen.

## Features

- 🔒 **Face Registration**: First-time setup to register your face
- 📸 **Real-time Detection**: Continuous monitoring for unauthorized faces
- ⚡ **Instant Alerts**: Full-screen popup when unknown face detected
- 🎨 **Premium UI**: Modern design with glassmorphism and smooth animations
- 🔐 **Privacy First**: All face data stored locally in your browser

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Models
Download the models to the `public/models` directory.

### 3. Run the App
```bash
npm run dev
```

The app requires face-api.js models to work. Download them from the official repository:

**Option A: Manual Download**
1. Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Download these files to `public/models/`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`

**Option B: Using Git**
```bash
cd public
git clone https://github.com/justadudewhohacks/face-api.js-models.git temp-models
cp -r temp-models/weights/* models/
rm -rf temp-models
cd ..
```

**Option C: Using PowerShell (Windows)**
```powershell
# Run this from the project root
$modelsUrl = "https://github.com/justadudewhohacks/face-api.js-models/raw/master/weights"
$files = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2"
)

foreach ($file in $files) {
    Invoke-WebRequest -Uri "$modelsUrl/$file" -OutFile "public/models/$file"
}
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## How to Use

### First Time Setup
1. Click "Get Started" on the welcome screen
2. Grant camera permission when prompted
3. Follow the face registration process
4. Position your face in the frame and click "Start Face Scan"
5. Wait for the scan to complete

### Using the App
1. On the home screen, click "Start Protection"
2. The camera will activate and begin monitoring
3. If an unknown face is detected, you'll see a full-screen alert
4. Choose to either:
   - **Allow Viewing**: Dismiss the alert and continue
   - **Block Screen**: Apply a blur effect to protect your privacy

### Settings
- Click "Reset Registered Face" to clear your data and register again

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **face-api.js** - Face detection and recognition
- **Lucide React** - Icons

## Browser Requirements

- Modern browser with camera support (Chrome, Firefox, Edge, Safari)
- HTTPS or localhost (required for camera access)
- Camera permissions enabled

## Privacy & Security

- All face data is stored locally in your browser's localStorage
- No data is sent to any server
- Camera access only when explicitly started by you
- Face processing happens entirely on your device

## Troubleshooting

### Camera not working
- Ensure camera permissions are granted
- Check if another app is using the camera
- Try refreshing the page

### Face detection not working
- Ensure models are downloaded correctly in `public/models/`
- Check browser console for errors
- Ensure good lighting on your face

### Models not loading
- Verify all model files are in `public/models/`
- Check the browser console for 404 errors
- Ensure file names match exactly

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT
