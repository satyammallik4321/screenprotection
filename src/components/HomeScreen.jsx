import { useState, useRef, useEffect } from 'react';
import { Shield, ShieldOff, Camera, CameraOff, Settings, ShieldCheck } from 'lucide-react';
import { startCamera, stopCamera, startFaceMonitoring } from '../utils/faceDetection';
import { storage } from '../utils/storage';

export default function HomeScreen({ onUnknownFaceDetected, onVerificationStatusChange }) {
    const [isProtectionActive, setIsProtectionActive] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const stopMonitoringRef = useRef(null);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                stopProtection();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            stopProtection();
        };
    }, []);

    const startProtection = async () => {
        try {
            const registeredDescriptor = storage.getFaceDescriptor();
            if (!registeredDescriptor) {
                alert("Registration missing. Please refresh and register.");
                return;
            }

            await startCamera(videoRef.current);
            setCameraActive(true);

            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();

                stopMonitoringRef.current = startFaceMonitoring(
                    videoRef.current,
                    (alertData) => {
                        onUnknownFaceDetected(alertData);
                    },
                    (status) => {
                        onVerificationStatusChange(status);
                    },
                    registeredDescriptor
                );

                setIsProtectionActive(true);
            };
        } catch (error) {
            console.error('Failed to start protection:', error);
            alert('Failed to access camera. Please check permissions.');
        }
    };

    const stopProtection = () => {
        if (stopMonitoringRef.current) {
            stopMonitoringRef.current();
            stopMonitoringRef.current = null;
        }
        stopCamera();
        setCameraActive(false);
        setIsProtectionActive(false);
    };

    const handleResetFace = () => {
        if (confirm('Are you sure you want to reset your registered face? You will need to register again.')) {
            storage.clearAll();
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 text-white animate-fade-in bg-black">
            <div className="max-w-2xl w-full space-y-6">
                {/* Header */}
                <div className="text-center mb-2">
                    <h1 className="text-5xl font-black mb-2 tracking-tighter">
                        Privacy<span className="text-primary-500">Guard</span>
                    </h1>
                    <p className="text-gray-400 font-medium">
                        On-Device Screen Protection
                    </p>
                </div>

                {/* Privacy Rule Notice */}
                <div className="flex items-center gap-3 px-6 py-3 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-primary-500 shrink-0" />
                    <p className="text-xs text-primary-200 leading-tight">
                        <span className="font-bold">Privacy Rule:</span> Camera activates ONLY with your consent and shuts down immediately when you switch apps or lock the device.
                    </p>
                </div>

                {/* Status Card */}
                <div className="card backdrop-blur-xl bg-gray-900/40 border-gray-800/50 shadow-2xl relative overflow-hidden p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {isProtectionActive ? (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-success-500 blur-lg opacity-40 animate-pulse" />
                                    <div className="relative w-14 h-14 rounded-2xl bg-success-500/20 flex items-center justify-center border border-success-500/30">
                                        <Shield className="w-8 h-8 text-success-500" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-2xl bg-gray-800/50 flex items-center justify-center border border-gray-700/30 text-gray-500">
                                    <ShieldOff className="w-8 h-8" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-2xl tracking-tight">
                                    {isProtectionActive ? 'Secure Mode' : 'Protection Off'}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className={`w-2 h-2 rounded-full ${isProtectionActive ? 'bg-success-500' : 'bg-gray-600'}`} />
                                    <p className="text-sm font-medium text-gray-400 capitalize">
                                        {isProtectionActive ? 'Active Monitoring' : 'Ready to secure'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            {cameraActive ? (
                                <div className="bg-success-500/10 text-success-500 border border-success-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-ping" />
                                    LIVE
                                </div>
                            ) : (
                                <div className="bg-gray-800 text-gray-500 border border-gray-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    OFFLINE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Camera Preview (hidden but active) */}
                    <video
                        ref={videoRef}
                        className={`w-full rounded-2xl shadow-inner bg-black aspect-video mb-6 ${isProtectionActive ? 'block' : 'hidden'}`}
                        autoPlay
                        playsInline
                        muted
                    />

                    {/* Control Button */}
                    <div className="space-y-4">
                        {!isProtectionActive ? (
                            <button
                                onClick={startProtection}
                                className="btn-primary w-full py-5 text-xl font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] bg-primary-500 hover:bg-primary-600 border-none"
                            >
                                <Shield className="w-6 h-6" />
                                Start Protection
                            </button>
                        ) : (
                            <button
                                onClick={stopProtection}
                                className="w-full py-5 text-xl font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all bg-danger-500/10 border-2 border-danger-500/30 text-danger-500 hover:bg-danger-500/20"
                            >
                                <ShieldOff className="w-6 h-6" />
                                Stop Protection
                            </button>
                        )}
                        <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-[0.2em]">
                            Strict On-Device Processing Only
                        </p>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-gray-900/40 border border-gray-800/50">
                        <h4 className="font-bold text-white mb-2">How it works</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            The app scans for shoulder-surfers. If any unknown face appears or you leave the frame, the screen blurs instantly.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-gray-900/40 border border-gray-800/50">
                        <h4 className="font-bold text-white mb-2">Strict Privacy</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            No face images are stored. All biometric data is encrypted on your hardware and never leaves your device.
                        </p>
                    </div>
                </div>

                {/* Settings */}
                <div className="p-6 rounded-3xl bg-gray-900/20 border border-gray-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Account Settings</span>
                    </div>
                    <button
                        onClick={handleResetFace}
                        className="text-danger-500 hover:text-danger-400 text-sm font-black uppercase tracking-wider"
                    >
                        Reset Application
                    </button>
                </div>
            </div>
        </div>
    );
}
