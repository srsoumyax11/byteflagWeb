import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    color?: 'indigo' | 'emerald' | 'rose';
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, color = 'indigo' }) => {
    const colors = {
        indigo: { bg: 'bg-indigo-500', glow: 'shadow-indigo-500/50' },
        emerald: { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50' },
        rose: { bg: 'bg-rose-500', glow: 'shadow-rose-500/50' },
    };

    return (
        <div
            onClick={onChange}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors group"
        >
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                {label}
            </span>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? colors[color].bg : 'bg-slate-700'}`}>
                <motion.div
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: checked ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
        </div>
    );
};
