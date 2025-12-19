"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CreateProjectInput,
  createProjectSchema,
} from "@/schemas/project";
import { trpc } from "@/trpc/client";

function extractRepoName(url: string): string {
  try {
    // Match GitHub URL patterns like:
    // https://github.com/owner/repo
    // https://github.com/owner/repo.git
    // git@github.com:owner/repo.git
    const match = url.match(/github\.com[/:]([\w-]+)\/([\w.-]+?)(\.git)?$/);
    if (match) {
      return match[2];
    }
  } catch {
    // Ignore parsing errors
  }
  return "";
}

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const prevUrlRef = useRef("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      url: "",
      name: "",
    },
  });

  const url = watch("url");

  // Auto-extract name from URL only when URL changes
  useEffect(() => {
    if (url !== prevUrlRef.current) {
      prevUrlRef.current = url;
      const extractedName = extractRepoName(url);
      if (extractedName) {
        setValue("name", extractedName);
      }
    }
  }, [url, setValue]);

  const createProject = trpc.projects.create.useMutation({
    onSuccess: (project) => {
      utils.projects.list.invalidate();
      reset();
      onOpenChange(false);
      if (project.id) {
        router.push(`/projects/${project.id}/wiki`);
      }
    },
  });

  const onSubmit = (data: CreateProjectInput) => {
    createProject.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
            <DialogDescription>
              Enter the URL of a GitHub repository to generate wiki
              documentation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Repository URL</Label>
              <Input
                id="url"
                placeholder="https://github.com/owner/repo"
                {...register("url")}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="my-project"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createProject.isPending}
            >
              {createProject.isPending ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
