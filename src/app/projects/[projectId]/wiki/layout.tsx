"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { WikiBreadcrumbs } from "@/components/wiki-breadcrumbs";
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
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        {pageName && (
          <WikiBreadcrumbs sectionName={sectionName} pageName={pageName} />
        )}
      </header>
      {children}
    </>
  );
}
