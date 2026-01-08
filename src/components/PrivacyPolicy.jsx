import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Cookie, Mail, Calendar } from 'lucide-react';
import { useTheme } from './ThemeContext';
import CodingUniverse from './CodingUniverse';

const PrivacyPolicy = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#181818] text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden">
            {/* Background */}
            <div className="hidden dark:block">
                <CodingUniverse />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="bg-white/80 dark:bg-[#212121]/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-800">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Privacy Policy
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                Last updated: January 8, 2026
                            </p>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8 text-gray-700 dark:text-gray-300">

                        {/* Introduction */}
                        <section>
                            <p className="text-lg leading-relaxed">
                                Welcome to <strong className="text-emerald-600 dark:text-emerald-400">NotesXplain</strong>.
                                We are committed to protecting your privacy and ensuring you have a positive experience on our website.
                                This policy outlines how we collect, use, and protect your information.
                            </p>
                        </section>

                        {/* Information Collection */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-emerald-500" />
                                Information We Collect
                            </h2>
                            <ul className="space-y-3 ml-6">
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                                    <span><strong>Usage Data:</strong> We may collect information about how you access and use our website, including your IP address, browser type, pages visited, and time spent.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                                    <span><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your browsing experience.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Cookie className="w-5 h-5 text-emerald-500" />
                                Cookies & Advertising
                            </h2>
                            <p className="mb-4">
                                We may use third-party advertising companies (such as Google AdSense) to serve ads when you visit our website.
                                These companies may use cookies to serve ads based on your prior visits to our website or other websites.
                            </p>
                            <p>
                                You can opt out of personalized advertising by visiting{' '}
                                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                    Google Ads Settings
                                </a>.
                            </p>
                        </section>

                        {/* How We Use Information */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                How We Use Your Information
                            </h2>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                                    To provide and maintain our educational content
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                                    To improve our website and user experience
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                                    To analyze usage patterns and trends
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                                    To display relevant advertisements
                                </li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Data Security
                            </h2>
                            <p>
                                We implement appropriate security measures to protect your personal information.
                                However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        {/* Third Party Links */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Third-Party Links
                            </h2>
                            <p>
                                Our website may contain links to external sites that are not operated by us.
                                We have no control over the content and practices of these sites and are not responsible for their privacy policies.
                            </p>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-emerald-500" />
                                Contact Us
                            </h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:{' '}
                                <a href="mailto:0001xyzxyz@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                    0001xyzxyz@gmail.com
                                </a>
                            </p>
                        </section>

                        {/* Changes */}
                        <section className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Changes to This Policy
                            </h2>
                            <p className="text-sm">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                                You are advised to review this page periodically for any changes.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
