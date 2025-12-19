"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { POLLING_INTERVAL_ACTIVE, POLLING_INTERVAL_IDLE } from "@/lib/constants";
import { trpc } from "@/trpc/client";

interface WikiLayoutProps {
  children: ReactNode;
}

export default function WikiLayout({ children }: WikiLayoutProps) {
  // Fetch all projects for the switcher
  const { data: projects = [] } = trpc.projects.list.useQuery(undefined, {
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending = data?.some(
        (p) =>
          p.status === "pending" ||
          p.status === "analyzing" ||
          p.status === "generating-wiki"
      );
      return hasPending ? POLLING_INTERVAL_ACTIVE : POLLING_INTERVAL_IDLE;
    },
  });

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
