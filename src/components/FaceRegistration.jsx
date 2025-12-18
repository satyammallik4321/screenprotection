import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, Loader, ScanFace, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { startCamera, stopCamera, detectFace, loadModels } from '../utils/faceDetection';
import { storage } from '../utils/storage';

export default function FaceRegistration({ onComplete }) {
    const [regStep, setRegStep] = useState('face'); // face, password, success
    const [stepStatus, setStepStatus] = useState('ready'); // ready, scanning
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Position your face in the frame');
    const [detectionAttempts, setDetectionAttempts] = useState(0);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const videoRef = useRef(null);

    useEffect(() => {
        loadModels();
        return () => stopCamera();
    }, []);

    const handleStartScan = async () => {
        try {
            setStepStatus('scanning');
            setMessage('Accessing camera...');
            await startCamera(videoRef.current);
            setMessage('Detecting your face...');
            performFaceDetection();
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('Failed to access camera. Please check permissions.');
            setStepStatus('ready');
        }
    };

    const performFaceDetection = async () => {
        const maxAttempts = 15;
        let attempts = 0;

        const detectInterval = setInterval(async () => {
            attempts++;
            setDetectionAttempts(attempts);
            setProgress((attempts / maxAttempts) * 100);

            const detection = await detectFace(videoRef.current);

            if (detection) {
                clearInterval(detectInterval);

                // Save face descriptor locally
                const descriptor = Array.from(detection.descriptor);
                storage.saveFaceDescriptor(descriptor);

                setStepStatus('ready');
                setMessage('Face scanned! Now set a backup password.');
                stopCamera();
                setRegStep('password');
                setProgress(0);
            } else if (attempts >= maxAttempts) {
                clearInterval(detectInterval);
                setMessage('Detection timed out. Align your face and try again.');
                setStepStatus('ready');
                setProgress(0);
                stopCamera();
            }
        }, 500);
    };

    const handleSetPassword = (e) => {
        e.preventDefault();
        if (password.length < 4) {
            alert('Password must be at least 4 characters.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        storage.setPassword(password);
        storage.saveFaceRegistered(true);
        setRegStep('success');

        setTimeout(() => {
            onComplete();
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 text-white animate-fade-in bg-black">
            <div className="max-w-md w-full space-y-8">

                {regStep === 'face' && (
                    <div className="space-y-6 animate-slide-up">
                        <div className="text-center">
                            <div className="inline-block p-4 rounded-full bg-primary-500/20 mb-4">
                                <ScanFace className="w-12 h-12 text-primary-500" />
                            </div>
                            <h2 className="text-3xl font-bold">Face Identity</h2>
                            <p className="text-gray-400 mt-2">{message}</p>
                        </div>

                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border-2 border-gray-800 shadow-2xl">
                            <video
                                ref={videoRef}
                                className={`w-full h-full object-cover ${stepStatus === 'scanning' ? 'opacity-100' : 'opacity-0'}`}
                                autoPlay
                                playsInline
                                muted
                            />

                            {stepStatus === 'ready' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                                    <button
                                        onClick={handleStartScan}
                                        className="btn-primary"
                                    >
                                        <Camera className="w-5 h-5 inline mr-2" />
                                        Scan Face
                                    </button>
                                </div>
                            )}

                            {stepStatus === 'scanning' && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 border-[3px] border-primary-500/50 animate-pulse" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 animate-scan" />
                                    <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {regStep === 'password' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center">
                            <div className="inline-block p-4 rounded-full bg-purple-500/20 mb-4">
                                <KeyRound className="w-12 h-12 text-purple-500" />
                            </div>
                            <h2 className="text-3xl font-bold">Backup Password</h2>
                            <p className="text-gray-400 mt-2">Required for manual unlock if face fails.</p>
                        </div>

                        <form onSubmit={handleSetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="Enter secure password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="Repeat password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary w-full py-4 text-lg font-bold mt-2"
                            >
                                Complete Setup
                            </button>
                        </form>
                    </div>
                )}

                {regStep === 'success' && (
                    <div className="text-center py-12 animate-scale-in">
                        <div className="w-24 h-24 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-12 h-12 text-success-500" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">Secure!</h2>
                        <p className="text-gray-400">Identity registered and encrypted.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
