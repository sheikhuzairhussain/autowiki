"use client";

import { use } from "react";
import { ProjectStatusView } from "@/components/project-status-view";
import { WikiContent } from "@/components/wiki-content";
import { useProjectWithPolling } from "@/hooks/use-project-with-polling";
import { parseWiki } from "@/schemas/wiki";

interface WikiHomePageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function WikiHomePage({ params }: WikiHomePageProps) {
  const { projectId } = use(params);

  const { project, isLoading, retry, isRetrying } =
    useProjectWithPolling(projectId);

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

  const wiki = parseWiki(project.wiki);

  if (!wiki) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">Wiki data is missing</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <WikiContent
        content={wiki.home.content}
        projectId={projectId}
        currentSectionSlug="home"
      />
    </div>
  );
}
