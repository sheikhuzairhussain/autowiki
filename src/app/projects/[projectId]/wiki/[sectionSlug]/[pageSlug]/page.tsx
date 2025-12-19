"use client";

import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { WikiBreadcrumbs } from "@/components/wiki-breadcrumbs";
import { WikiContent } from "@/components/wiki-content";
import { trpc } from "@/trpc/client";
import type { Wiki } from "@/schemas/wiki";

interface WikiPageProps {
  params: Promise<{
    projectId: string;
    sectionSlug: string;
    pageSlug: string;
  }>;
}

const STATUS_MESSAGES = {
  pending: "Waiting to start...",
  analyzing: "Analyzing repository...",
  "generating-wiki": "Generating wiki pages...",
  failed: "Wiki generation failed",
  completed: "",
};

export default function WikiPage({ params }: WikiPageProps) {
  const { projectId, sectionSlug, pageSlug } = use(params);
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
          return 1000;
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

  const wiki = project.wiki as Wiki | null;

  if (!wiki) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">
          Wiki data is missing
        </div>
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
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <WikiBreadcrumbs sectionName={section.name} pageName={page.title} />
      </header>
      <div className="flex flex-1 flex-col p-6">
        <WikiContent
          content={page.content}
          projectId={projectId}
          currentSectionSlug={sectionSlug}
        />
      </div>
    </>
  );
}
