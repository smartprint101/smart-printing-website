import { Container, SectionHeading, Reveal } from "./ui";

// ==================== IMAGE IMPORTS ====================
import ldPouchImg from "@/assets/services2/Ldradymet.png";
import foilPouchImg from "@/assets/services2/foilradymet.png";
import zipperPouchImg from "@/assets/services2/geperradymet.png";
import stickerImg from "@/assets/services2/Sticker1.png";
import boxImg from "@/assets/services2/box1.png";

const SHOWCASE = [
  { label: "LD Pouch", src: ldPouchImg },
  { label: "Foil Pouch", src: foilPouchImg },
  { label: "Zipper Pouch", src: zipperPouchImg },
  { label: "Sticker Sheet", src: stickerImg },
  { label: "Custom Box", src: boxImg },
  { label: "Paper Bag", src: "https://images.pexels.com/photos/7987587/pexels-photo-7987587.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { label: "Shopping Bag", src: "https://images.pexels.com/photos/6969947/pexels-photo-6969947.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
  { label: "Printed Roll", src: "https://images.pexels.com/photos/31788399/pexels-photo-31788399.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" },
];

export function Showcase() {
  const items = [...SHOWCASE, ...SHOWCASE];
  return (
    <section className="overflow-hidden bg-mist py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="Product Showcase"
            title="প্রোডাক্ট রেঞ্জ এক নজরে"
            subtitle="Flexible packaging, foil, zipper, sticker, box, paper bag থেকে printed roll — সব ধরনের সমাধান।"
          />
        </Reveal>
      </Container>

      <Reveal delay={100} className="marquee-pause relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-mist to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-mist to-transparent sm:w-32" />
        <div className="flex w-max animate-marquee gap-5 px-4">
          {items.map((item, i) => (
            <figure
              key={`${item.label}-${i}`}
              className="group relative h-56 w-64 shrink-0 overflow-hidden rounded-2xl border border-line bg-white shadow-card sm:h-64 sm:w-72"
            >
              <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-950/70 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4">
                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-bold text-royal-800 backdrop-blur">
                  {item.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <Container>
        <p className="mt-8 text-center text-xs text-muted">
          * নমুনা ভিজ্যুয়াল
        </p>
      </Container>
    </section>
  );
}