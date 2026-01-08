import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Book, Code, ArrowLeft, Layers, FlaskConical, Sun, Moon, Lock } from 'lucide-react';
import { UserGlowingCard } from './UserGlowingCard';
import { useTheme } from './ThemeContext';
import { courseData } from '../data';
import CodingUniverse from './CodingUniverse';

const SubjectSelect = () => {
    const { semesterId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const semester = courseData.find(s => s.id === semesterId);

    if (!semester) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Semester Not Found</h2>
                <Link to="/" className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
                    Back to Semesters
                </Link>
            </div>
        );
    }

    // Block access if semester is locked
    if (semester.locked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-slate-50 dark:bg-[#181818]">
                <div className="p-6 bg-orange-500/20 rounded-full border-2 border-orange-500/50 mb-6">
                    <Lock className="w-16 h-16 text-orange-400" />
                </div>
                <h2 className="text-3xl font-bold text-orange-400 mb-4">Content Locked</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    This semester is currently locked. Please contact the administrator for access.
                </p>
                <Link to="/semesters" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Semesters
                </Link>
            </div>
        );
    }

    const handleSubjectClick = (subjectId) => {
        // Navigate to the subject root, which will handle the redirect to the first topic
        navigate(`/${semesterId}/${subjectId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#181818] text-gray-900 dark:text-gray-100 font-sans p-6 sm:p-12 relative overflow-hidden">

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

            {/* Ambient Background Elements (Green/Blue Glows) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            {/* CodingUniverse Background - Same as Landing Page */}
            <CodingUniverse />

            <div className="max-w-5xl mx-auto relative z-10 pt-16">
                <Link to="/semesters" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Semesters
                </Link>

                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                        {semester.title}
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
                        {semester.description || "Select a subject to dive into the course material."}
                    </p>
                </header>

                {/* Theory Section */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Theory Subjects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {semester.subjects.map((subject) => (
                        <UserGlowingCard
                            key={subject.id}
                            title={subject.title}
                            description="Explore chapters, topics, and theory content."
                            icon={subject.id === 'algo' ? Code : Book}
                            subText={`${subject.chapters.length} Chapters`}
                            onClick={() => handleSubjectClick(subject.id)}
                            locked={subject.locked}
                        />
                    ))}
                </div>

                {/* Practical Section - Only render if there are any practicals */}
                {semester.subjects.some(s => s.practicals && s.practicals.length > 0) && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <FlaskConical className="w-6 h-6 text-emerald-600" />
                            Practical Labs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {semester.subjects
                                .filter(subject => subject.practicals && subject.practicals.length > 0)
                                .map((subject) => (
                                    <UserGlowingCard
                                        key={`${subject.id}-practical`}
                                        title={`${subject.title} Lab`}
                                        description="Access practical experiments and lab manuals."
                                        icon={FlaskConical}
                                        subText={`${subject.practicals.length} Practical${subject.practicals.length !== 1 ? 's' : ''}`}
                                        onClick={() => navigate(`/${semesterId}/${subject.id}/practicals/${subject.practicals[0].id}`)}
                                        locked={subject.locked}
                                    />
                                ))
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubjectSelect;

