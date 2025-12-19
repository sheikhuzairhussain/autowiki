"use client";

import { Book, GitBranch, Sparkles, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateProject: () => void;
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5">
        {/* Card */}
        <div className="relative w-full max-w-sm overflow-hidden rounded-lg border bg-card/50 p-6 shadow-lg backdrop-blur-sm">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="relative flex flex-col items-center gap-5 text-center">
            {/* Logo and branding */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
                <Book className="h-4.5 w-4.5 text-background" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">AutoWiki</h1>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered documentation generator for your codebase. Connect a GitHub repository and get a comprehensive wiki in minutes.
            </p>

            {/* How it works */}
            <div className="w-full">
              <div className="space-y-2.5 text-left">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded bg-muted p-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Connect your repo</p>
                    <p className="text-xs text-muted-foreground">Paste any public GitHub URL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded bg-muted p-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI analyzes your code</p>
                    <p className="text-xs text-muted-foreground">Understands structure & patterns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded bg-muted p-1.5">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Get your wiki</p>
                    <p className="text-xs text-muted-foreground">Auto-generated documentation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button onClick={onCreateProject} className="w-full max-w-sm">
          <Plus className="h-4 w-4" />
          Create your first project
        </Button>

        {/* Credit */}
        <p className="text-xs text-muted-foreground/60">
          Created with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/sheikhuzairhussain"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-muted-foreground"
          >
            Sheikh Uzair Hussain
          </a>
          .
        </p>
      </div>
    </div>
  );
}
