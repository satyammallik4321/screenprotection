import { useState, useEffect } from 'react';
import { Camera, AlertCircle, ShieldCheck, RefreshCcw } from 'lucide-react';

export default function CameraPermission({ onPermissionGranted, onPermissionDenied }) {
    const [permissionState, setPermissionState] = useState('requesting');

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

    if (permissionState === 'granted') return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black animate-fade-in">
            <div className="max-w-md w-full card text-center space-y-8 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

                {permissionState === 'requesting' ? (
                    <div className="space-y-8 py-4">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-30 animate-pulse-slow" />
                                <div className="relative w-28 h-28 rounded-full bg-primary-500/10 border-2 border-primary-500/30 flex items-center justify-center">
                                    <Camera className="w-14 h-14 text-primary-500" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">
                                Eyes Needed
                            </h2>
                            <p className="text-gray-400 font-medium px-4">
                                PrivacyGuard needs camera access to verify your identity and watch for intruders.
                            </p>
                        </div>

                        <div className="bg-primary-500/5 border border-primary-500/20 rounded-[2rem] p-6 flex items-start gap-4 text-left">
                            <ShieldCheck className="w-6 h-6 text-primary-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                <strong className="text-primary-300 uppercase block mb-1">Local Processing</strong>
                                Your camera feed stays on your device. We use industry-standard encryption for your biometric signatures.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
                                Prompting Browser...
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 py-4 animate-shake">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-danger-500 blur-3xl opacity-20" />
                                <div className="relative w-28 h-28 rounded-full bg-danger-500/10 border-2 border-danger-500/30 flex items-center justify-center">
                                    <AlertCircle className="w-14 h-14 text-danger-500" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-danger-500">
                                Access Denied
                            </h2>
                            <p className="text-gray-400 font-medium px-4">
                                We can't protect you without a camera. Please update your permissions.
                            </p>
                        </div>

                        <div className="bg-danger-500/5 border border-danger-500/20 rounded-[2rem] p-6 text-left space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-danger-400">Recovery Steps</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-danger-500/20 flex items-center justify-center text-[10px] font-bold text-danger-400">1</span>
                                    Click the camera icon in address bar
                                </li>
                                <li className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-danger-500/20 flex items-center justify-center text-[10px] font-bold text-danger-400">2</span>
                                    Switch permission to "Allow"
                                </li>
                                <li className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-danger-500/20 flex items-center justify-center text-[10px] font-bold text-danger-400">3</span>
                                    Click "Retry Connection" below
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={requestCameraPermission}
                            className="btn-danger w-full flex items-center justify-center gap-3"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Retry Connection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
