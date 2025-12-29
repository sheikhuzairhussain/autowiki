"use client";

import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { type ReactNode, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DeleteProjectDialog } from "@/components/delete-project-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WikiBreadcrumbs } from "@/components/wiki-breadcrumbs";
import {
  POLLING_INTERVAL_ACTIVE,
  POLLING_INTERVAL_IDLE,
} from "@/lib/constants";
import { parseWiki } from "@/schemas/wiki";
import { trpc } from "@/trpc/client";

interface WikiLayoutProps {
  children: ReactNode;
}

export default function WikiLayout({ children }: WikiLayoutProps) {
  const params = useParams();
  const projectId = params.projectId as string;
  const sectionSlug = params.sectionSlug as string | undefined;
  const pageSlug = params.pageSlug as string | undefined;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch all projects for the switcher
  const { data: projects = [] } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending = data?.some(
        (p) =>
          p.status === "pending" ||
          p.status === "analyzing" ||
          p.status === "generating-wiki",
      );
      return hasPending ? POLLING_INTERVAL_ACTIVE : POLLING_INTERVAL_IDLE;
    },
  });

  // Fetch current project for breadcrumbs
  const { data: currentProject } = trpc.projects.get.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  const wiki = parseWiki(currentProject?.wiki);

  // Determine breadcrumb values
  let sectionName = "Wiki";
  let pageName = "";

  if (wiki) {
    if (sectionSlug && pageSlug) {
      const section = wiki.sections.find((s) => s.slug === sectionSlug);
      const page = section?.pages.find((p) => p.slug === pageSlug);
      sectionName = section?.name || sectionSlug;
      pageName = page?.title || pageSlug;
    } else {
      // Home page
      sectionName = "Wiki";
      pageName = wiki.home.title;
    }
  } else if (currentProject) {
    // Project is pending/processing, show project name
    pageName = currentProject.name || "Loading...";
  }

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {pageName && (
            <WikiBreadcrumbs sectionName={sectionName} pageName={pageName} />
          )}
          {currentProject &&
            (currentProject.status === "completed" ||
              currentProject.status === "failed") && (
              <div className="ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteDialogOpen(true)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete project</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete project</TooltipContent>
                </Tooltip>
              </div>
            )}
        </header>
        {children}
      </SidebarInset>
      {currentProject && (
        <DeleteProjectDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          project={{
            id: currentProject.id,
            name: currentProject.name,
          }}
        />
      )}
    </SidebarProvider>
  );
}
