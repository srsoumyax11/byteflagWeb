import React, { useState, useEffect, useMemo } from 'react';
import { ByteFlags } from 'byteflags';
import { Toggle } from '../components/Toggle';
import { ArrowRight, Database, Cpu, Zap, Terminal, Server, Gamepad2, Shield, Gauge, Layers, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BASE_FLAG_NAMES = [
    "Notifications", "Dark Mode", "Auto Save", "Sound",
    "Vibration", "Location", "Analytics", "Marketing",
    "Email Alerts", "SMS Alerts", "Push Notifs", "Beta Features",
    "High Contrast", "Reduced Motion", "Auto Play", "Subtitles",
    "Data Saver", "Offline Mode", "Sync", "Backup",
    "2FA", "Public Profile", "Read Receipts", "Typing Indicators", "Online Status"
];

function LandingPage() {
    const [flagCount, setFlagCount] = useState(8);

    // Derived names based on count
    const activeFlagNames = useMemo(() => BASE_FLAG_NAMES.slice(0, flagCount), [flagCount]);

    // State for Traditional (Object)
    const [traditionalFlags, setTraditionalFlags] = useState<Record<string, boolean>>(() => {
        return BASE_FLAG_NAMES.reduce((acc, name) => ({ ...acc, [name]: false }), {});
    });

    // State for ByteFlags (Array of Bytes)
    // We need Math.ceil(flagCount / 8) bytes
    const [byteValues, setByteValues] = useState<number[]>([0, 0, 0, 0]);

    // Helper to interact with the specific byte using ByteFlags library
    const toggleByteFlag = (globalIndex: number) => {
        const byteIndex = Math.floor(globalIndex / 8);
        const bitIndex = globalIndex % 8;

        const currentByteVal = byteValues[byteIndex] || 0;

        // Create a temporary instance to handle the bit manipulation for this specific byte
        // We map the specific bit index to a dummy name for the library to use
        const flags = new ByteFlags({ 'target': bitIndex }, currentByteVal);
        flags.toggle('target');

        const newByteVal = flags.getByte();

        setByteValues(prev => {
            const newBytes = [...prev];
            newBytes[byteIndex] = newByteVal;
            return newBytes;
        });
    };

    const toggleTraditional = (name: string) => {
        setTraditionalFlags(prev => ({ ...prev, [name]: !prev[name] }));
    };

    // Sync traditional flags when count changes (optional, but good for consistency)
    useEffect(() => {
        // Ensure we have enough bytes for the current count
        const neededBytes = Math.ceil(flagCount / 8);
        setByteValues(prev => {
            if (prev.length < neededBytes) {
                return [...prev, ...new Array(neededBytes - prev.length).fill(0)];
            }
            return prev;
        });
    }, [flagCount]);

    // Metrics
    // Traditional: JSON string length of the ACTIVE flags
    const activeTraditionalState = activeFlagNames.reduce((acc, name) => ({ ...acc, [name]: traditionalFlags[name] }), {});
    const traditionalSize = JSON.stringify(activeTraditionalState).length;

    // ByteFlags: Number of bytes needed
    const byteFlagsSize = Math.ceil(flagCount / 8);

    const savings = Math.round(((traditionalSize - byteFlagsSize) / traditionalSize) * 100);

    return (
        <div className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Hero Section */}
            <header className="max-w-6xl mx-auto mb-16 text-center pt-12 relative">
                <nav className="absolute top-0 right-0 p-4">
                    <Link to="/docs" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <BookOpen size={20} />
                        <span>Documentation</span>
                    </Link>
                </nav>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                        ByteFlags
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        The ultra-lightweight TypeScript library for packing boolean flags into a single byte.
                        Save memory, bandwidth, and database storage.
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 font-mono text-sm hover:bg-white/10 transition-colors cursor-copy group">
                            <span className="text-emerald-400">$</span>
                            <span className="text-slate-300">npm install byteflags</span>
                            <Terminal size={16} className="ml-2 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                        <Link to="/docs" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-full font-medium text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                            <span>Read the Docs</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            </header>

            {/* Main Content - 3 Columns */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-32">

                {/* Left Column: Traditional */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
                        <Database size={100} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-rose-200">The Old Way</h2>
                    <p className="text-sm text-slate-400 mb-6">Storing booleans as JSON objects.</p>

                    <div className="space-y-2 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeFlagNames.map(name => (
                            <Toggle
                                key={name}
                                label={name}
                                checked={traditionalFlags[name] || false}
                                onChange={() => toggleTraditional(name)}
                                color="rose"
                            />
                        ))}
                    </div>

                    <div className="mt-auto bg-black/50 rounded-xl p-4 font-mono text-xs text-slate-400 border border-white/5 overflow-hidden">
                        <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                            <span>JSON Output</span>
                            <span className="text-rose-400">{traditionalSize} bytes</span>
                        </div>
                        <pre className="whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                            {JSON.stringify(activeTraditionalState, null, 2)}
                        </pre>
                    </div>
                </motion.div>

                {/* Middle Column: Comparison & Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-4 flex flex-col gap-6"
                >
                    {/* Controls */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <label className="block text-sm font-medium text-slate-400 mb-4">
                            Number of Variables: <span className="text-white font-bold text-lg ml-2">{flagCount}</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="25"
                            value={flagCount}
                            onChange={(e) => setFlagCount(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>1</span>
                            <span>8 (1 Byte)</span>
                            <span>16 (2 Bytes)</span>
                            <span>24 (3 Bytes)</span>
                        </div>
                    </div>

                    {/* Efficiency Card */}
                    <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden group flex-1">
                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />

                        <Zap size={48} className="mx-auto mb-4 text-yellow-400" />
                        <h2 className="text-3xl font-bold mb-2 text-white">Efficiency</h2>
                        <p className="text-slate-400 mb-8">Real-time storage comparison</p>

                        {/* Visual Bar Chart */}
                        <div className="flex items-end justify-center gap-8 h-48 mb-8">
                            <div className="w-16 flex flex-col items-center gap-2 group/bar">
                                <span className="text-xs text-slate-500">{traditionalSize}B</span>
                                <div className="w-full bg-rose-500/20 rounded-t-lg relative h-full w-full overflow-hidden">
                                    <motion.div
                                        className="absolute bottom-0 w-full bg-rose-500"
                                        initial={{ height: 0 }}
                                        animate={{ height: '100%' }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-rose-400">JSON</span>
                            </div>

                            <div className="w-16 flex flex-col items-center gap-2">
                                <span className="text-xs text-slate-500">{byteFlagsSize}B</span>
                                <div className="w-full bg-emerald-500/20 rounded-t-lg relative h-full w-full overflow-hidden">
                                    <motion.div
                                        className="absolute bottom-0 w-full bg-emerald-500"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max((byteFlagsSize / traditionalSize) * 100 * 20, 2)}%` }}
                                        style={{ minHeight: '4px' }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-emerald-400">Byte</span>
                            </div>
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                            <div className="text-4xl font-bold text-white mb-1">{savings}%</div>
                            <div className="text-emerald-400 text-sm uppercase tracking-wider">Storage Savings</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: ByteFlags */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
                        <Cpu size={100} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-emerald-200">The New Way</h2>
                    <p className="text-sm text-slate-400 mb-6">Bit-packing with ByteFlags.</p>

                    <div className="space-y-2 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeFlagNames.map((name, index) => {
                            // Calculate which byte and bit this corresponds to for display
                            const byteIndex = Math.floor(index / 8);
                            const bitIndex = index % 8;
                            const isEnabled = ((byteValues[byteIndex] >> bitIndex) & 1) === 1;

                            return (
                                <Toggle
                                    key={name}
                                    label={name}
                                    checked={isEnabled}
                                    onChange={() => toggleByteFlag(index)}
                                    color="emerald"
                                />
                            );
                        })}
                    </div>

                    <div className="mt-auto bg-black/50 rounded-xl p-4 font-mono text-xs text-slate-400 border border-white/5">
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                            <span>Binary Output</span>
                            <span className="text-emerald-400">{byteFlagsSize} bytes</span>
                        </div>

                        <div className="space-y-4">
                            {Array.from({ length: Math.ceil(flagCount / 8) }).map((_, i) => (
                                <div key={i} className="grid grid-cols-2 gap-4 items-center">
                                    <div>
                                        <div className="text-[10px] uppercase text-slate-600 mb-1">Byte {i} (Dec)</div>
                                        <div className="text-xl font-bold text-white">{byteValues[i]}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase text-slate-600 mb-1">Binary</div>
                                        <div className="text-lg font-bold text-emerald-400 tracking-widest">
                                            {byteValues[i].toString(2).padStart(8, '0')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Extra Sections */}
            <section className="max-w-6xl mx-auto mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-900/30 p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                        <Gauge size={40} className="text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-3">Why Speed Matters</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Smaller payloads mean faster network transmission and reduced serialization overhead.
                            In high-frequency trading or real-time multiplayer games, every microsecond counts.
                        </p>
                    </div>
                    <div className="bg-slate-900/30 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                        <Server size={40} className="text-emerald-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-3">Database Efficiency</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Store 8 boolean columns as a single `TINYINT`. Reduce table size, index size, and I/O operations.
                            Perfect for user preferences, permissions, and feature flags.
                        </p>
                    </div>
                    <div className="bg-slate-900/30 p-8 rounded-3xl border border-white/5 hover:border-rose-500/30 transition-colors">
                        <Layers size={40} className="text-rose-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-3">Scalability</h3>
                        <p className="text-slate-400 leading-relaxed">
                            As your application grows, so does your data. Bit-packing ensures your storage requirements
                            grow linearly and efficiently, preventing bloat before it happens.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto mb-32 text-center">
                <h2 className="text-4xl font-bold text-white mb-12">Perfect For</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Gamepad2, label: "Game State" },
                        { icon: Shield, label: "Permissions" },
                        { icon: Cpu, label: "IoT Devices" },
                        { icon: Database, label: "User Prefs" }
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-3 hover:bg-white/10 transition-colors">
                            <Icon size={32} className="text-slate-300" />
                            <span className="font-medium text-white">{label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="text-center text-slate-500 pb-12">
                <p>© 2025 ByteFlags. Open Source on NPM.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
