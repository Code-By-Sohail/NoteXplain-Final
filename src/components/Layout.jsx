import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';

import { useTheme } from '../components/ThemeContext';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Initial theme effect handled by ThemeProvider now

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#181818] text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
                {/* Additional Light Mode Ambient */}
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-500/5 dark:bg-purple-500/0 rounded-full blur-[80px]" />
            </div>
            <Navbar
                toggleSidebar={toggleSidebar}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
            />

            <div className="pt-16 flex max-w-screen-2xl mx-auto h-[calc(100vh)]">
                {/* Left Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-72 pt-16 bg-white/80 dark:bg-[#181818] backdrop-blur-md border-r border-gray-200/50 dark:border-borderDark transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static overflow-y-auto no-scrollbar ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarLeft closeSidebar={() => setIsSidebarOpen(false)} />
                </aside>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0 overflow-y-auto scroll-smooth">
                    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 lg:px-12 pb-24">
                        <Outlet />
                    </div>
                </main>

                {/* Right Sidebar (Desktop only) */}
                <aside className="hidden xl:block w-64 pt-8 sticky top-0 h-full overflow-y-auto pr-6">
                    <SidebarRight />
                </aside>
            </div>
        </div>
    );
};

export default Layout;
