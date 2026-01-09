import React, { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, Code2, CheckCircle2, Sparkles } from 'lucide-react';
import { executeCode, LANGUAGE_VERSIONS } from './api';

// --- Official Style Language Icons ---
const Icons = {
    C: ({ className }) => (
        <svg viewBox="0 0 128 128" className={className}>
            <path fill="#659AD2" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z" />
            <path fill="#03599C" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z" />
            <path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z" />
        </svg>
    ),
    Cpp: ({ className }) => (
        <svg viewBox="0 0 128 128" className={className}>
            <path fill="#D26383" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z" />
            <path fill="#9C033A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z" />
            <path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM82 61.3h5.2v-5.3h4.4v5.3H97v4.4h-5.4v5.3h-4.4v-5.3H82v-4.4zm23.8 0h5.2v-5.3h4.4v5.3H121v4.4h-5.6v5.3h-4.4v-5.3h-5.2v-4.4z" />
        </svg>
    ),
    Python: ({ className }) => (
        <svg viewBox="0 0 128 128" className={className}>
            <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
                <stop offset="0" stopColor="#5A9FD4" />
                <stop offset="1" stopColor="#306998" />
            </linearGradient>
            <linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
                <stop offset="0" stopColor="#FFD43B" />
                <stop offset="1" stopColor="#FFE873" />
            </linearGradient>
            <path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)" />
            <path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)" />
        </svg>
    ),
    Java: ({ className }) => (
        <svg viewBox="0 0 128 128" className={className}>
            <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z" />
            <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z" />
            <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z" />
            <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z" />
            <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z" />
        </svg>
    ),
    JS: ({ className }) => (
        <svg viewBox="0 0 128 128" className={className}>
            <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z" />
            <path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z" />
        </svg>
    ),
};


