"use client";

import { useCallback } from "react";
import { POLLING_INTERVAL_ACTIVE } from "@/lib/constants";
import { trpc } from "@/trpc/client";

/**
 * Hook that fetches a project by ID with automatic polling when the project
 * is in a processing state (pending, analyzing, or generating-wiki).
 *
 * Also provides a retry mutation for failed projects.
 */
export function useProjectWithPolling(projectId: string) {
  const utils = trpc.useUtils();

  const {
    data: project,
    isLoading,
    error,
  } = trpc.projects.get.useQuery(
    { id: projectId },
    {
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (
          status === "pending" ||
          status === "analyzing" ||
          status === "generating-wiki"
        ) {
          return POLLING_INTERVAL_ACTIVE;
        }
        return false;
      },
    },
  );

  const retryMutation = trpc.projects.retry.useMutation({
    onSuccess: () => {
      utils.projects.get.invalidate({ id: projectId });
      utils.projects.list.invalidate();
    },
  });

  const retry = useCallback(() => {
    retryMutation.mutate({ id: projectId });
  }, [retryMutation, projectId]);

  return {
    project,
    isLoading,
    error,
    retry,
    isRetrying: retryMutation.isPending,
  };
}
