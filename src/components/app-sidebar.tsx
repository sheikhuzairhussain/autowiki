"use client";

import { Book, Home } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type * as React from "react";
import { ProjectSwitcher } from "@/components/project-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Wiki } from "@/schemas/wiki";
import { trpc } from "@/trpc/client";

interface Project {
  id: string | null;
  name: string | null;
  url: string;
  status: "pending" | "analyzing" | "generating-wiki" | "completed" | "failed";
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  projects: Project[];
}

export function AppSidebar({ projects, ...props }: AppSidebarProps) {
  const params = useParams();
  const projectId = params.projectId as string | undefined;
  const sectionSlug = params.sectionSlug as string | undefined;
  const pageSlug = params.pageSlug as string | undefined;

  const { data: currentProject } = trpc.projects.get.useQuery(
    { id: projectId ?? "" },
    { enabled: !!projectId },
  );

  const wiki = currentProject?.wiki as Wiki | null;

  return (
    <Sidebar collapsible="none" className="sticky top-0 h-svh" {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 py-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
            <Book className="h-4 w-4 text-background" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            AutoWiki
          </span>
        </Link>
        <ProjectSwitcher
          projects={projects}
          currentProject={
            currentProject
              ? {
                  id: currentProject.id,
                  name: currentProject.name,
                  url: currentProject.url,
                  wiki: wiki,
                }
              : undefined
          }
        />
      </SidebarHeader>
      <SidebarContent>
        {wiki && (
          <>
            <SidebarGroup className="pb-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={!sectionSlug && !pageSlug}
                  >
                    <Link href={`/projects/${projectId}/wiki/home`}>
                      <Home className="size-4" />
                      <span>{wiki.home.title || "Home"}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="pt-0">
              <SidebarGroupLabel>TABLE OF CONTENTS</SidebarGroupLabel>
              <SidebarMenu>
                {wiki.sections.map((section) => (
                  <SidebarMenuItem key={section.slug}>
                    <SidebarMenuButton className="font-medium">
                      {section.name}
                    </SidebarMenuButton>
                    {section.pages.length > 0 && (
                      <SidebarMenuSub>
                        {section.pages.map((page) => (
                          <SidebarMenuSubItem key={page.slug}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={
                                    section.slug === sectionSlug &&
                                    page.slug === pageSlug
                                  }
                                >
                                  <Link
                                    href={`/projects/${projectId}/wiki/${section.slug}/${page.slug}`}
                                  >
                                    <span>{page.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                {page.title}
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
