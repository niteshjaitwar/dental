import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/lib/config";
import { getSiteMetadata } from "@/lib/metadata";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return clinicConfig.blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = clinicConfig.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return getSiteMetadata({ title: "Blog" });
  }

  return getSiteMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}`,
  });
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = clinicConfig.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="section-shell section-space">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow">{post.category}</p>
        <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-[color:var(--muted)] md:text-lg">
          {post.excerpt}
        </p>
        <div className="mt-10 overflow-hidden rounded-[2rem]">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={720}
            className="h-auto w-full object-cover"
          />
        </div>
        <div className="glass-card mt-10 rounded-[2rem] p-8">
          {post.body.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-5 text-sm leading-8 text-[color:var(--muted)] first:mt-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/blogs" variant="secondary">
            {clinicConfig.ui.blogBackLabel}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
