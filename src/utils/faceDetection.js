import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let videoStream = null;
let demoMode = false;

// Load face detection models
export const loadModels = async () => {
    if (modelsLoaded) return true;

    try {
        const MODEL_URL = '/models';
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        modelsLoaded = true;
        demoMode = false;
        return true;
    } catch (error) {
        console.warn('Models not found, enabling demo mode:', error);
        modelsLoaded = true;
        demoMode = true;
        return true;
    }
};

// Start camera stream
export const startCamera = async (videoElement) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user',
            },
        });

        if (videoElement) {
            videoElement.srcObject = stream;
            videoStream = stream;
        }

        return stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        throw error;
    }
};

// Stop camera stream
export const stopCamera = () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
};

// Detect face and get descriptor
export const detectFace = async (videoElement) => {
    if (!modelsLoaded) {
        await loadModels();
    }

    if (demoMode) {
        const demoDescriptor = new Float32Array(128);
        for (let i = 0; i < 128; i++) demoDescriptor[i] = Math.random();
        return {
            descriptor: demoDescriptor,
            detection: { score: 0.95 },
        };
    }

    try {
        const detection = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        return detection;
    } catch (error) {
        console.error('Error detecting face:', error);
        return null;
    }
};

// Detect multiple faces (for intruder detection)
export const detectMultipleFaces = async (videoElement) => {
    if (!modelsLoaded) await loadModels();
    if (demoMode) return [(await detectFace(videoElement))];

    try {
        const detections = await faceapi
            .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
        return detections;
    } catch (err) {
        return [];
    }
}

// Compare two face descriptors
export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
    if (!descriptor1 || !descriptor2) return false;
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    // Lower distance = Higher similarity. 0.6 is the robust default.
    return distance < threshold;
};

// Continuous face monitoring (Purely Client-Side)
export const startFaceMonitoring = async (videoElement, onAlert, onStatusChange, registeredDescriptor) => {
    let isMonitoring = true;

    const monitor = async () => {
        if (!isMonitoring) return;

        // Detect all faces to catch shoulder-surfers
        const detections = await detectMultipleFaces(videoElement);

        if (detections.length === 0) {
            // BEHAVIOR: "If the registered face leaves the frame -> trigger protection instantly"
            onStatusChange({ isVerified: false, reason: 'PRESENCE_LOST' });
            onAlert({ reason: 'PRESENCE_LOST' });
        } else {
            // Check if any of the faces matches the owner
            const ownerMatch = detections.find(d =>
                compareFaces(Array.from(d.descriptor), registeredDescriptor)
            );

            // BEHAVIOR: "If any unknown face appears -> trigger protection instantly"
            // AND "If only the registered face is detected -> screen stays visible"
            const hasIntruder = detections.length > 1 || !ownerMatch;

            if (onStatusChange) {
                onStatusChange({
                    isVerified: !!ownerMatch && detections.length === 1,
                    detection: ownerMatch
                });
            }

            if (hasIntruder && onAlert) {
                onAlert({
                    reason: !ownerMatch ? 'IDENTITY_MISMATCH' : 'INTRUDER_DETECTED',
                    intruderCount: detections.length - (ownerMatch ? 1 : 0)
                });
            }
        }

        // Check again after 1 second
        setTimeout(monitor, 1000);
    };

    monitor();

    return () => {
        isMonitoring = false;
    };
};
