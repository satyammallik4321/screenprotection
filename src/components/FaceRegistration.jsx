import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, Loader, ScanFace, Lock, ShieldCheck, KeyRound, ArrowRight, CornerUpRight, CornerUpLeft } from 'lucide-react';
import { startCamera, stopCamera, detectFace, loadModels } from '../utils/faceDetection';
import { storage } from '../utils/storage';

export default function FaceRegistration({ onComplete }) {
    const [regStep, setRegStep] = useState('face'); // face, password, success
    const [captureStep, setCaptureStep] = useState(0); // 0: Center, 1: Left, 2: Right
    const [stepStatus, setStepStatus] = useState('ready'); // ready, scanning
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Position your face in the center');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const videoRef = useRef(null);
    const descriptorsRef = useRef([]);

    const captureSteps = [
        { label: 'Look Center', icon: ScanFace },
        { label: 'Look Slightly Left', icon: CornerUpLeft },
        { label: 'Look Slightly Right', icon: CornerUpRight },
        { label: 'Look Slightly Up', icon: ArrowRight },
        { label: 'Look Slightly Down', icon: ArrowRight }
    ];

    useEffect(() => {
        loadModels();
        return () => stopCamera();
    }, []);

    const handleStartScan = async () => {
        try {
            setStepStatus('scanning');
            setMessage('Scanning: ' + captureSteps[captureStep].label);
            await startCamera(videoRef.current);
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
        let angleSamples = [];

        const detectInterval = setInterval(async () => {
            attempts++;
            setProgress((attempts / maxAttempts) * 100);

            const detection = await detectFace(videoRef.current);

            if (detection) {
                angleSamples.push(Array.from(detection.descriptor));

                // For each angle, take 2 good samples to ensure quality
                if (angleSamples.length >= 2) {
                    clearInterval(detectInterval);

                    // Average the samples for this specific angle
                    const sampleSize = angleSamples[0].length;
                    const avgAngleVector = new Float32Array(sampleSize);
                    for (let i = 0; i < sampleSize; i++) {
                        avgAngleVector[i] = (angleSamples[0][i] + angleSamples[1][i]) / 2;
                    }

                    descriptorsRef.current.push(Array.from(avgAngleVector));

                    if (captureStep < captureSteps.length - 1) {
                        setCaptureStep(prev => prev + 1);
                        setStepStatus('ready');
                        setMessage('Excellent! Next: ' + captureSteps[captureStep + 1].label);
                        setProgress(0);
                    } else {
                        // All 5 angles captured - final averaging
                        const vectorSize = descriptorsRef.current[0].length;
                        const finalDescriptor = new Float32Array(vectorSize);

                        for (let i = 0; i < vectorSize; i++) {
                            let sum = 0;
                            for (let j = 0; j < descriptorsRef.current.length; j++) {
                                sum += descriptorsRef.current[j][i];
                            }
                            finalDescriptor[i] = sum / descriptorsRef.current.length;
                        }

                        storage.saveFaceDescriptor(Array.from(finalDescriptor));
                        setStepStatus('ready');
                        setMessage('Identity Vault Sealed!');
                        stopCamera();
                        setRegStep('password');
                        setProgress(0);
                    }
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(detectInterval);
                setMessage('Detection too noisy. Please keep still and try again.');
                setStepStatus('ready');
                setProgress(0);
            }
        }, 600);
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
        <div className="min-h-screen flex items-center justify-center p-6 text-white animate-fade-in">
            <div className="max-w-md w-full space-y-8">

                {regStep === 'face' && (
                    <div className="space-y-8 animate-slide-up">
                        <div className="text-center space-y-2">
                            <div className="inline-block p-4 rounded-3xl bg-primary-500/10 border border-primary-500/20 mb-2">
                                {(() => {
                                    const Icon = captureSteps[captureStep].icon;
                                    return <Icon className="w-10 h-10 text-primary-500" />;
                                })()}
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase">Face Registry</h2>
                            <p className="text-gray-400 font-medium">{message}</p>
                        </div>

                        {/* Steps Indicator */}
                        <div className="flex justify-center gap-2">
                            {captureSteps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === captureStep ? 'w-8 bg-primary-500' : i < captureStep ? 'w-4 bg-success-500' : 'w-4 bg-gray-800'}`}
                                />
                            ))}
                        </div>

                        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-900 border-2 border-gray-800 shadow-2xl">
                            <video
                                ref={videoRef}
                                className={`w-full h-full object-cover transition-opacity duration-1000 ${stepStatus === 'scanning' ? 'opacity-100' : 'opacity-20'}`}
                                autoPlay
                                playsInline
                                muted
                            />

                            {stepStatus === 'ready' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <button
                                        onClick={handleStartScan}
                                        className="btn-primary"
                                    >
                                        <Camera className="w-5 h-5 inline mr-2" />
                                        Start Scan
                                    </button>
                                </div>
                            )}

                            {stepStatus === 'scanning' && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-x-8 inset-y-8 border-[2px] border-primary-500/30 rounded-full animate-pulse-slow" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 animate-scan" />
                                    <div className="absolute bottom-8 left-8 right-8 h-1.5 bg-gray-950 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-primary-500 transition-all duration-300 shadow-[0_0_10px_#0ea5e9]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center px-4">
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
                                Hardware-Encrypted Biometric Storage
                            </p>
                        </div>
                    </div>
                )}

                {regStep === 'password' && (
                    <div className="space-y-8 animate-fade-in card">
                        <div className="text-center space-y-2">
                            <div className="inline-block p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 mb-2">
                                <KeyRound className="w-10 h-10 text-purple-500" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase">Backup Key</h2>
                            <p className="text-gray-400 font-medium">For secure clearing if face fails.</p>
                        </div>

                        <form onSubmit={handleSetPassword} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Secret Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-2xl px-6 py-4 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-700 font-mono text-xl"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Secret</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-2xl px-6 py-4 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-700 font-mono text-xl"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full btn-primary py-5 text-lg"
                            >
                                Secure Identity
                                <ArrowRight className="w-5 h-5 inline ml-2" />
                            </button>
                        </form>
                    </div>
                )}

                {regStep === 'success' && (
                    <div className="text-center py-12 animate-fade-in card space-y-6">
                        <div className="w-28 h-28 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                            <ShieldCheck className="w-16 h-16 text-success-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter uppercase">Vault Ready</h2>
                            <p className="text-gray-400 font-medium">Your identity is locked in local storage.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
