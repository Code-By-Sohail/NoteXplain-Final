import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Code2, BrainCircuit, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

import CodingUniverse from './CodingUniverse';
import Footer from './Footer';

const OrbitingElements = () => null; // Deprecated placeholder

const FloatingIcons = () => null; // Deprecated placeholder

const LandingPage = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#181818] text-gray-900 dark:text-white font-sans transition-colors duration-300 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Theme Toggle Button */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/20 transition-all group"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ?
                        <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-500" /> :
                        <Moon className="w-5 h-5 text-slate-700 dark:text-gray-300 group-hover:-rotate-12 transition-transform duration-500" />
                    }
                </button>
            </div>

            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <CodingUniverse isLanding={true} />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-10">

                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-[#262626]/50 backdrop-blur-md border border-emerald-100 dark:border-emerald-900/30 shadow-lg mb-4 animate-fade-in-up hover:scale-105 transition-transform cursor-default">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                        Platform for Engineering
                    </span>
                </div>

                {/* Hero Title */}
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] drop-shadow-2xl">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
                            Engineering
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-400">
                            Made Simple.
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                    Stop struggling with random resources. Get <span className="text-emerald-600 dark:text-emerald-400 font-bold">handpicked notes</span>, practicals, and code snippets all in one place.
                </p>

                {/* Feature Grid (Enhanced) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
                    {[
                        { icon: BookOpen, label: "Smart Notes", desc: "Exam-focused" },
                        { icon: Code2, label: "Live Coding", desc: "Practice Logic" },
                        { icon: GraduationCap, label: "Toppers' Choice", desc: "Trusted Content" },
                        { icon: BrainCircuit, label: "Quick Revision", desc: "Last Minute" }
                    ].map((feature, idx) => (
                        <div key={idx} className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/60 dark:bg-[#262626]/40 border border-white/40 dark:border-white/5 backdrop-blur-md hover:bg-white/80 dark:hover:bg-[#262626]/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-8 h-8 text-gray-700 dark:text-gray-300 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-gray-800 dark:text-gray-200">{feature.label}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-500 font-medium uppercase tracking-wider mt-1">{feature.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button (Terminal Style) */}
                <div className="pt-12 pb-12">
                    <button
                        onClick={() => navigate('/semesters')}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white bg-black dark:bg-[#1a1a1a] border border-gray-800 hover:border-emerald-500 rounded-lg overflow-hidden transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 font-mono"
                    >
                        <span className="text-emerald-500 mr-1">{`>`}</span>
                        <span>Start_Journey()</span>
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-500 group-hover:w-full transition-all duration-300" />
                    </button>

                    <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 font-mono">
                        // open source • no signup needed
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LandingPage;
