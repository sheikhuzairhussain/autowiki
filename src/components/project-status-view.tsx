"use client";

import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_MESSAGES } from "@/lib/constants";
import type { ProjectStatus } from "@/schemas/project";

interface ProjectStatusViewProps {
  /** Current project status, or null if project not found */
  status: ProjectStatus | null;
  /** Whether the initial data is still loading */
  isLoading: boolean;
  /** Callback when retry button is clicked */
  onRetry?: () => void;
  /** Whether a retry is currently in progress */
  isRetrying?: boolean;
}

/**
 * Displays appropriate UI based on project loading/processing state.
 * Returns null when status is "completed" (caller should render actual content).
 */
export function ProjectStatusView({
  status,
  isLoading,
  onRetry,
  isRetrying = false,
}: ProjectStatusViewProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Project not found
  if (status === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">Project not found</div>
      </div>
    );
  }

  // Project completed - caller should render content
  if (status === "completed") {
    return null;
  }

  const isFailed = status === "failed";
  const isProcessing =
    status === "pending" ||
    status === "analyzing" ||
    status === "generating-wiki";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      {isProcessing && (
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      )}
      {isFailed && (
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="size-8 text-destructive" />
        </div>
      )}
      <div className="text-center">
        <p className="text-lg font-medium">{STATUS_MESSAGES[status]}</p>
        {isProcessing && (
          <p className="text-sm text-muted-foreground max-w-sm">
            This may take a few minutes. Feel free to leave the page and come
            back later.
          </p>
        )}
      </div>
      {isFailed && onRetry && (
        <Button onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              Retry
            </>
          )}
        </Button>
      )}
    </div>
  );
}
