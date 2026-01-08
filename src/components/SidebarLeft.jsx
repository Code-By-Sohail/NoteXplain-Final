import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, Hash, FlaskConical, Lock } from 'lucide-react';
import { courseData } from '../data';

const SidebarLeft = ({ closeSidebar }) => {
    const { semesterId, subjectId } = useParams();
    const [expandedChapters, setExpandedChapters] = useState({});

    // Find the current semester data
    const currentSemester = courseData.find(s => s.id === semesterId);

    // If no semester found or no subjects, show nothing or empty state
    if (!currentSemester) return null;

    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    return (
        <div className="h-full px-4 pb-20">
            <div className="mb-6 px-2">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {currentSemester.title}
                </h2>
                <p className="text-xs text-gray-400">Select a topic to start learning</p>
            </div>

            <nav className="space-y-6">
                {currentSemester.subjects
                    .filter(subject => !subjectId || subject.id === subjectId)
                    .map((subject) => (
                        <div key={subject.id} className="group/subject">
                            {/* Subject Header */}
                            <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-slate-100/80 dark:bg-[#212121]/40 rounded-lg text-emerald-800 dark:text-emerald-400 border border-slate-200/60 dark:border-borderDark/50 backdrop-blur-sm">
                                <BookOpen className="w-4 h-4 shrink-0" />
                                <h3 className="font-bold text-xs uppercase tracking-wider">{subject.title}</h3>
                            </div>

                            <ul className="space-y-[2px]">
                                {subject.chapters.map((chapter) => (
                                    <li key={chapter.id}>
                                        <button
                                            onClick={() => toggleChapter(chapter.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${chapter.locked ? 'opacity-60' : ''} ${expandedChapters[chapter.id]
                                                ? 'bg-white/80 dark:bg-[#212121] text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-borderDark'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-slate-100/50 dark:hover:bg-[#212121]/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {chapter.locked ? (
                                                    <Lock className="w-3.5 h-3.5 shrink-0 text-orange-500" />
                                                ) : (
                                                    <Hash className={`w-4 h-4 shrink-0 transition-colors ${expandedChapters[chapter.id] ? 'text-emerald-500' : 'text-gray-400'}`} />
                                                )}
                                                <span>{chapter.title}</span>
                                                {chapter.locked && <span className="text-xs text-orange-500 ml-1">(Coming Soon)</span>}
                                            </div>
                                            {expandedChapters[chapter.id] ? (
                                                <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />
                                            ) : (
                                                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                            )}
                                        </button>

                                        {/* Topics (Nested Tree View) */}
                                        {expandedChapters[chapter.id] && (
                                            <div className="relative ml-5 mt-1 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-1">
                                                {chapter.topics.map((topic) => (
                                                    <NavLink
                                                        key={topic.id}
                                                        to={topic.locked ? '#' : `/${semesterId}/${subject.id}/${chapter.id}/${topic.id}`}
                                                        onClick={topic.locked ? (e) => e.preventDefault() : closeSidebar}
                                                        className={({ isActive }) =>
                                                            `relative flex items-center gap-2 px-3 py-1.5 text-sm rounded-r-md transition-all duration-200 group/topic ${topic.locked ? 'opacity-60 cursor-not-allowed' : ''} ${isActive
                                                                ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50/50 dark:bg-emerald-900/10'
                                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                                                            }`
                                                        }
                                                    >
                                                        {({ isActive }) => (
                                                            <>
                                                                <div className={`absolute -left-[17px] top-1/2 -translate-y-1/2 w-3 h-px ${isActive ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                                                {topic.locked && <Lock className="w-3 h-3 shrink-0 text-orange-500" />}
                                                                <span className="truncate">{topic.title}</span>
                                                                {topic.locked && <span className="text-xs text-orange-500">(🔒)</span>}
                                                            </>
                                                        )}
                                                    </NavLink>
                                                ))}

                                                {/* Practicals */}
                                                {chapter.practicals && chapter.practicals.length > 0 && (
                                                    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                                                        <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Practicals</div>
                                                        {chapter.practicals.map((practical) => (
                                                            <NavLink
                                                                key={practical.id}
                                                                to={`/${semesterId}/${subject.id}/${chapter.id}/${practical.id}`}
                                                                onClick={closeSidebar}
                                                                className={({ isActive }) =>
                                                                    `relative flex items-center gap-2 px-3 py-1.5 text-sm rounded-r-md transition-all duration-200 group/practical ${isActive
                                                                        ? 'text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50/50 dark:bg-emerald-900/10'
                                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-emerald-900/5'
                                                                    }`
                                                                }
                                                            >
                                                                {({ isActive }) => (
                                                                    <>
                                                                        <div className={`absolute -left-[17px] top-1/2 -translate-y-1/2 w-3 h-px ${isActive ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                                                        <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                                                                        <span className="truncate">{practical.title}</span>
                                                                    </>
                                                                )}
                                                            </NavLink>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* Subject-level Practicals */}
                            {subject.practicals && subject.practicals.length > 0 && (
                                <div className="mt-4 px-3">
                                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <FlaskConical className="w-3.5 h-3.5" />
                                        <span>Practicals</span>
                                    </div>
                                    <div className="space-y-1 ml-1 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                        {subject.practicals.map((practical) => (
                                            <NavLink
                                                key={practical.id}
                                                to={`/${semesterId}/${subject.id}/practicals/${practical.id}`}
                                                onClick={closeSidebar}
                                                className={({ isActive }) =>
                                                    `relative flex items-center gap-2 py-1.5 text-sm transition-all duration-200 group/practical ${isActive
                                                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700 group-hover/practical:bg-emerald-400'}`}></span>
                                                        <span className="truncate">{practical.title}</span>
                                                    </>
                                                )}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </nav>
        </div>
    );
};

export default SidebarLeft;
