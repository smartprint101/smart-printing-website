# Smart Printing Packaging — SEO ও লঞ্চ নির্দেশনা

মূল ডোমেইন: **https://smartpackagingbd.com/** (ব্যবহারকারীর দেওয়া)।

## কোডে যা করা হয়েছে

- হোমপেজ, ১০টি সেবা পেজ ও ৩টি প্যাকেজিং গাইডের সম্পূর্ণ HTML build-এর সময় তৈরি হয়; কনটেন্ট পড়তে JavaScript চালানো বাধ্যতামূলক নয়। একই HTML React দিয়ে hydrate হয়, তাই অর্ডার, কোটেশন ও অন্যান্য ইন্টারঅ্যাকশন বজায় থাকে।
- প্রতিটি পেজের আলাদা বাংলা title, description, একটি H1, self-referencing canonical, Open Graph ও Twitter sharing tags।
- বর্তমান সেবার ডেটা থেকেই বিস্তারিত ব্যবহার, বৈশিষ্ট্য, minimum order ও কোটেশন লিংক; নতুন মিথ্যা দাম, রিভিউ বা রেটিং যোগ করা হয়নি।
- LocalBusiness, WebSite, WebPage, Service, Article ও BreadcrumbList JSON-LD। ঠিকানা, ফোন ও সময় বিদ্যমান business config থেকে নেওয়া; প্রকাশের আগে ব্যবসার মালিক নিশ্চিত করবেন। Facebook URL এখনো generic, তাই UI থেকে লিংকটি সরানো হয়েছে এবং `sameAs`-এ সেটি যোগ করা হয়নি।
- `robots.txt`, ১৪টি canonical URL-সহ `sitemap.xml`, এবং `noindex` 404 পেজ। Sitemap-এ ভুয়া `lastmod`, `priority` বা hash-section URL নেই।
- সরাসরি crawlable internal links; service detail আর শুধু modal-এ আটকে নেই।
- WebP image variants ও social-preview.jpg; মূল ছবিগুলো সম্পাদনার জন্য অক্ষত রাখা হয়েছে। Scroll reveal-এর কারণে JavaScript বন্ধ থাকলে কনটেন্ট লুকানো থাকে না।

- সব WhatsApp লিংক একই `8801660191039` নম্বরে; অফিস ফোন আগের `+8801689318187` রাখা হয়েছে (অনুরোধ ছিল শুধু WhatsApp বদলানো)।
- বাংলা/ইংরেজি variable fonts self-hosted; Google Fonts-এর বাইরের request লাগবে না।
- প্রোডাক্ট সার্চ/ক্যাটাগরি, সেবা ফিল্টার, accessible mobile menu, safe-area bottom bar, native FAQ ও কোটেশনে বাংলা অঙ্কের ফোন নম্বর যাচাই।

## পরীক্ষা ও deployment

```sh
npm ci
npm run typecheck
npm run build
npm run test:seo
npm run preview -- --host 0.0.0.0
```

Deploy-এর পরে (ইন্টারনেট অ্যাক্সেস আছে এমন পরিবেশে):

```sh
npm run check:live-seo
```

এই script robots/XML, সব generated URL-এর canonical/HTML, পুরোনো WhatsApp link এবং প্রকৃত 404 পরীক্ষা করে। Google-এ কোনো তথ্য submit বা ranking পরীক্ষা করে না।

**পুরো `dist/` directory প্রকাশ করুন**, শুধু `index.html` নয়। যেমন:

- `/` → `dist/index.html`
- `/services/ld-packet/` → `dist/services/ld-packet/index.html`
- `/services/foil-packet/` → `dist/services/foil-packet/index.html`
- `/sitemap.xml` ও `/robots.txt` → সংশ্লিষ্ট generated/static ফাইল
- অজানা URL → `dist/404.html`, HTTP **404** status সহ

**লাইভ অডিটে ২৮ অক্টোবর ২০২৬-এ `/robots.txt`, `/sitemap.xml` ও `/services/ld-packet/`-এ homepage content পাওয়া গেছে। এই hosting fallback ঠিক না করলে কোডের SEO সুবিধা লাইভে কার্যকর হবে না।**

- Apache/cPanel হলে generated `dist/.htaccess`-সহ সব ফাইল document root-এ দিন। আগের catch-all SPA rewrite থাকলে সেটি সরান/প্রতিস্থাপন করুন। Apache-এ override permission না থাকলে হোস্টিং সাপোর্টকে কনফিগার করতে হবে।
- Netlify হলে repository-র `netlify.toml` build/publish directory ও unknown URL-এর 404 নির্দেশনা দেয়।
- অন্য provider হলে static-directory routing ও প্রকৃত 404 configure করুন; Netlify/Apache config সেখানে নিজে থেকে প্রযোজ্য নয়।

Hosting-এ সব পথকে homepage-এ rewrite করবেন না। প্রতিটি service URL সরাসরি খুললে সেই পেজের HTML ও **200** status আসতে হবে। Static file/directory index resolution চালু রাখুন। প্রয়োজনে hosting provider-এর static-site configuration ব্যবহার করুন। Vite preview কেবল স্থানীয় পরীক্ষার জন্য, production hosting নয়।

