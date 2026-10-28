import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Container, SectionHeading, Reveal } from "./ui";
import { cn } from "@/utils/cn";

// ==================== IMAGE IMPORTS ====================

// Printed LD Packet
import printedLdPacket1 from "@/assets/services2/printed-ld-packet-1.webp";
import printedLdPacket2 from "@/assets/services2/printed-ld-packet-2.webp";
import printedLdPacket3 from "@/assets/services2/printed-ld-packet-3.webp";
import printedLdPacket4 from "@/assets/services2/printed-ld-packet-4.webp";
import printedLdPacket5 from "@/assets/services2/printed-ld-packet-5.webp";

// Foil Pouch
import foilPouch1 from "@/assets/services2/foil-pouch-1.webp";
import foilPouch2 from "@/assets/services2/foil-pouch-2.webp";
import foilPouch3 from "@/assets/services2/foil-pouch-3.webp";
import foilPouch4 from "@/assets/services2/foil-pouch-4.webp";
import foilPouch5 from "@/assets/services2/foil-pouch-5.webp";

// Box
import box1 from "@/assets/services2/box1.webp";
import box2 from "@/assets/services2/box2.webp";
import box3 from "@/assets/services2/box3.webp";
import box4 from "@/assets/services2/box4.webp";

// Sticker
import sticker1 from "@/assets/services2/Sticker1.webp";
import sticker2 from "@/assets/services2/Sticker2.webp";
import sticker3 from "@/assets/services2/Sticker3.webp";
import sticker4 from "@/assets/services2/Sticker4.webp";

// Offset
import offset from "@/assets/services2/offset.webp";

// Readymade Collection
import foilRadymet from "@/assets/services2/foilradymet.webp";
import geperRadymet from "@/assets/services2/geperradymet.webp";
import ldRadymet from "@/assets/services2/Ldradymet.webp";
import srinkRadymet from "@/assets/services2/srinkradymet.webp";
import suqureRadymet from "@/assets/services2/suquretradymet.webp";

// ==================== TYPES & CATEGORIES ====================

type Cat = "All" | "LD & Foil" | "Box" | "Sticker" | "Printing" | "Readymade";

const CATEGORIES: Cat[] = ["All", "LD & Foil", "Box", "Sticker", "Printing", "Readymade"];

interface Work {
  title: string;
  cat: Exclude<Cat, "All">;
  desc: string;
  images: string[];
}

// ==================== WORKS DATA ====================

const WORKS: Work[] = [
  {
    title: "Printed LD Packet",
    cat: "LD & Foil",
    desc: "ব্র্যান্ডেড flexible LD packet — মুদিপণ্য ও consumer product-এর জন্য।",
    images: [printedLdPacket1, printedLdPacket2, printedLdPacket3, printedLdPacket4, printedLdPacket5],
  },
  {
    title: "Snack Foil Pouch",
    cat: "LD & Foil",
    desc: "Metallic foil stand-up pouch — আকর্ষণীয় ও প্রোডাক্ট-বান্ধব।",
    images: [foilPouch1, foilPouch2, foilPouch3, foilPouch4, foilPouch5],
  },
  {
    title: "Custom Gift Box",
    cat: "Box",
    desc: "প্রিমিয়াম প্রিন্টেড গিফট বক্স ও কাস্টম প্যাকেজিং বক্স।",
    images: [box1, box2, box3, box4],
  },
  {
    title: "Sticker Label Set",
    cat: "Sticker",
    desc: "কালারফুল প্রোডাক্ট স্টিকার ও লেবেল।",
    images: [sticker1, sticker2, sticker3, sticker4],
  },
  {
    title: "Offset Print Production",
    cat: "Printing",
    desc: "কমার্শিয়াল অফসেট প্রিন্টিং প্রোডাকশন।",
    images: [offset],
  },
  {
    title: "Readymade Packet Collection",
    cat: "Readymade",
    desc: "রেডিমেড প্যাকেট কালেকশন — ফয়েল, পেপার, LD, শ্রিংক ও স্কয়ার প্যাকেট।",
    images: [foilRadymet, geperRadymet, ldRadymet, srinkRadymet, suqureRadymet],
  },
];

// ==================== COMPONENT ====================

export function Portfolio() {
  const [active, setActive] = useState<Cat>("All");
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filtered = active === "All" ? WORKS : WORKS.filter((w) => w.cat === active);

  // Auto-slideshow
  useEffect(() => {
    if (!selectedWork || selectedWork.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % selectedWork.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedWork]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedWork) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const openModal = (work: Work) => {
    setSelectedWork(work);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedWork(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    if (!selectedWork) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedWork.images.length);
  };

  const prevImage = () => {
    if (!selectedWork) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedWork.images.length) % selectedWork.images.length);
  };

  return (
    <section id="portfolio" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="আমাদের কাজ"
            title="পোর্টফোলিও"
            subtitle="কাজের ধরন ও মানের ধারণা পেতে নিচের নমুনা ভিজ্যুয়াল দেখুন। ছবিতে ক্লিক করে সব নমুনা দেখুন।"
          />
        </Reveal>

        {/* Filters */}
        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active === c
                    ? "bg-royal-700 text-white shadow-card"
                    : "border border-line bg-white text-muted hover:border-royal-200 hover:text-royal-700"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 70}>
              <article
                onClick={() => openModal(w)}
                className="group relative h-60 cursor-pointer overflow-hidden rounded-2xl border border-line shadow-card sm:h-72"
              >
                <img
                  src={w.images[0]}
                  alt={w.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-950/90 via-royal-950/10 to-transparent" />

                {/* Image count badge */}
                {w.images.length > 1 && (
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    +{w.images.length} ছবি
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-95 transition-all duration-300 group-hover:translate-y-0">
                  <span className="inline-block rounded-full bg-gold-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-royal-900">
                    {w.cat}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">{w.title}</h3>
                  <p className="mt-1 max-h-0 overflow-hidden text-[13px] leading-relaxed text-royal-100/90 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                    {w.desc}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ==================== LIGHTBOX MODAL ==================== */}
      {selectedWork && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          {selectedWork.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Previous"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}

          {/* Image container */}
          <div
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full overflow-hidden rounded-2xl bg-black">
              <img
                key={currentImageIndex}
                src={selectedWork.images[currentImageIndex]}
                alt={`${selectedWork.title} - ${currentImageIndex + 1}`}
                className="mx-auto max-h-[75vh] w-auto animate-fadeIn object-contain"
              />
            </div>

            {/* Info bar */}
            <div className="mt-4 w-full text-center text-white">
              <span className="inline-block rounded-full bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-royal-900">
                {selectedWork.cat}
              </span>
              <h3 className="mt-2 text-xl font-bold">{selectedWork.title}</h3>
              <p className="mt-1 text-sm text-white/80">{selectedWork.desc}</p>

              {/* Image counter */}
              {selectedWork.images.length > 1 && (
                <p className="mt-3 text-sm text-white/60">
                  {currentImageIndex + 1} / {selectedWork.images.length}
                </p>
              )}

              {/* Dots indicator */}
              {selectedWork.images.length > 1 && (
                <div className="mt-3 flex justify-center gap-2">
                  {selectedWork.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        idx === currentImageIndex ? "w-8 bg-gold-400" : "w-2 bg-white/40 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Next button */}
          {selectedWork.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Next"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}