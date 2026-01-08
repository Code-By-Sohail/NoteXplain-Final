import React from 'react';
import { Github, Linkedin, Twitter, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full relative mt-auto border-t border-gray-200/50 dark:border-gray-800 bg-white/60 dark:bg-[#1a1a1a]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg shadow-emerald-500/20">
                                <div className="w-4 h-4 rounded-full border-2 border-white/20" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                NoteXplain
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                            Open-source engineering platform built for students, by students.
                            Curated notes, practicals, and code snippets to help you ace your exams.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li>
                                <Link to="/semesters" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                    Start Learning
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200/50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <p>© 2025 NoteXplain. Open Source.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                        <span>for Engineers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
