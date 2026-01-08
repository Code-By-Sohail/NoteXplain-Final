import React from 'react';
import { AlertCircle, Info, CheckCircle, Flame, ArrowRight } from 'lucide-react';

// --- Glass Table Component ---
export const GlassTable = (props) => {
    return (
        <div className="my-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left" {...props} />
            </div>
        </div>
    );
};

export const TableHead = (props) => (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 dark:text-gray-300" {...props} />
);

export const TableBody = (props) => (
    <tbody className="divide-y divide-gray-100 dark:divide-gray-800" {...props} />
);

export const TableRow = (props) => (
    <tr className="bg-white/40 dark:bg-transparent hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors duration-200" {...props} />
);

export const TableHeaderCell = (props) => (
    <th className="px-6 py-4 font-bold tracking-wider" {...props} />
);

export const TableCell = (props) => (
    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 whitespace-pre-wrap" {...props} />
);


// --- Premium Alert / Blockquote Component ---
export const PremiumAlert = (props) => {
    // Check if the content starts with a specific marker to determine type
    // We expect the markdown to be like: "> [!TIP] This is a tip"
    // ReactMarkdown might pass children differently, so we need to be careful.

    // For simplicity with standard blockquotes (if no plugin is used):
    // We will just style all blockquotes as "Pro Tips" for now, 
    // or try to detect markers if plain text.

    return (
        <div className="relative my-8 rounded-r-xl rounded-l-[4px] border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/20 dark:to-transparent p-6 shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

            <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                    <Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="prose-p:m-0 text-gray-700 dark:text-gray-300 italic relative z-10">
                    {props.children}
                </div>
            </div>
        </div>
    );
};


// --- Styled List Component ---
export const StyledList = (props) => {
    return (
        <ul className="my-6 space-y-3" {...props} />
    );
};

export const StyledListItem = (props) => {
    return (
        <li className="flex gap-3 text-gray-700 dark:text-gray-300 items-start group">
            <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-emerald-400 group-hover:scale-125 transition-all duration-300" />
            <span className="leading-relaxed">{props.children}</span>
        </li>
    );
};
