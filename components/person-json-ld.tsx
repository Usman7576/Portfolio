import { site, skillGroups } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

/** schema.org Person data so search engines can show a rich result for the site owner. */
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    url: siteUrl,
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Faisalabad", addressCountry: "PK" },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "National University of Computer and Emerging Sciences (FAST-NUCES)",
    },
    knowsAbout: skillGroups.flatMap((g) => g.skills),
    sameAs: [site.github, site.linkedin],
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: every value is our own static content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
