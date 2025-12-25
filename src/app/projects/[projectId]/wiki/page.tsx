"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { ProjectStatusView } from "@/components/project-status-view";
import { useProjectWithPolling } from "@/hooks/use-project-with-polling";
import { parseWiki } from "@/schemas/wiki";

interface WikiRedirectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function WikiRedirectPage({ params }: WikiRedirectPageProps) {
  const { projectId } = use(params);
  const router = useRouter();

  const { project, isLoading, retry, isRetrying } =
    useProjectWithPolling(projectId);

  useEffect(() => {
    if (!project || isLoading) return;

    const wiki = parseWiki(project.wiki);
    if (wiki) {
      router.replace(`/projects/${projectId}/wiki/home`);
    }
  }, [project, isLoading, projectId, router]);

  // Show status view for loading/not found/processing/failed states
  if (isLoading || !project || project.status !== "completed") {
    return (
      <ProjectStatusView
        status={project?.status ?? null}
        isLoading={isLoading}
        onRetry={retry}
        isRetrying={isRetrying}
      />
    );
  }

  // Redirecting to project...
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
