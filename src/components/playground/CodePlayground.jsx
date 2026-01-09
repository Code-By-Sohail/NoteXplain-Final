import React, { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, Code2, Cpu, CheckCircle2, Sparkles } from 'lucide-react';
import { executeCode, LANGUAGE_VERSIONS } from './api';

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


    const handleLanguageChange = (e) => {
        const lang = e.target.value;
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


    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col items-center justify-center relative">

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
            </div>

            {/* Main IDE Container */}
            <div className="relative z-10 w-full max-w-[95%] h-[90vh] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden ring-1 ring-white/5">

                {/* Left Panel: Editor */}
                <div className="flex-1 flex flex-col border-r border-white/10 min-w-0">

                    {/* Editor Toolbar */}
                    <div className="h-14 px-6 flex items-center justify-between bg-white/5 border-b border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Code2 className="w-5 h-5" />
                                <span className="font-bold tracking-wider text-sm">EDITOR</span>
                            </div>

                            {/* Language Selector */}
                            <div className="relative group">
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="appearance-none bg-black/30 text-gray-300 pl-3 pr-8 py-1.5 rounded-lg border border-white/10 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:bg-black/50 transition-colors cursor-pointer uppercase tracking-wider"
                                >
                                    {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                                        <option key={lang} value={lang} className="bg-[#1e1e1e]">
                                            {lang.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Cpu className="w-3 h-3 text-gray-500" />
                                </div>
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
