import { useState } from 'react';
import { Eye, ShieldX, Unlock, Lock, KeyRound, AlertTriangle, UserX, Ghost } from 'lucide-react';
import { storage } from '../utils/storage';

export default function DetectionAlert({ onAllow, onBlock, isVerifiedStatus, reason }) {
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isIntruder = reason === 'IDENTITY_MISMATCH' || reason === 'INTRUDER_DETECTED';

    const handleClearScreen = () => {
        // Attempt verification again
        if (isVerifiedStatus) {
            onAllow(); // Clear screen if face is matched
        } else {
            // If face not recognized, show password option
            setShowPasswordInput(true);
            setError('Biometric match failed. Internal security override required.');
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (storage.verifyPassword(password)) {
            onAllow(true); // Successful password clear (forced)
        } else {
            setError('Invalid master key. Lockout imminent.');
            setPassword('');
        }
    };

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in backdrop-blur-3xl ${isIntruder ? 'bg-red-950/90' : 'bg-black/90'}`}>
            <div className={`max-w-md w-full p-10 rounded-[3rem] bg-gray-900 border-2 ${isIntruder ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.5)]' : 'border-primary-500 shadow-[0_0_80px_rgba(14,165,233,0.3)]'} text-center space-y-10 relative overflow-hidden transition-all duration-500`}>

                {isIntruder && (
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse-slow pointer-events-none" />
                )}

                {/* Warning Icon */}
                <div className="relative inline-block">
                    {isIntruder ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-40 animate-pulse" />
                            <div className="relative w-28 h-28 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border-4 border-red-500/50 animate-bounce">
                                <UserX className="w-16 h-16 text-red-500" />
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 animate-pulse" />
                            <div className="relative w-28 h-28 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto border-4 border-primary-500/30">
                                <Ghost className="w-16 h-16 text-primary-500" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Warning Message */}
                <div className="space-y-3">
                    <h2 className={`text-4xl font-black tracking-tighter uppercase italic ${isIntruder ? 'text-red-500' : 'text-white'}`}>
                        {isIntruder ? 'Security Breach' : 'Presence Lost'}
                    </h2>
                    <p className={`text-lg font-bold uppercase tracking-widest ${isIntruder ? 'text-red-400' : 'text-primary-400'}`}>
                        {isIntruder ? 'Unauthorized Viewer Detected' : 'Monitoring Interrupted'}
                    </p>
                    <p className="text-gray-500 text-xs font-medium px-4 leading-relaxed">
                        {isIntruder
                            ? 'A foreign identity was detected in the security perimeter. The screen has been hardware-locked.'
                            : 'Registered identity is no longer in frame. Screen protected for your safety.'
                        }
                    </p>
                </div>

                {!showPasswordInput ? (
                    <div className="space-y-4 pt-2">
                        <button
                            onClick={handleClearScreen}
                            className={`w-full py-5 text-xl font-black rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isIntruder ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'btn-primary'}`}
                        >
                            <Unlock className="w-6 h-6" />
                            Clear Shield
                        </button>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                            Biometric or Master Key Required
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-slide-up bg-black/40 p-6 rounded-[2rem] border border-white/5">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                <KeyRound className="w-3 h-3" />
                                <span>Master Security Key</span>
                            </div>
                            <input
                                type="password"
                                autoFocus
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className={`w-full bg-transparent border-b-2 ${error ? 'border-red-500' : 'border-gray-800'} py-3 text-white text-center text-2xl tracking-[0.5em] outline-none focus:border-primary-500 transition-all font-mono placeholder:text-gray-800`}
                                placeholder="••••"
                                required
                            />
                            {error && (
                                <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest animate-shake">
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="w-full btn-primary py-4 text-sm"
                            >
                                Confirm Override
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPasswordInput(false)}
                                className="text-gray-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                            >
                                Re-Scan Biometrics
                            </button>
                        </div>
                    </form>
                )}

                <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-2 opacity-30">
                    <ShieldX className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Vault Mode Alpha</span>
                </div>
            </div>
        </div>
    );
}
