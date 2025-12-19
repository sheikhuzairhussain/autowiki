"use client";

import Link from "next/link";
import { type ComponentPropsWithoutRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface WikiContentProps {
  content: string;
  projectId: string;
  currentSectionSlug: string;
}

function isExternalLink(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  );
}

function isAnchorLink(href: string): boolean {
  return href.startsWith("#");
}

// Convert [[page-name]] wiki-style links to standard markdown links
function convertWikiLinks(content: string): string {
  // Match [[link]] or [[link|display text]]
  return content.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_, link, displayText) => {
      const text = displayText || link;
      return `[${text}](${link})`;
    },
  );
}

export function WikiContent({
  content,
  projectId,
  currentSectionSlug,
}: WikiContentProps) {
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

            // Anchor links (footnotes, headings) - keep as regular anchor
            if (isAnchorLink(href)) {
              return (
                <a href={href} {...props}>
                  {children}
                </a>
              );
            }

            // External links - open in new tab
            if (isExternalLink(href)) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            }

            // Internal wiki links - use Next.js Link
            return (
              <Link href={resolveWikiLink(href)} {...props}>
                {children}
              </Link>
            );
          },
          // Style footnote section - hide the default "Footnotes" heading
          section: ({
            className,
            children,
            ...props
          }: ComponentPropsWithoutRef<"section"> & {
            "data-footnotes"?: boolean;
          }) => {
            const isFootnotes =
              className?.includes("footnotes") || props["data-footnotes"];
            if (isFootnotes) {
              return (
                <section
                  className="border-t border-border pt-4 mt-8 not-prose"
                  {...props}
                >
                  <h3 className="text-sm font-medium mb-3 text-foreground">
                    References
                  </h3>
                  <div className="text-sm [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a[data-footnote-backref]]:hidden">
                    {children}
                  </div>
                </section>
              );
            }
            return (
              <section className={className} {...props}>
                {children}
              </section>
            );
          },
          // Hide the auto-generated "Footnotes" h2 heading
          h2: ({ children, id, ...props }: ComponentPropsWithoutRef<"h2">) => {
            if (id === "footnote-label") {
              return null;
            }
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  );
}
