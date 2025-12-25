"use client";

import { use } from "react";
import { ProjectStatusView } from "@/components/project-status-view";
import { WikiContent } from "@/components/wiki-content";
import { useProjectWithPolling } from "@/hooks/use-project-with-polling";
import { parseWiki } from "@/schemas/wiki";

interface WikiPageProps {
  params: Promise<{
    projectId: string;
    sectionSlug: string;
    pageSlug: string;
  }>;
}

export default function WikiPage({ params }: WikiPageProps) {
  const { projectId, sectionSlug, pageSlug } = use(params);

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

  // Find the section and page
  const section = wiki.sections.find((s) => s.slug === sectionSlug);
  const page = section?.pages.find((p) => p.slug === pageSlug);

  if (!section || !page) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">Page not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <WikiContent
        content={page.content}
        projectId={projectId}
        currentSectionSlug={sectionSlug}
      />
    </div>
  );
}
