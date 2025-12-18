import { useState } from 'react';
import { Shield, Camera, Lock } from 'lucide-react';

export default function WelcomeScreen({ onContinue }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-md w-full card text-center space-y-6">
                {/* App Icon */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/50">
                        <Shield className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Privacy<span className="text-gradient">Guard</span>
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Your Personal Screen Protector
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-4 text-left">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                            <Camera className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Face Detection</h3>
                            <p className="text-gray-400 text-sm">
                                Automatically detects when someone else is looking at your screen
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success-500/20 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-5 h-5 text-success-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Instant Protection</h3>
                            <p className="text-gray-400 text-sm">
                                Get instant alerts and choose to allow or block viewing
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Privacy First</h3>
                            <p className="text-gray-400 text-sm">
                                All face data is stored locally on your device
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onContinue}
                    className="btn-primary w-full text-lg"
                >
                    Get Started
                </button>

                <p className="text-gray-500 text-xs">
                    Camera access required for face detection
                </p>
            </div>
        </div>
    );
}
