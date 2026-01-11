import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeBlock = ({ code = 'typescript' }: { code: string, language?: string }) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copyToClipboard}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-slate-400" />}
                </button>
            </div>
            <pre className="bg-slate-900/50 border border-white/10 rounded-xl p-4 overflow-x-auto font-mono text-sm text-slate-300">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const Section = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <section id={id} className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-indigo-500 rounded-full"></span>
            {title}
        </h2>
        {children}
    </section>
);

function DocumentationPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 flex">

            {/* Sidebar */}
            <aside className="w-64 fixed h-screen border-r border-white/5 bg-[#050505]/90 backdrop-blur-xl hidden lg:block overflow-y-auto">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-8 hover:opacity-80 transition-opacity">
                        <ArrowLeft size={20} className="text-indigo-400" />
                        ByteFlags
                    </Link>

                    <nav className="space-y-1">
                        {[
                            { label: "Introduction", href: "#intro" },
                            { label: "Installation", href: "#installation" },
                            { label: "Basic Usage", href: "#usage" },
                            { label: "API Reference", href: "#api" },
                            { label: "Best Practices", href: "#best-practices" },
                        ].map(item => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 md:p-12 max-w-4xl mx-auto">
                <div className="lg:hidden mb-8">
                    <Link to="/" className="flex items-center gap-2 text-indigo-400 font-medium">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl font-bold text-white mb-6">Documentation</h1>
                    <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                        Everything you need to know to start using ByteFlags in your TypeScript/JavaScript projects.
                    </p>

                    <Section id="intro" title="Introduction">
                        <p className="mb-4 leading-relaxed">
                            <strong>ByteFlags</strong> is a zero-dependency, ultra-lightweight library designed to solve a specific problem:
                            storing multiple boolean states efficiently.
                        </p>
                        <p className="mb-4 leading-relaxed">
                            In traditional JavaScript, storing 8 boolean flags requires an object with 8 keys, taking up significant memory
                            and JSON payload size (approx. 150+ bytes). ByteFlags packs these 8 booleans into a single byte (number),
                            reducing the storage footprint to just 1 byte.
                        </p>
                    </Section>

                    <Section id="installation" title="Installation">
                        <p className="mb-4">Install via npm, yarn, or pnpm:</p>
                        <CodeBlock code="npm install byteflags" language="bash" />
                    </Section>

                    <Section id="usage" title="Basic Usage">
                        <p className="mb-4">Define your flags, create an instance, and start toggling.</p>
                        <CodeBlock code={`import { ByteFlags } from 'byteflags';

// 1. Define your flag mapping
const FLAGS = {
  DARK_MODE: 0,  // Bit 0
  NOTIFICATIONS: 1, // Bit 1
  AUTO_SAVE: 2   // Bit 2
};

// 2. Initialize (default 0)
const settings = new ByteFlags(FLAGS);

// 3. Modify state
settings.enable('DARK_MODE');
settings.toggle('NOTIFICATIONS');

// 4. Check state
if (settings.isEnabled('DARK_MODE')) {
  console.log("Dark mode is on!");
}

// 5. Get the raw byte for storage
const byteToStore = settings.getByte(); // e.g., 3 (00000011)`} />
                    </Section>

                    <Section id="api" title="API Reference">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Constructor</h3>
                                <code className="text-indigo-400">new ByteFlags(mapping: Record&lt;string, number&gt;, initialValue?: number)</code>
                                <p className="text-slate-400 mt-2">Creates a new instance. `mapping` defines the bit positions (0-7).</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Methods</h3>
                                <div className="grid gap-4">
                                    {[
                                        { name: "enable(flag)", desc: "Sets the flag's bit to 1." },
                                        { name: "disable(flag)", desc: "Sets the flag's bit to 0." },
                                        { name: "toggle(flag)", desc: "Inverts the flag's bit." },
                                        { name: "isEnabled(flag)", desc: "Returns true if the bit is 1." },
                                        { name: "getByte()", desc: "Returns the current integer value (0-255)." },
                                        { name: "setByte(value)", desc: "Updates the internal state from a raw number." },
                                        { name: "toBinaryString()", desc: "Returns the 8-bit binary string representation." },
                                    ].map(method => (
                                        <div key={method.name} className="bg-white/5 p-4 rounded-lg border border-white/5">
                                            <code className="text-emerald-400 font-mono">{method.name}</code>
                                            <p className="text-slate-400 mt-1 text-sm">{method.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section id="best-practices" title="Best Practices">
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>Use for <strong>user preferences</strong>, <strong>permissions</strong>, or <strong>feature flags</strong>.</li>
                            <li>Store the raw number in your database as `TINYINT` or `SMALLINT`.</li>
                            <li>Keep your flag mapping constant across your application to avoid data corruption.</li>
                            <li>For more than 8 flags, use multiple `ByteFlags` instances or an array of numbers.</li>
                        </ul>
                    </Section>

                </motion.div>
            </main>
        </div>
    );
}

export default DocumentationPage;