Hosting/CDN-এ HTTP → HTTPS ও `www.smartpackagingbd.com` → `smartpackagingbd.com` এক ধাপে 301 redirect দিন। `/services/ld-packet` → `/services/ld-packet/`-এর মতো trailing slash-ও 301-এ normalize করুন। প্রকৃত canonical URL যেন 200 দেয়, redirect loop না হয়। এসব server/CDN পরিবর্তন এই repository থেকে করা হয়নি।

সাইটে domain বদলালে `src/lib/site.ts`, `public/robots.txt`, `index.html`, `scripts/optimize-images.mjs` এবং SEO test-এর origin বদলান। নতুন social card তৈরি করে আবার build করুন।

ছবি বদলালে original JPG/PNG আপডেট করে `npm run optimize:images` চালান। কোডে WebP import রাখুন। নতুন সেবা যোগ করলে `src/data/services.ts` এবং `src/lib/seo.ts`-এ তার SEO heading/description যোগ করুন।

## Google-এ প্রকাশের পর জরুরি কাজ (মালিকের অ্যাক্সেস প্রয়োজন)

1. Google Search Console-এ `smartpackagingbd.com` Domain property যোগ করে DNS TXT দিয়ে verify করুন। গোপন তথ্য বা Google password কাউকে দেবেন না।
2. Sitemap হিসেবে **https://smartpackagingbd.com/sitemap.xml** জমা দিন।
3. URL Inspection-এ হোমপেজ ও অগ্রাধিকার সেবাগুলোর live URL test করুন; content, canonical ও indexing permission পরীক্ষা করে Request Indexing দিন।
4. Google Rich Results Test ও Schema Markup Validator-এ live URL পরীক্ষা করুন। সব schema rich result পাওয়ার যোগ্য নয়; markup দিলেই Google আলাদা result দেখাবে এমন নিশ্চয়তা নেই।
5. Google Business Profile তৈরি/দাবি ও verify করুন। ওয়েবসাইটের নাম, সঠিক ঠিকানা, ফোন, সময় ও category-এর সঙ্গে মিল রাখুন। Maps-এ প্রকৃত verified business pin ব্যবহার করুন; বর্তমান map link পূর্ণ ঠিকানা দিয়ে search করে, এটি verified Business Profile link নয়।
6. ব্যবসার বাস্তব ছবি, কাজের নমুনা ও প্রকৃত গ্রাহকদের স্বেচ্ছামূলক সৎ review সংগ্রহ করুন। কেনা/fake review, backlink spam, hidden text বা একই লেখা দিয়ে অসংখ্য শহরের doorway page বানাবেন না।
7. অফিসিয়াল Facebook URL `CONTACT.facebook`-এ বসান; যাচাইকৃত profile পেলে UI-তে লিংক ও schema-তে `sameAs` যোগ করুন।

## বাংলাদেশভিত্তিক পরবর্তী কনটেন্ট পরিকল্পনা

বাস্তব কাজ, নিজস্ব ছবি ও নিশ্চিত তথ্য দিয়ে আলাদা সহায়ক লেখা প্রকাশ করুন:

- LD প্যাকেট বনাম ফয়েল প্যাকেট: কোন পণ্যে কোনটি বেছে নেবেন?
- কম বাজেটে প্যাকেজিং: রেডিমেড প্যাকেট + স্টিকার বনাম কাস্টম প্রিন্ট।
- প্যাকেট প্রিন্টিংয়ের কোটেশন নিতে কী কী তথ্য লাগে?
- প্যাকেজিং প্রিন্টিং সিলিন্ডার কেন প্রয়োজন এবং খরচের কোন বিষয়গুলো বদলায়?
- জিপার পাউচ ও কাস্টম বক্সের সাইজ বাছাইয়ের বাস্তব উদাহরণ।

Food-grade/food-safe, সার্টিফিকেশন, ডেলিভারি সময়, দেশজুড়ে সেবা বা উৎপাদন সক্ষমতার দাবি প্রকাশের আগে ব্যবসার মালিক প্রমাণ/সঠিক শর্ত নিশ্চিত করবেন। মূল সাইটের existing service data-ও এই নিয়মে পুনরায় যাচাই করা উচিত।

## ফলাফল মাপা

Search Console-এ বাংলাদেশ country filter দিয়ে impressions, clicks, relevant queries, indexed pages ও CTR নিয়মিত তুলনা করুন। PageSpeed Insights-এ mobile Core Web Vitals পরীক্ষা করুন। WhatsApp/ফোনে আসা প্রকৃত inquiry ও অর্ডারের মান নোট করুন। Meta Pixel-এর Contact click বা QuotePrepared custom event-কে confirmed order হিসেবে গণনা করবেন না। Finder ব্যবহার করাকে checkout/registration এবং quote click-কে confirmed Lead হিসেবে গণনা করা বন্ধ করা হয়েছে।

এই কাজগুলো **Google-এ প্রথম স্থান, সব packaging query-তে visibility বা নির্দিষ্ট সময়ে indexing নিশ্চিত করে না**। Ranking নির্ভর করে প্রতিযোগিতা, search intent, business relevance, trust, backlinks, সাইটের মান ও Google-এর সিদ্ধান্তের ওপর। কোড পরিবর্তন deploy এবং Search Console/Business Profile-এর কাজ সম্পন্ন হওয়ার পরই বাস্তব ফলাফল পর্যবেক্ষণ করা যাবে।
