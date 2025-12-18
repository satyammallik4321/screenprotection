import { Shield, Camera, Lock, ArrowRight, Eye, ShieldCheck } from 'lucide-react';

export default function WelcomeScreen({ onContinue }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in bg-black">
            <div className="max-w-md w-full card text-center space-y-10">
                {/* App Icon */}
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                            <Shield className="w-14 h-14 text-primary-500 shadow-primary-500/50" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                        Privacy<span className="text-primary-500">Guard</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
                        Hardware-Based Screen Protection
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-6 text-left">
                    <FeatureItem
                        icon={<Eye className="w-5 h-5 text-primary-400" />}
                        title="Intruder Detection"
                        desc="Locks screen instantly if an unknown face is detected."
                        color="bg-primary-500/10"
                    />
                    <FeatureItem
                        icon={<ShieldCheck className="w-5 h-5 text-success-400" />}
                        title="Zero Cloud"
                        desc="All processing happens on-device. No data ever leaves."
                        color="bg-success-500/10"
                    />
                    <FeatureItem
                        icon={<Lock className="w-5 h-5 text-purple-400" />}
                        title="Backup Key"
                        desc="Secure password fallback for emergency access."
                        color="bg-purple-500/10"
                    />
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                    <button
                        onClick={onContinue}
                        className="btn-primary w-full py-5 flex items-center justify-center gap-3"
                    >
                        Initialize Privacy
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-6">
                        Enterprise Grade Privacy Standard
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc, color }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 border border-white/5 transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider">{title}</h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    );
}
