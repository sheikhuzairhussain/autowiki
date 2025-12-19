"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { EmptyState } from "@/components/empty-state";
import { trpc } from "@/trpc/client";

export default function Home() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: projects, isLoading } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending = data?.some(
        (p) =>
          p.status === "pending" ||
          p.status === "analyzing" ||
          p.status === "generating-wiki"
      );
      return hasPending ? 1000 : 10000;
    },
  });

  // If there's a completed project, redirect to it
  useEffect(() => {
    if (!projects || isLoading) return;

    const completedProject = projects.find((p) => p.status === "completed");
    if (completedProject?.id) {
      router.push(`/projects/${completedProject.id}/wiki`);
    }
  }, [projects, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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

  // If we have projects but none completed, show a waiting state
  const hasPending = projects.some(
    (p) =>
      p.status === "pending" ||
      p.status === "analyzing" ||
      p.status === "generating-wiki"
  );

  if (hasPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="animate-pulse text-muted-foreground">
          Generating wiki documentation...
        </div>
        <p className="text-sm text-muted-foreground">
          This may take a few minutes
        </p>
      </div>
    );
  }

  // Fallback - shouldn't reach here normally
  return (
    <>
      <EmptyState onCreateProject={() => setDialogOpen(true)} />
      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
