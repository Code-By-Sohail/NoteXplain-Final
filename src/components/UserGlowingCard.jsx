import React from "react";
import { GlowingEffect } from "./ui/GlowingEffect";
import { cn } from "../lib/utils";
import { Lock } from "lucide-react";

export const UserGlowingCard = ({
    title,
    description,
    icon: Icon,
    subText,
    onClick,
    disabled = false,
    locked = false
}) => {
    const isBlocked = disabled || locked;

    const handleClick = () => {
        if (locked) {
            alert('🔒 This content is locked. Contact administrator for access.');
            return;
        }
        if (!disabled && onClick) {
            onClick();
        }
    };

    return (
        <div
            className={cn(
                "relative min-h-[10rem] rounded-[1.25rem] group cursor-pointer list-none",
                isBlocked && "cursor-not-allowed"
            )}
            onClick={handleClick}
        >
            {/* Lock Overlay for locked content */}
            {locked && (
                <div className="absolute inset-0 z-20 rounded-[1.25rem] bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 animate-pulse">
                        <div className="p-3 bg-orange-500/20 rounded-full border-2 border-orange-500/50">
                            <Lock className="w-8 h-8 text-orange-400" />
                        </div>
                        <span className="text-sm font-bold text-orange-400 bg-black/50 px-3 py-1 rounded-full">
                            Content Locked
                        </span>
                    </div>
                </div>
            )}

            <div className={cn(
                "relative h-full rounded-[1.25rem] border-[0.75px] border-gray-200 dark:border-gray-800 p-2 md:rounded-[1.5rem] md:p-3",
                locked && "opacity-60 grayscale"
            )}>
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={isBlocked}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-xl border-[0.75px] p-5 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(30,30,30,0.3)] md:p-5 bg-white/60 dark:bg-[#212121] border-white/40 dark:border-gray-800 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="flex items-start justify-between">
                            <div className="w-fit rounded-lg border-[0.75px] border-gray-200/50 dark:border-gray-700 bg-white dark:bg-[#333333] p-2 text-black dark:text-white shadow-sm">
                                {Icon && <Icon className="h-5 w-5" />}
                            </div>
                            {subText && (
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-gray-800 px-2 py-1 rounded-md">
                                    {subText}
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {title}
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-600 dark:text-gray-400">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

