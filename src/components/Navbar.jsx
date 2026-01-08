import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseData } from '../data';
import { Search, Moon, Sun, Menu, Code2 } from 'lucide-react';

const Navbar = ({ toggleSidebar, isDarkMode, toggleTheme }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    // Flatten course data for easier searching
    const searchContent = (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const results = [];
        const lowerQuery = query.toLowerCase();

        courseData.forEach(semester => {
            semester.subjects?.forEach(subject => {
                // Search in Subject
                if (subject.title.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        type: 'Subject',
                        title: subject.title,
                        path: `/${semester.id}/${subject.id}`,
                        location: `${semester.title}`
                    });
                }

                subject.chapters?.forEach(chapter => {
                    // Search in Chapter
                    if (chapter.title.toLowerCase().includes(lowerQuery)) {
                        results.push({
                            type: 'Chapter',
                            title: chapter.title,
                            path: `/${semester.id}/${subject.id}`, // Chapters don't have direct routes yet, go to subject
                            location: `${semester.title} > ${subject.title}`
                        });
                    }

                    chapter.topics?.forEach(topic => {
                        // Search in Topic
                        if (topic.title.toLowerCase().includes(lowerQuery)) {
                            results.push({
                                type: 'Topic',
                                title: topic.title,
                                path: `/${semester.id}/${subject.id}/${chapter.id}/${topic.id}`,
                                location: `${subject.title} > ${chapter.title}`
                            });
                        }
                    });
                });

                subject.practicals?.forEach(practical => {
                    // Search in Practical
                    if (practical.title.toLowerCase().includes(lowerQuery)) {
                        results.push({
                            type: 'Practical',
                            title: practical.title,
                            path: `/${semester.id}/${subject.id}/practicals/${practical.id}`,
                            location: `${subject.title} > Practicals`
                        });
                    }
                });
            });
        });

        setSearchResults(results.slice(0, 10)); // Limit to 10 results
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowResults(true);
        searchContent(query);
    };

    const handleResultClick = (path) => {
        navigate(path);
        setShowResults(false);
        setSearchQuery('');
    };

    return (
        <nav className="fixed top-0 w-full h-16 bg-white/80 dark:bg-[#262626]/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800 z-50 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300 supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <Link to="/" className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xl cursor-pointer">
                    <Code2 className="w-7 h-7" />
                    <span>NoteXplain</span>
                </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)} // Delay to allow click
                        placeholder="Search topics..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#181818] border border-transparent dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#181818] transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto overflow-x-hidden z-50">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleResultClick(result.path)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] border-b last:border-0 border-gray-100 dark:border-gray-800 transition-colors"
                                >
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{result.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate flex items-center gap-1">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${result.type === 'Subject' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            result.type === 'Topic' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                            {result.type}
                                        </span>
                                        {result.location}
                                    </p>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    title="Toggle Theme"
                >
                    {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>

            </div>
        </nav>
    );
};

export default Navbar;
