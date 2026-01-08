import React from "react";
import { GlowingEffect } from "./ui/GlowingEffect";
import { cn } from "../lib/utils";

const SelectionCard = ({ icon: Icon, title, onClick, isActive, activeColor = "emerald" }) => {
    return (
        <div className="relative h-32 rounded-2xl cursor-pointer group" onClick={onClick}>
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
                variant={isActive ? "default" : "white"}
            />

            <div className={cn(
                "relative flex h-full flex-col items-center justify-center gap-3 rounded-2xl border transition-all p-4 z-10 backdrop-blur-sm",
                isActive
                    ? `bg-${activeColor}-50/50 border-${activeColor}-500/50 dark:bg-${activeColor}-900/10`
                    : "bg-white/80 dark:bg-[#212121] border-gray-200 dark:border-borderDark hover:border-gray-300 dark:hover:border-gray-700"
            )}>
                <div className={cn(
                    "p-3 rounded-xl transition-all shadow-sm",
                    isActive ? `bg-${activeColor}-100 dark:bg-${activeColor}-900/20` : "bg-gray-100 dark:bg-[#333333] group-hover:bg-gray-200 dark:group-hover:bg-gray-800"
                )}>
                    <Icon className={cn("w-6 h-6 transition-colors", isActive ? `text-${activeColor}-600 dark:text-${activeColor}-400` : "text-gray-500 dark:text-gray-400")} />
                </div>
                <span className={cn("text-xs font-bold uppercase tracking-wider transition-colors", isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>{title}</span>
            </div>
        </div>
    );
};

export default SelectionCard;
