import React from 'react';
import { useParams } from 'react-router-dom';
import { courseData } from '../data';

const SidebarRight = () => {
    const { semesterId, subjectId, chapterId, topicId } = useParams();

    const semester = courseData.find(s => s.id === semesterId);
    const subject = semester?.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);
    const topic = chapter?.topics.find(t => t.id === topicId);

    if (!topic) return null;

    // Simple regex to find headers in markdown
    const headers = topic.content.match(/^#{1,3}\s(.+)$/gm)?.map(h => {
        const level = h.match(/^#+/)[0].length;
        const text = h.replace(/^#+\s/, '');
        // simple id generation
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return { level, text, id };
    }) || [];

    if (headers.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider">On this page</h3>
            <nav className="flex flex-col space-y-3 border-l border-gray-200 dark:border-gray-800 pl-4">
                {headers.map((header, idx) => (
                    <a
                        key={idx}
                        href={`#`}
                        onClick={(e) => {
                            e.preventDefault();
                            // In a real app we would use ids on the headings
                        }}
                        className={`text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${header.level === 3 ? 'pl-4' : ''}`}
                    >
                        {header.text}
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default SidebarRight;
