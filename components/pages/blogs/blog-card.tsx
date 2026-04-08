import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clinicConfig } from "@/lib/config";

type BlogCardProps = {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  slug: string;
};

export function BlogCard({
  title,
  excerpt,
  category,
  readTime,
  image,
  slug,
}: BlogCardProps) {
  return (
    <article className="glass-card overflow-hidden rounded-[2rem]">
      <div className="relative h-60">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs tracking-[0.18em] text-[color:var(--muted)] uppercase">
          <span>{category}</span>
          <span>{readTime}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          {excerpt}
        </p>
        <Link
          href={`/blogs/${slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--primary)]"
        >
          {clinicConfig.ui.blogReadArticleLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
