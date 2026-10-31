import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

/**
 * Renders MDX stored in the database. Shared by the public blog and the admin preview,
 * so what you preview is exactly what gets published.
 * next-mdx-remote blocks JavaScript expressions in MDX by default.
 */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert prose-headings:tracking-tight prose-a:text-primary prose-pre:border prose-pre:bg-muted/40 max-w-none">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypePrettyCode,
                { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
