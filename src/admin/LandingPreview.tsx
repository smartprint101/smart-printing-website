import type { LandingBlock, LandingTheme, Product } from "@shared/types";
import { formatPriceShort, productWaLink } from "@/lib/catalog";

/**
 * Approximate on-screen preview of a landing page draft.
 * The published page is rendered server-side by `functions/lp/[slug].ts`.
 */
export function LandingPreview({
  title,
  blocks,
  theme,
  products,
}: {
  title: string;
  blocks: LandingBlock[];
  theme: LandingTheme;
  products: Product[];
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-line"
      style={{ background: theme.background }}
    >
      <div className="flex items-center justify-between border-b border-black/10 bg-white/80 px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
          প্রিভিউ
        </span>
        <span className="truncate text-[11px] font-bold text-royal-900">
          {title || "ল্যান্ডিং পেজ"}
        </span>
      </div>
      <div className="text-royal-900">
        {blocks.length === 0 && (
          <p className="px-4 py-10 text-center text-xs text-muted">
            এখনো কোনো ব্লক যোগ করা হয়নি।
          </p>
        )}
        {blocks.map((block) => (
          <div key={block.id}>
            {block.type === "hero" && (
              <div
                className="px-4 py-8 sm:px-6"
                style={
                  block.theme === "dark"
                    ? { background: theme.accent, color: "#fff" }
                    : undefined
                }
              >
                {block.eyebrow && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                    {block.eyebrow}
                  </p>
                )}
                <p className="mt-2 text-2xl font-extrabold leading-snug">
                  {block.title || "হিরো টাইটেল"}
                </p>
                {block.subtitle && (
                  <p className="mt-2 max-w-lg text-sm opacity-80">{block.subtitle}</p>
                )}
                {block.ctaText && (
                  <span
                    className="mt-4 inline-flex min-h-10 items-center rounded-full px-4 text-xs font-bold"
                    style={{ background: theme.accent, color: "#fff" }}
                  >
                    {block.ctaText}
                  </span>
                )}
              </div>
            )}

            {block.type === "text" && (
              <div className="px-4 py-6 sm:px-6">
                {block.title && (
                  <p className="text-lg font-extrabold">{block.title}</p>
                )}
                <div
                  className="prose-sm mt-2 max-w-none text-sm text-muted [&_h3]:font-bold [&_img]:my-3 [&_img]:rounded-lg [&_li]:ml-4 [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              </div>
            )}

            {block.type === "products" && (
              <div className="px-4 py-6 sm:px-6">
                {block.title && (
                  <p className="text-lg font-extrabold">{block.title}</p>
                )}
                {block.subtitle && (
                  <p className="mt-1 text-xs text-muted">{block.subtitle}</p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {products
                    .filter(
                      (product) =>
                        block.productIds.includes(product.id) ||
                        block.productIds.includes(product.slug),
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        className="rounded-lg border border-line bg-white p-2"
                      >
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt=""
                            width={160}
                            height={140}
                            className="aspect-[1.1] w-full rounded object-contain"
                          />
                        )}
                        <p className="mt-1 text-xs font-bold">{product.nameBn}</p>
                        <p className="text-[11px] text-muted">
                          {formatPriceShort(product)}
                        </p>
                        <span className="mt-1 inline-block text-[10px] font-bold text-royal-700">
                          অর্ডার করুন →
                        </span>
                        <span className="sr-only">{productWaLink(product)}</span>
                      </div>
                    ))}
                </div>
                {!products.some(
                  (product) =>
                    block.productIds.includes(product.id) ||
                    block.productIds.includes(product.slug),
                ) && (
                  <p className="mt-2 text-[11px] text-muted">
                    কোনো প্রোডাক্ট বাছাই করা হয়নি।
                  </p>
                )}
              </div>
            )}

            {block.type === "features" && (
              <div className="px-4 py-6 sm:px-6">
                {block.title && (
                  <p className="text-lg font-extrabold">{block.title}</p>
                )}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {block.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-line bg-white p-3"
                    >
                      <p className="text-xs font-bold">{item.title}</p>
                      <p className="mt-1 text-[11px] text-muted">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {block.type === "image" && (
              <div className="px-4 py-6 sm:px-6">
                {block.imageUrl ? (
                  <img
                    src={block.imageUrl}
                    alt={block.alt}
                    width={900}
                    height={600}
                    className="w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="grid h-40 place-items-center rounded-xl bg-white text-xs text-muted">
                    ছবি যোগ করুন
                  </div>
                )}
                {block.caption && (
                  <p className="mt-2 text-center text-[11px] text-muted">
                    {block.caption}
                  </p>
                )}
              </div>
            )}

            {block.type === "cta" && (
              <div className="px-4 py-6 sm:px-6">
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
                  style={{ background: theme.accent, color: "#fff" }}
                >
                  <div>
                    <p className="text-sm font-extrabold">{block.title}</p>
                    {block.text && (
                      <p className="mt-1 text-[11px] opacity-80">{block.text}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-royal-900">
                    {block.buttonText || "যোগাযোগ"}
                  </span>
                </div>
              </div>
            )}

            {block.type === "faq" && (
              <div className="px-4 py-6 sm:px-6">
                {block.title && (
                  <p className="text-lg font-extrabold">{block.title}</p>
                )}
                <div className="mt-2 space-y-2">
                  {block.items.map((item, index) => (
                    <details
                      key={index}
                      className="rounded-lg border border-line bg-white p-3"
                    >
                      <summary className="text-xs font-bold">{item.q}</summary>
                      <p className="mt-1 text-[11px] text-muted">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {block.type === "html" && (
              <div className="px-4 py-6 sm:px-6">
                <div
                  className="max-w-none text-sm [&_img]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
                {!block.allowScripts && (
                  <p className="mt-2 text-[10px] text-amber-700">
                    নোট: প্রিভিউতে কোড যেমন আছে তেমন দেখাচ্ছে; প্রকাশিত পেজে{" "}
                    <code>script</code> সরিয়ে দেওয়া হবে।
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-black/10 bg-royal-950 px-4 py-3 text-[11px] text-royal-100">
        Smart Printing Packaging · ঢাকা · WhatsApp অর্ডার
      </div>
    </div>
  );
}
