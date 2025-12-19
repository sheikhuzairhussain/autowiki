"use client";

import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateProject: () => void;
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-muted p-3">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            No projects yet
          </h2>
          <p className="text-sm text-muted-foreground">
            Create your first project to get started with auto-generated wiki
            documentation.
          </p>
        </div>
      </div>
      <Button onClick={onCreateProject}>
        Create new project
      </Button>
    </div>
  );
}
