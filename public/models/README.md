# Face Detection Models

This directory should contain the face-api.js model files.

## Required Files

Download these files from: https://github.com/justadudewhohacks/face-api.js-models/tree/master/weights

- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

## Quick Download (PowerShell)

Run this from the project root:

```powershell
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
