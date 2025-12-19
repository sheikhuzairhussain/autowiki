"use client";

import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateProject: () => void;
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            No projects yet
          </h2>
          <p className="text-muted-foreground">
            Create your first project to get started with auto-generated wiki
            documentation.
          </p>
        </div>
      </div>
      <Button onClick={onCreateProject} size="lg">
        Create new project
      </Button>
    </div>
  );
}
