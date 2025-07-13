"use client";

import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface GithubButtonProps {
  onClick: () => void;
  className?: string;
}

export function GithubButton({ onClick, className }: GithubButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition",
        className
      )}
    >
      <Github size={18} />
      <span>Sign in with GitHub</span>
    </button>
  );
}
