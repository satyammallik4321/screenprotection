import { useState } from 'react';
import { Eye, ShieldX, Unlock, Lock, KeyRound, AlertTriangle } from 'lucide-react';
import { storage } from '../utils/storage';

export default function DetectionAlert({ onAllow, onBlock, isVerifiedStatus }) {
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClearScreen = () => {
        // Attempt verification again
        if (isVerifiedStatus) {
            onAllow(); // Clear screen if face is matched
        } else {
            // If face not recognized, show password option
            setShowPasswordInput(true);
            setError('Face not recognized. Please use backup password.');
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (storage.verifyPassword(password)) {
            onAllow(true); // Successful password clear (forced)
        } else {
            setError('Incorrect password. Access denied.');
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in backdrop-blur-3xl bg-black/80">
            <div className="max-w-md w-full p-8 rounded-3xl bg-gray-900/90 border-2 border-danger-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center space-y-8">

                {/* Warning Icon */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-danger-500 blur-2xl opacity-20 animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-danger-500/20 flex items-center justify-center mx-auto border-2 border-danger-500/30">
                        <Eye className="w-12 h-12 text-danger-500" />
                    </div>
                </div>

                {/* Warning Message */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Security Alert
                    </h2>
                    <p className="text-xl font-medium text-danger-400">
                        Someone is watching your screen.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Screen protected by mandatory privacy shield.
                    </p>
                </div>

                {!showPasswordInput ? (
                    <div className="space-y-4">
                        <button
                            onClick={handleClearScreen}
                            className="w-full btn-primary bg-primary-500 hover:bg-primary-600 border-none py-5 text-xl font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <Unlock className="w-6 h-6" />
                            Clear Screen
                        </button>
                        <p className="text-xs text-gray-500 italic">
                            Confirmation requires registered identity via Face or Password.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-5 animate-slide-up">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                                <KeyRound className="w-4 h-4 text-primary-500" />
                                <span>Enter Backup Password</span>
                            </div>
                            <input
                                type="password"
                                autoFocus
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className={`w-full bg-black border ${error ? 'border-danger-500' : 'border-gray-800'} rounded-2xl px-5 py-4 text-white text-center text-lg tracking-widest outline-none focus:border-primary-500 transition-all font-mono`}
                                placeholder="••••••••"
                                required
                            />
                            {error && (
                                <div className="flex items-center justify-center gap-1.5 text-danger-400 text-sm animate-shake">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPasswordInput(false)}
                                className="py-4 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                            >
                                Try Face Again
                            </button>
                            <button
                                type="submit"
                                className="btn-primary py-4 text-sm font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary-500/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                )}

                <div className="pt-4 border-t border-gray-800/50">
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                        <Lock className="w-3 h-3" />
                        <span>On-Device Protection Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
