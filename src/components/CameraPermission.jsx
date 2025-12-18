import { useState, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

export default function CameraPermission({ onPermissionGranted, onPermissionDenied }) {
    const [permissionState, setPermissionState] = useState('requesting'); // requesting, granted, denied

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Stop the stream immediately, we just needed permission
            stream.getTracks().forEach(track => track.stop());
            setPermissionState('granted');
            onPermissionGranted();
        } catch (error) {
            console.error('Camera permission denied:', error);
            setPermissionState('denied');
            if (onPermissionDenied) {
                onPermissionDenied();
            }
        }
    };

    if (permissionState === 'granted') {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-md w-full card text-center space-y-6">
                {permissionState === 'requesting' ? (
                    <>
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/50 animate-pulse-slow">
                                <Camera className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Camera Access Required
                            </h2>
                            <p className="text-gray-300">
                                We need access to your camera to detect faces and protect your privacy.
                            </p>
                        </div>

                        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                            <p className="text-sm text-gray-300">
                                <strong className="text-primary-400">Privacy Note:</strong> Your camera feed is processed locally on your device. No data is sent to any server.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Waiting for permission...</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-danger-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-danger-500/50">
                                <AlertCircle className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Camera Access Denied
                            </h2>
                            <p className="text-gray-300 mb-4">
                                Camera access is required for this app to function. Please enable camera permissions in your browser settings.
                            </p>
                        </div>

                        <div className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-4 text-left">
                            <p className="text-sm text-gray-300 mb-2 font-semibold">
                                To enable camera access:
                            </p>
                            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                                <li>Click the camera icon in your browser's address bar</li>
                                <li>Select "Allow" for camera access</li>
                                <li>Refresh this page</li>
                            </ol>
                        </div>

                        <button
                            onClick={requestCameraPermission}
                            className="btn-primary w-full"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
