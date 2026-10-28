import { normalizePath } from "./routes";
export { normalizePath } from "./routes";
import { GUIDES, guidePath, guideForPath } from "@/data/guides";
import { SERVICES, SERVICE_IMAGES } from "@/data/services";
import { COMPANY, CONTACT, SITE_URL } from "./site";

export const SERVICE_SEO: Record<
  string,
  { heading: string; description: string }
> = {
  cylinder: {
    heading: "বাংলাদেশে প্যাকেজিং প্রিন্টিং সিলিন্ডার",
    description:
      "কাস্টম LD ও ফয়েল প্যাকেট প্রিন্টিংয়ের জন্য সিলিন্ডার তৈরি। সাইজ, ডিজাইন ও কালার অনুযায়ী কোটেশন নিন Smart Printing Packaging, ঢাকা থেকে।",
  },
  "ld-packet": {
    heading: "পলি প্যাকেট প্রিন্টিং ও কাস্টম LD প্যাকেট",
    description:
      "ঢাকায় নিজের নাম, লোগো ও ডিজাইনে LD পলি প্যাকেট প্রিন্টিং। সাইজ, রঙ ও পরিমাণ জানিয়ে Smart Printing Packaging থেকে কাস্টম প্যাকেটের কোটেশন নিন।",
  },
  "foil-packet": {
    heading: "ফয়েল প্যাকেট প্রিন্টিং ও কাস্টম পাউচ",
    description:
      "নিজের ব্র্যান্ডের ফয়েল প্যাকেট ও পাউচ প্রিন্টিং। পণ্য, সাইজ, ম্যাটেরিয়াল ও পরিমাণ জানিয়ে Smart Printing Packaging, ঢাকায় কোটেশন নিন।",
  },
  sticker: {
    heading: "স্টিকার ও লেবেল প্রিন্টিং, ঢাকা",
    description:
      "নিজের নাম ও লোগোসহ প্যাকেট, বক্স, বোতল ও জারের জন্য কাস্টম স্টিকার ও লেবেল প্রিন্টিং। সাইজ ও পরিমাণ জানিয়ে ঢাকায় কোটেশন নিন।",
  },
  "art-paper": {
    heading: "ঢাকায় আর্ট পেপার প্রিন্টিং",
    description:
      "ব্র্যান্ডের লেবেল ও প্রিন্টিংয়ের জন্য আর্ট পেপার প্রিন্টিং সেবা। কাগজ, সাইজ ও ফিনিশিং বেছে নিতে ঢাকার Smart Printing Packaging-এর সঙ্গে কথা বলুন।",
  },
  "custom-box": {
    heading: "প্যাকেজিং বক্স প্রিন্টিং ও কাস্টম বক্স",
    description:
      "নিজের নাম ও লোগোসহ পণ্যের জন্য কাস্টম প্যাকেজিং বক্স প্রিন্টিং। বক্সের সাইজ, ডিজাইন ও পরিমাণ জানিয়ে Smart Printing Packaging, ঢাকায় কোটেশন নিন।",
  },
  "ready-made": {
    heading: "বাংলাদেশে রেডিমেড প্যাকেট ও জিপার পাউচ",
    description:
      "রেডিমেড LD প্যাকেট, ফয়েল প্যাকেট ও জিপার পাউচের সাইজ ও আনুমানিক দাম দেখুন। স্টক ও ন্যূনতম অর্ডার নিশ্চিত করে WhatsApp-এ অর্ডার করুন।",
  },
  "security-poly": {
    heading: "বাংলাদেশে বোতল ও জারের সিকিউরিটি শ্রিংক সিল",
    description:
      "বোতল ও জারের মুখের জন্য সিকিউরিটি পলি বা heat-shrink সিল। সাইজ, ডিজাইন ও পরিমাণ জানিয়ে Smart Printing Packaging, ঢাকায় কোটেশন নিন।",
  },
  offset: {
    heading: "ঢাকায় অফসেট প্রিন্টিং সেবা",
    description:
      "ব্যবসার কাগজপত্র ও ব্র্যান্ডিংয়ের জন্য অফসেট প্রিন্টিং। সাইজ, পেপার, কালার ও পরিমাণ জানিয়ে ঢাকার Smart Printing Packaging থেকে কোটেশন নিন।",
  },
  other: {
    heading: "বাংলাদেশে কাস্টম প্রিন্টিং ও প্যাকেজিং সলিউশন",
    description:
      "আপনার ব্যবসার প্রয়োজন অনুযায়ী প্রিন্টিং ও প্যাকেজিং সেবা বেছে নিন। ডিজাইন, ম্যাটেরিয়াল ও বাজেট নিয়ে Smart Printing Packaging, ঢাকায় পরামর্শ নিন।",
  },
};

