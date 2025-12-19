"use client";

import Link from "next/link";
import { useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface WikiContentProps {
  content: string;
  projectId: string;
  currentSectionSlug: string;
}

function isExternalLink(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
}

// Convert [[page-name]] wiki-style links to standard markdown links
function convertWikiLinks(content: string): string {
  // Match [[link]] or [[link|display text]]
  return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, link, displayText) => {
    const text = displayText || link;
    return `[${text}](${link})`;
  });
}

export function WikiContent({ content, projectId, currentSectionSlug }: WikiContentProps) {
  const processedContent = useMemo(() => convertWikiLinks(content), [content]);

  const resolveWikiLink = (href: string): string => {
    if (isExternalLink(href)) {
      return href;
    }

    // Remove leading ./ if present
    let cleanHref = href.replace(/^\.\//, "");
    
    // Handle ../ for going up to different section
    if (cleanHref.startsWith("../")) {
      cleanHref = cleanHref.replace(/^\.\.\//, "");
      // cleanHref should now be "section/page"
      return `/projects/${projectId}/wiki/${cleanHref}`;
    }

    // If it contains a slash, treat as section/page
    if (cleanHref.includes("/")) {
      return `/projects/${projectId}/wiki/${cleanHref}`;
    }

    // Otherwise, it's a page in the current section
    return `/projects/${projectId}/wiki/${currentSectionSlug}/${cleanHref}`;
  };

  return (
    <article className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
            if (!href) {
              return <span {...props}>{children}</span>;
            }

            if (isExternalLink(href)) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              );
            }

            return (
              <Link href={resolveWikiLink(href)} {...props}>
                {children}
              </Link>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
}
