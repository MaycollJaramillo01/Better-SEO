import { Badge } from "@/components/ui/Badge";

type SeoPreviewProps = {
  title: string;
  description: string;
  url: string;
};

export function SeoPreview({ title, description, url }: SeoPreviewProps) {
  const titleLength = title.length;
  const descriptionLength = description.length;

  return (
    <section className="premium-panel p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-dark">
            Search Preview
          </p>
          <h3 className="mt-2 text-lg font-semibold text-text-main">How core metadata appears</h3>
        </div>
        <Badge variant="info">Metadata</Badge>
      </div>

      <div className="mt-6 rounded-[28px] border border-border-soft/80 bg-white/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
            Conceptual snippet
          </span>
        </div>
        <p className="mt-5 text-[22px] leading-8 text-primary-dark">
          {title || "Missing title tag"}
        </p>
        <p className="mt-2 break-all text-sm text-success">{url}</p>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          {description ||
            "No meta description was detected. Search engines may generate a snippet automatically from page content."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant={titleLength >= 30 && titleLength <= 60 ? "success" : "warning"}>
            Title {titleLength} chars
          </Badge>
          <Badge
            variant={
              descriptionLength >= 120 && descriptionLength <= 160 ? "success" : "warning"
            }
          >
            Description {descriptionLength} chars
          </Badge>
        </div>
      </div>
    </section>
  );
}