const CodePlayground = () => {
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(`# Welcome to NotesXplain Playground
# Write your Python code here

def engineering_life():
    coffee = True
    bugs = True
    while bugs:
        if coffee:
            print("Fixing bugs...")
            bugs = False
            print("Deployed! 🚀")
        else:
            print("Need more coffee ☕")

engineering_life()
`);
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const editorRef = useRef();

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();

        // Add "Paste Code" action to context menu to fix browser permission issues
        editor.addAction({
            id: 'custom-paste-action',
            label: 'Paste Code',
            contextMenuGroupId: '9_cutcopypaste',
            contextMenuOrder: 2,
            run: async (ed) => {
                try {
                    const text = await navigator.clipboard.readText();
                    const selection = ed.getSelection();
                    const op = {
                        range: selection,
                        text: text,
                        forceMoveMarkers: true
                    };
                    ed.executeEdits("my-source", [op]);
                } catch (err) {
                    console.error('Failed to read clipboard contents: ', err);
                    alert("Clipboard access denied. Please allow clipboard permissions or use Ctrl+V.");
                }
            }
        });
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (editorRef.current) {
                const selection = editorRef.current.getSelection();
                const id = { major: 1, minor: 1 };
                const op = {
                    identifier: id,
                    range: selection,
                    text: text,
                    forceMoveMarkers: true
                };
                editorRef.current.executeEdits("my-source", [op]);
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            alert("Clipboard access denied. Please allow clipboard permissions or use Ctrl+V.");
        }
    };

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;

        setIsLoading(true);
        setIsError(false);
        setOutput(null);

        try {
            const { run: result } = await executeCode(language, sourceCode);
            setOutput(result.output.split('\n'));
            setIsError(!!result.stderr);
        } catch (error) {
            console.error(error);
            setIsError(true);
            setOutput(["Error connecting to execution server."]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleLanguageChange = (lang) => {
        setLanguage(lang);

        const snippets = {
            python: `print("Hello from Python! 🐍")`,
            c: `#include <stdio.h>\n\nint main() {\n    printf("Hello from C! 🚀");\n    return 0;\n}`,
            cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++! ⚡" << std::endl;\n    return 0;\n}`,
            java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java! ☕");\n    }\n}`,
            javascript: `console.log("Hello from JavaScript! 💛");`
        };

        setCode(snippets[lang] || '');
    };

    const LANGUAGES = [
        { id: 'c', name: 'C', icon: Icons.C, color: 'text-blue-500' },
        { id: 'cpp', name: 'C++', icon: Icons.Cpp, color: 'text-blue-400' },
        { id: 'python', name: 'Python', icon: Icons.Python, color: 'text-yellow-400' },
        { id: 'java', name: 'Java', icon: Icons.Java, color: 'text-orange-500' },
        { id: 'javascript', name: 'JS', icon: Icons.JS, color: 'text-yellow-300' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col items-center justify-center relative">

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
            </div>

            {/* Main IDE Container */}
            <div className="relative z-10 w-full max-w-[95%] h-[90vh] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-row overflow-hidden ring-1 ring-white/5">

                {/* Sidebar - Language Selector */}
                <div className="w-16 bg-black/20 border-r border-white/5 flex flex-col items-center py-6 gap-4 backdrop-blur-md">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => handleLanguageChange(lang.id)}
                            className={`p-3 rounded-xl transition-all duration-300 group relative ${language === lang.id
                                ? 'bg-white/10 shadow-lg scale-110'
                                : 'hover:bg-white/5 hover:scale-105 opacity-60 hover:opacity-100'
                                }`}
                            title={lang.name}
                        >
                            <lang.icon className={`w-6 h-6 ${language === lang.id ? lang.color : 'text-gray-400 group-hover:text-white'}`} />

                            {/* Tooltip */}
                            <span className="absolute left-14 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {lang.name}
                            </span>

                            {/* Active Indicator */}
                            {language === lang.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Left Panel: Editor */}
                <div className="flex-1 flex flex-col border-r border-white/10 min-w-0">

                    {/* Editor Toolbar */}
                    <div className="h-14 px-6 flex items-center justify-between bg-white/5 border-b border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Code2 className="w-5 h-5" />
                                <span className="font-bold tracking-wider text-sm">EDITOR</span>
                            </div>

                            {/* Current Language Badge (since dropdown is gone) */}
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-gray-400 uppercase tracking-widest">
                                {language}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePaste}
                                className="px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all border border-white/5"
                                title="Paste from Clipboard"
                            >
                                Paste
                            </button>

                            <button
                                onClick={() => setCode('')}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                title="Reset Code"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>

                            <button
                                onClick={runCode}
                                disabled={isLoading}
                                className={`
                                    relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-all duration-300
                                    ${isLoading
                                        ? 'bg-emerald-600/20 text-emerald-400/50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white hover:shadow-emerald-500/25 hover:scale-105 active:scale-95'
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <Sparkles className="w-4 h-4 animate-spin" />
                                        <span>Running...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-white" />
                                        <span>Run Code</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor Wrapper */}
                    <div className="flex-1 relative bg-[#1e1e1e]/50">
                        <Editor
                            height="100%"
                            language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                            value={code}
                            theme="vs-dark"
                            onChange={(value) => setCode(value || "")}
                            onMount={onMount}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 15,
                                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                fontLigatures: true,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 24, bottom: 24 },
                                lineNumbers: 'on',
                                renderLineHighlight: 'line',
                                cursorBlinking: 'smooth',
                                smoothScrolling: true,
                                contextmenu: true,
                                mouseWheelZoom: true,
                                formatOnPaste: true,
                                formatOnType: true
                            }}
                        />
                    </div>
                </div>

                {/* Right Panel: Output Terminal */}
                <div className={`md:w-[40%] w-full bg-[#0d1117] flex flex-col border-l border-white/5 relative`}>

                    {/* Terminal Header */}
                    <div className="h-14 px-5 flex items-center justify-between bg-white/5 border-b border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Terminal className="w-4 h-4" />
                            <span className="font-bold text-xs tracking-widest">TERMINAL OUTPUT</span>
                        </div>
                        {output && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                                <div className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                                <span className={`text-[10px] uppercase font-bold ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {isError ? 'Error' : 'Success'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Output Content */}
                    <div className="flex-1 p-6 font-mono text-sm overflow-auto custom-scrollbar relative group">
                        {output ? (
                            <div className="space-y-1 animate-fade-in">
                                <div className="text-gray-500 text-xs mb-4 select-none flex items-center gap-2">
                                    <span>$</span>
                                    <span>executing {language}_script...</span>
                                </div>
                                {output.map((line, i) => (
                                    <div key={i} className={`${isError ? 'text-red-400' : 'text-gray-300'} whitespace-pre-wrap break-words leading-relaxed`}>
                                        {line}
                                    </div>
                                ))}
                                <div className="mt-4 flex items-center gap-2 text-emerald-500/50 text-xs select-none">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Process finished</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600/50 space-y-4 select-none">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
                                    <Play className="w-6 h-6 ml-1 opacity-50" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-500">Ready to execute</p>
                                    <p className="text-xs text-gray-600 mt-1">Press Run to compile & execute</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePlayground;
