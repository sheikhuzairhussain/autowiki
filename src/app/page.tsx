"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { EmptyState } from "@/components/empty-state";
import { trpc } from "@/trpc/client";

export default function Home() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: projects, isLoading } = trpc.projects.list.useQuery();

  // If there are any projects, redirect to the first one (most recent)
  useEffect(() => {
    if (!projects || isLoading) return;

    const firstProject = projects[0];
    if (firstProject?.id) {
      router.push(`/projects/${firstProject.id}/wiki`);
    }
  }, [projects, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show empty state if no projects
  if (!projects || projects.length === 0) {
    return (
      <>
        <EmptyState onCreateProject={() => setDialogOpen(true)} />
        <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </>
    );
  }

  // Redirecting to project...
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
