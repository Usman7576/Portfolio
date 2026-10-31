import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical write-ups on building AI products: what worked, what didn't, and the numbers.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SectionHeading
        as="h1"
        eyebrow="Blog"
        title="Writing"
        description="Technical write-ups on building AI products: what worked, what didn't, and the numbers."
      />

      {posts.length === 0 ? (
        <div className="text-muted-foreground mt-10 rounded-xl border border-dashed p-8 text-center">
          <p>
            The first posts are on the way, starting with how IntelliMeet&apos;s wait for the first
            translated audio went from 4.7 s to under one second.
          </p>
          <Link href="/projects" className="text-primary mt-3 inline-block text-sm font-medium">
            Read the project case studies meanwhile
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y border-y">
          {posts.map((post) => (
            <li key={post.slug} className="py-6">
              <p className="text-muted-foreground font-mono text-xs">
                {post.publishedAt} · {post.readingTime} min read
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary mt-1 block text-lg font-medium"
              >
                {post.title}
              </Link>
              <p className="text-muted-foreground mt-1">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
