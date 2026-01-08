
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronRight, Home, Copy, Check, Lock } from 'lucide-react';
import { courseData } from '../data';
import { GlassTable, TableHead, TableBody, TableRow, TableHeaderCell, TableCell, PremiumAlert, StyledList, StyledListItem } from './ArticleComponents';

const CodeBlock = ({ language, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const isOutput = language === 'output';

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`relative rounded-xl overflow-hidden my-0 border ${isOutput ? 'border-emerald-500/30' : 'border-gray-200 dark:border-gray-700'} shadow-xl bg-gray-900/90 dark:bg-[#1e1e1e]/60 backdrop-blur-md group ring-1 ring-white/10`}>
            <div className={`px-4 py-3 flex items-center justify-between border-b ${isOutput ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${isOutput ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {isOutput ? 'Output' : (language || 'Code')}
                </span>
                {!isOutput && (
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5 opacity-60 hover:opacity-100 transition-opacity mr-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-emerald-400 transition-colors"
                            title="Copy Code"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
            <div className="p-0">
                {isOutput ? (
                    <div className="p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap">
                        {String(children).replace(/\n$/, '')}
                    </div>
                ) : (
                    <SyntaxHighlighter
                        style={dracula}
                        language={language}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, background: 'transparent' }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                )}
            </div>
        </div>
    );
};

const ArticleView = () => {
    const { semesterId, subjectId, chapterId, topicId } = useParams();

    const semester = courseData.find(s => s.id === semesterId);
    const subject = semester?.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);

    let topic = null;
    let isPractical = false;

    if (chapterId === 'practicals') {
        topic = subject?.practicals?.find(p => p.id === topicId);
        isPractical = true;
    } else {
        topic = chapter?.topics?.find(t => t.id === topicId);
    }

    if (!topic) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Topic not found</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">The requested topic does not exist.</p>
                <Link to="/" className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
                    Go Home
                </Link>
            </div>
        );
    }

    // Check if content is locked (check topic, chapter, subject, or semester)
    const isLocked = topic.locked || chapter?.locked || subject?.locked || semester?.locked;

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-full mb-6">
                    <Lock className="w-16 h-16 text-orange-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Content Locked</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mb-6">
                    This content is currently unavailable and will be added soon. Check back later!
                </p>
                <div className="flex gap-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="article-content">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap gap-1">
                <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                    <Home className="w-4 h-4" /> Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{semester?.title}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{subject?.title}</span>
                <ChevronRight className="w-4 h-4" />
                {isPractical ? (
                    <>
                        <span className="text-gray-500">Practicals</span>
                        <ChevronRight className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        <span>{chapter?.title}</span>
                        <ChevronRight className="w-4 h-4" />
                    </>
                )}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{topic.title}</span>
            </nav>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-600 dark:prose-a:text-emerald-400 no-scrollbar">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    remarkRehypeOptions={{ allowDangerousHtml: true }}
                    components={{
                        mark: ({ node, ...props }) => (
                            <mark className="bg-transparent text-emerald-600 dark:text-emerald-400 font-bold" {...props} />
                        ),
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <CodeBlock language={match[1]} {...props}>
                                    {children}
                                </CodeBlock>
                            ) : (
                                <code className={`${className} bg-gray-100 dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-mono text-sm border border-gray-200 dark:border-gray-700`} {...props}>
                                    {children}
                                </code>
                            )
                        },
                        table: GlassTable,
                        thead: TableHead,
                        tbody: TableBody,
                        tr: TableRow,
                        th: TableHeaderCell,
                        td: TableCell,
                        blockquote: PremiumAlert,
                        ul: StyledList,
                        li: StyledListItem
                    }}
                >
                    {topic.content}
                </ReactMarkdown>
            </div>

            {/* Simple Pagination */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition text-gray-700 dark:text-gray-300">
                    &larr; Previous
                </button>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition shadow-sm hover:shadow-md">
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};

export default ArticleView;
