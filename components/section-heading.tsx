export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-primary mb-2 font-mono text-sm">{eyebrow}</p>}
      <Tag className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</Tag>
      {description && <p className="text-muted-foreground mt-3 text-pretty">{description}</p>}
    </div>
  );
}
