import React from 'react';
import { BrainCircuit } from 'lucide-react';

const CodingUniverse = ({ isLanding = false }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-[1200px]">

            {/* Background Matrix-like Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />

            {/* 3D Code Block 1 (JAVA) - Top Left - Core Object Oriented */}
            <div className="hidden md:block absolute top-[15%] left-[5%] animate-float-slow transform rotate-y-12 rotate-z-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-[#1e1e1e]/90 text-xs font-mono p-4 rounded-lg border border-orange-500/30 shadow-2xl text-gray-800 dark:text-gray-300 w-64 backdrop-blur-sm group transition-colors duration-300">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold tracking-wider">JAVA</span>
                    </div>
                    <div><span className="text-orange-600 dark:text-orange-400">public class</span> <span className="text-yellow-600 dark:text-yellow-300">Engineering</span> {'{'}</div>
                    <div className="pl-4"><span className="text-orange-600 dark:text-orange-400">public static void</span> <span className="text-blue-600 dark:text-blue-300">main</span>(String[] args) {'{'}</div>
                    <div className="pl-8">System.out.<span className="text-blue-600 dark:text-blue-300">println</span>(<span className="text-green-600 dark:text-green-300">"Hello Engineer"</span>);</div>
                    <div className="pl-4">{'}'}</div>
                    <div>{'}'}</div>
                </div>
            </div>

            {/* 3D Code Block 2 (PYTHON) - Bottom Right - Data Science/AI */}
            <div className={`hidden md:block absolute ${isLanding ? 'bottom-[35%]' : 'bottom-[20%]'} right-[5%] animate-float-slower transform -rotate-y-12 -rotate-z-6 opacity-60 hover:opacity-100 transition-opacity duration-300`}>
                <div className="bg-white/90 dark:bg-[#1e1e1e]/90 text-xs font-mono p-4 rounded-lg border border-blue-500/30 shadow-2xl text-gray-800 dark:text-gray-300 w-56 backdrop-blur-sm group transition-colors duration-300">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-wider">PYTHON</span>
                    </div>
                    <div><span className="text-blue-600 dark:text-blue-400">def</span> <span className="text-yellow-600 dark:text-yellow-300">learn_concept</span>(subject):</div>
                    <div className="pl-4"><span className="text-purple-600 dark:text-purple-400">if</span> subject == <span className="text-green-600 dark:text-green-300">"Hard"</span>:</div>
                    <div className="pl-8"><span className="text-purple-600 dark:text-purple-400">return</span> <span className="text-orange-600 dark:text-orange-400">NoteXplain.simplify()</span></div>
                    <div className="pl-4"><span className="text-purple-600 dark:text-purple-400">print</span>(<span className="text-green-600 dark:text-green-300">"Easy!"</span>)</div>
                </div>
            </div>

            {/* 3D Code Block 3 (C++) - Top Right - System Programming */}
            <div className="hidden md:block absolute top-[20%] right-[10%] animate-pulse-slow transform rotate-y-6 rotate-z-3 opacity-50 hover:opacity-90 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-[#1e1e1e]/80 text-xs font-mono p-3 rounded-lg border border-purple-500/30 shadow-xl text-gray-800 dark:text-gray-300 w-56 backdrop-blur-sm group transition-colors duration-300">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700/50 pb-1">
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">C++</span>
                    </div>
                    <div><span className="text-orange-600 dark:text-orange-400">#include</span> <span className="text-green-600 dark:text-green-300">&lt;notexplain&gt;</span></div>
                    <div><span className="text-blue-600 dark:text-blue-400">void</span> <span className="text-yellow-600 dark:text-yellow-300">pass_exam</span>() {'{'}</div>
                    <div className="pl-4"><span className="text-purple-600 dark:text-purple-400">while</span>(exam_near) {'{'}</div>
                    <div className="pl-8">NoteXplain::<span className="text-blue-600 dark:text-blue-300">read</span>();</div>
                    <div className="pl-8">confidence<span className="text-orange-600 dark:text-orange-400">++</span>;</div>
                    <div className="pl-4">{'}'}</div>
                    <div>{'}'}</div>
                </div>
            </div>

            {/* Database/Server Badge */}
            <div className="absolute bottom-[15%] right-[25%] animate-pulse-slow">
                <div className="w-14 h-14 bg-emerald-500/10 backdrop-blur-md rounded-xl border border-emerald-500/30 flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform">
                    <BrainCircuit className="w-8 h-8 text-emerald-400" />
                </div>
            </div>

        </div>
    );
};

export default CodingUniverse;
