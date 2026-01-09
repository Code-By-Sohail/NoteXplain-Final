import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 
               MNIMALIST NX LOGO
               Concept: "N" and "X" merged.
               1. Left vertical bar of N.
               2. The diagonal strokes crossing to form X and N's middle.
               3. Right vertical bar of N.
            */}

            {/* Left Vertical Bar */}
            <path
                d="M20 15 V85"
                className="stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth="14"
                strokeLinecap="butt"
            />

            {/* Right Vertical Bar */}
            <path
                d="M80 15 V85"
                className="stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth="14"
                strokeLinecap="butt"
            />

            {/* Diagonal: Top-Left to Bottom-Right (Part of N and X) */}
            <path
                d="M20 15 L80 85"
                className="stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth="14"
                strokeLinecap="butt"
            />

            {/* Diagonal: Top-Right to Bottom-Left (Completes X) */}
            {/* To avoid cluttering the N, we can make this 'under' or 'over'. 
                For a clean vector symbol, we just draw it. */}
            <path
                d="M80 15 L20 85"
                className="stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth="14"
                strokeLinecap="butt"
            />
        </svg>
    );
};

export default Logo;
