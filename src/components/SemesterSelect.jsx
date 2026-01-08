import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, GraduationCap, Sun, Moon } from 'lucide-react';
import { courseData } from '../data';
import { UserGlowingCard } from './UserGlowingCard';
import { useTheme } from './ThemeContext';
import CodingUniverse from './CodingUniverse';

const SemesterSelect = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleSemesterClick = (semesterId) => {
        navigate(`/${semesterId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#181818] text-gray-900 dark:text-white font-sans pt-32 pb-12 px-6 sm:px-12 relative overflow-hidden transition-colors duration-300">

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

            {/* Unified Coding Universe Background */}
            <div className="hidden dark:block md:dark:block md:block">
                <CodingUniverse />
            </div>

            {/* Tech Grid Pattern for Light Mode */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            {/* Ambient Background Elements (Green/Blue Glows) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>



            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-3 mb-6 p-2 rounded-2xl bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900 dark:from-white dark:to-gray-400 pr-2">
                            NotesXplain
                        </h1>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">Semester</span>
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Navigate to your current academic level to access curated <span className="text-emerald-600 dark:text-emerald-400">notes</span>, <span className="text-blue-600 dark:text-blue-400">practicals</span>, and <span className="text-cyan-600 dark:text-cyan-400">resources</span>.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up delay-100">
                    {courseData.map((semester) => (
                        <UserGlowingCard
                            key={semester.id}
                            title={semester.title}
                            description={semester.description}
                            icon={Calendar}
                            subText={`${semester.subjects.length} Modules`}
                            onClick={() => handleSemesterClick(semester.id)}
                            locked={semester.locked}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SemesterSelect;
