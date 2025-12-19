"use client";

import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { POLLING_INTERVAL_ACTIVE } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import type { Wiki } from "@/schemas/wiki";

interface WikiRedirectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const STATUS_MESSAGES = {
  pending: "Waiting to start...",
  analyzing: "Analyzing repository...",
  "generating-wiki": "Generating wiki pages...",
  failed: "Wiki generation failed",
  completed: "",
};

export default function WikiRedirectPage({ params }: WikiRedirectPageProps) {
  const { projectId } = use(params);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: project, isLoading } = trpc.projects.get.useQuery(
    { id: projectId },
    {
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (
          status === "pending" ||
          status === "analyzing" ||
          status === "generating-wiki"
        ) {
          return POLLING_INTERVAL_ACTIVE;
        }
        return false;
      },
    }
  );

  const retryMutation = trpc.projects.retry.useMutation({
    onSuccess: () => {
      utils.projects.get.invalidate({ id: projectId });
      utils.projects.list.invalidate();
    },
  });

  useEffect(() => {
    if (!project || isLoading) return;

    const wiki = project.wiki as Wiki | null;
    if (wiki) {
      router.replace(`/projects/${projectId}/wiki/home`);
    }
  }, [project, isLoading, projectId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">Project not found</div>
      </div>
    );
  }

  // Show status for non-completed projects
  if (project.status !== "completed") {
    const isFailed = project.status === "failed";
    const isProcessing =
      project.status === "pending" ||
      project.status === "analyzing" ||
      project.status === "generating-wiki";

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
          <p className="text-lg font-medium">
            {STATUS_MESSAGES[project.status]}
          </p>
          {isProcessing && (
            <p className="text-sm text-muted-foreground">
              This may take a few minutes
            </p>
          )}
        </div>
        {isFailed && (
          <Button
            onClick={() => retryMutation.mutate({ id: projectId })}
            disabled={retryMutation.isPending}
          >
            {retryMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="size-4" />
                Retry Analysis
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
