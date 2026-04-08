import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/lib/config";
import { BlogCard } from "@/components/pages/blogs/blog-card";

export function BlogsPageView() {
  return (
    <>
      <section className="section-shell section-space">
        <Reveal>
          <SectionHeading
            eyebrow="Blog"
            title="Educational content that supports SEO and patient trust."
            description="These article cards are white-label friendly and can later be replaced with CMS-driven content without changing the route structure."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {clinicConfig.blogPosts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.08}>
              <BlogCard {...post} />
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCtaSection />
    </>
  );
}
