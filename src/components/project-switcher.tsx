"use client";

import { Check, ChevronsUpDown, FolderGit2, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Wiki } from "@/schemas/wiki";

interface Project {
  id: string | null;
  name: string | null;
  url: string;
  status: "pending" | "analyzing" | "generating-wiki" | "completed" | "failed";
}

interface ProjectSwitcherProps {
  projects: Project[];
  currentProject?: {
    id: string | null;
    name: string | null;
    url: string;
    wiki: Wiki | null;
  };
}

function StatusDot({ status }: { status: Project["status"] }) {
  if (status === "completed") return null;

  const colors = {
    pending: "bg-yellow-500",
    analyzing: "bg-yellow-500 animate-pulse",
    "generating-wiki": "bg-yellow-500 animate-pulse",
    failed: "bg-red-500",
  };

  return (
    <span
      className={`size-2 shrink-0 rounded-full ${colors[status]}`}
      title={status}
    />
  );
}

export function ProjectSwitcher({
  projects,
  currentProject,
}: ProjectSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    if (!project.id) return;
    router.push(`/projects/${project.id}/wiki`);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 border"
              >
                <FolderGit2 className="size-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col gap-0.5 leading-none min-w-0">
                  <span className="font-medium truncate">
                    {currentProject?.name || "Select Project"}
                  </span>
                  {currentProject && (
                    <span className="text-xs text-muted-foreground truncate">
                      {currentProject.url}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width)"
              align="start"
            >
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onSelect={() => handleProjectSelect(project)}
                  className="flex items-start gap-3 py-2"
                >
                  <FolderGit2 className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="truncate">
                        {project.name || "Unnamed Project"}
                      </span>
                      <StatusDot status={project.status} />
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {project.url}
                    </span>
                  </div>
                  {project.id === params.projectId && (
                    <Check className="size-4 shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
                <Plus className="size-4" />
                <span>Create new project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