export const servicePath = (id: string) => `/services/${id}/`;
export const serviceForPath = (path: string) =>
  SERVICES.find((s) => servicePath(s.id) === normalizePath(path));
export const pagePaths = [
  "/",
  ...SERVICES.map((s) => servicePath(s.id)),
  ...GUIDES.map((g) => guidePath(g.slug)),
];

export function pageSEO(path: string) {
  const service = serviceForPath(path);
  const guide = guideForPath(path);
  const known = normalizePath(path) === "/" || !!service || !!guide;
  const title = service
    ? `${SERVICE_SEO[service.id].heading} | ${COMPANY.name}`
    : guide
      ? `${guide.title} | ${COMPANY.name}`
      : known
        ? `প্যাকেজিং: প্যাকেট, বক্স ও স্টিকার প্রিন্টিং | ${COMPANY.name}`
        : `পেজটি পাওয়া যায়নি | ${COMPANY.name}`;
  return {
    title,
    description: service
      ? SERVICE_SEO[service.id].description
      : guide
        ? guide.description
        : "নিজের নামে পলি ও ফয়েল প্যাকেট, প্যাকেজিং বক্স, স্টিকার ও লেবেল প্রিন্টিং। ঢাকার Smart Printing Packaging থেকে কাস্টম প্যাকেজিংয়ের কোটেশন নিন।",
    canonical: `${SITE_URL}${normalizePath(path)}`,
    known,
    service,
    guide,
  };
}

// Existing site details require owner verification; do not invent reviews, ratings or prices.
export function structuredData(path: string) {
  const page = pageSEO(path);
  const businessId = `${SITE_URL}/#business`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "LocalBusiness",
      "@id": businessId,
      name: COMPANY.name,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/brand-logo.png`,
      telephone: CONTACT.phoneDial,
      email: CONTACT.email,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: `+${CONTACT.whatsappNumber}`,
          url: `https://wa.me/${CONTACT.whatsappNumber}`,
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "101 K P Ghosh Road, Armanitola, Bangshal",
        addressLocality: "Dhaka",
        postalCode: "1100",
        addressCountry: "BD",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
          ],
          opens: "10:00",
          closes: "19:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Printing & Packaging Services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            url: `${SITE_URL}${servicePath(s.id)}`,
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: COMPANY.name,
      inLanguage: "bn-BD",
      publisher: { "@id": businessId },
    },
    {
      "@type": "WebPage",
      "@id": `${page.canonical}#webpage`,
      url: page.canonical,
      name: page.title,
      description: page.description,
      inLanguage: "bn-BD",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": businessId },
    },
  ];
  if (page.service) {
    const s = page.service;
    const image = SERVICE_IMAGES[s.id]?.[0];
    graph.push(
      {
        "@type": "Service",
        "@id": `${page.canonical}#service`,
        name: SERVICE_SEO[s.id].heading,
        serviceType: s.title,
        description: s.summary,
        url: page.canonical,
        provider: { "@id": businessId },
        ...(image && !image.startsWith("http")
          ? { image: new URL(image, SITE_URL).href }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "হোম",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: SERVICE_SEO[s.id].heading,
            item: page.canonical,
          },
        ],
      },
    );
  }
  if (page.guide) {
    graph.push(
      {
        "@type": "Article",
        "@id": `${page.canonical}#article`,
        headline: page.guide.title,
        description: page.guide.description,
        inLanguage: "bn-BD",
        mainEntityOfPage: { "@id": `${page.canonical}#webpage` },
        author: { "@id": businessId },
        publisher: { "@id": businessId },
        image: `${SITE_URL}/social-preview.jpg`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "হোম",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.guide.title,
            item: page.canonical,
          },
        ],
      },
    );
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
