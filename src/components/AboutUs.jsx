import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Code, BookOpen, Users, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

const AboutUs = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#181818] text-gray-900 dark:text-gray-100 font-sans p-6 sm:p-12 relative overflow-hidden transition-colors duration-300">

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Header / Nav */}
            <div className="flex justify-between items-center relative z-10 mb-12">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-sm transition-all border border-gray-200/50 dark:border-gray-700 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/20 transition-all group"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ?
                        <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-500" /> :
                        <Moon className="w-5 h-5 text-slate-700 dark:text-gray-300 group-hover:-rotate-12 transition-transform duration-500" />
                    }
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto relative z-10 animate-fade-in-up">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            About NoteXplain
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Simplifying engineering education, one line of code at a time.
                    </p>
                </div>

                {/* Glass Card */}
                <div className="bg-white/60 dark:bg-[#1e1e1e]/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/40 dark:border-gray-700 shadow-xl space-y-10">

                    {/* Section 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                            <Code className="w-6 h-6" />
                            <h2 className="text-xl font-bold uppercase tracking-wider">Made by Engineers</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We know the struggle. The night before exams, the endless search for decent notes, the confusing tutorials.
                            **NoteXplain** was born out of that frustration. We built this platform to be the resource we wished we had.
                        </p>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-gray-700/50" />

                    {/* Section 2 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                            <BookOpen className="w-6 h-6" />
                            <h2 className="text-xl font-bold uppercase tracking-wider">Why NoteXplain?</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Most educational sites are cluttered and complex. We keep it **simple**.
                            No signups, no paywalls, no nonsense. Just high-quality notes, practical codes, and easy explanations
                            tailored specifically for your syllabus.
                        </p>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-gray-700/50" />

                    {/* Section 3 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-fuchsia-600 dark:text-fuchsia-400">
                            <Heart className="w-6 h-6" />
                            <h2 className="text-xl font-bold uppercase tracking-wider">Our Mission</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            To make quality engineering education accessible to everyone. We believe knowledge should be free and easy to find.
                            This is an **Open Source** initiative, and we welcome contributions from students like you.
                        </p>
                    </div>

                </div>

                {/* Footer Note */}
                <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-500 font-medium">
                    <p>Designed with ❤️ for the community.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
