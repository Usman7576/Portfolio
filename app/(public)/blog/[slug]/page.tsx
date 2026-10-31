import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/content";
import { Mdx } from "@/lib/mdx";

// Cache Components needs at least one param at build time; with no posts yet a placeholder
// keeps the build valid and resolves to a 404.
const PLACEHOLDER = "__no-posts-yet__";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length > 0 ? posts.map((p) => ({ slug: p.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = slug === PLACEHOLDER ? undefined : await getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" /> All posts
      </Link>

      <header className="mt-6 mb-10">
        <p className="text-muted-foreground font-mono text-xs">
          {post.publishedAt} · {post.readingTime} min read
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-muted-foreground mt-3 text-lg text-pretty">{post.excerpt}</p>
        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li key={t} className="bg-secondary rounded-md px-2 py-0.5 text-xs">
                {t}
              </li>
            ))}
          </ul>
        )}
      </header>

      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt=""
          width={1200}
          height={630}
          className="mb-10 w-full rounded-xl border object-cover"
        />
      )}

      <Mdx source={post.content} />
    </article>
  );
}
