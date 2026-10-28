# Master SEO audit ও বাস্তবায়ন পরিকল্পনা

**তারিখ:** ২৮ অক্টোবর ২০২৬ (বাংলাদেশ সময়)

**সাইট:** https://smartpackagingbd.com/

**অবস্থা:** repository-র উন্নয়ন ও স্থানীয় পরীক্ষা; production deploy, Google submission বা private account access করা হয়নি। এই রিপোর্ট পুরোনো `SEO-AUDIT.bn.md`-এর পরের পর্যবেক্ষণ।

## প্রমাণের সীমা ও মাপার পদ্ধতি

লাইভ সাইটের homepage, robots, sitemap, একাধিক service ও guide এবং অনুপস্থিত পেজ/আইকনের কনটেন্ট web fetch দিয়ে দেখা হয়েছে। Fetch redirect অনুসরণ করে; raw response status, HTTP headers, redirect-এর প্রতিটি ধাপ, server/CDN configuration বা Googlebot-এর অভিজ্ঞতা দেখায় না। HTTP ও `www` homepage fetch শেষে canonical HTTPS homepage পাওয়া গেছে, কিন্তু কোন status বা কত ধাপে পৌঁছেছে তা নিশ্চিত নয়। স্থানীয় source, generated `dist/`, পরীক্ষার ফল ও GitHub workflow আলাদাভাবে দেখা হয়েছে।

Google Search Console ও Google Analytics connector এই সেশনে সমর্থিত নয়। তাই **index coverage, canonical selection, impressions, clicks, CTR, Google ranking, search volume, keyword difficulty, organic leads, Business Profile ও field Core Web Vitals অজানা**। Search-engine discovery বা `site:` search কোনো সম্পূর্ণ indexing কিংবা Bangladesh Google ranking audit নয়। নিচের কিওয়ার্ড priority ব্যবসার উদ্দেশ্যভিত্তিক অনুমান, মাপা demand নয়।

## অগ্রাধিকারের অডিট — লাইভ ও লোকাল আলাদা

| অগ্রাধিকার | যাচাই করা পর্যবেক্ষণ | প্রভাব ও প্রয়োজনীয় পদক্ষেপ |
|---|---|---|
| **P0 / প্রকাশনা** | লাইভ sitemap-এ ১৪টি URL; নতুন নিজের নামে প্যাকেট গাইড এবং `/favicon.png` fetch-এ 404 পেজের কনটেন্ট এসেছে। লোকাল পূর্ববর্তী build-এ ১৫টি URL ও আসল লোগোর আইকন আছে। | উন্নত সম্পূর্ণ build এখনো লাইভ নয়। সত্যিকারের image/guide HTTP response ও সব পেজের বর্তমান প্রকাশনা owner-authorized deploy-এর পরে পরীক্ষা করুন। Fetch দিয়ে লাইভ HTTP status নিশ্চিত হয়নি। |
| **P1 / প্রমাণ ও নিরাপত্তা** | লাইভ/আগের কনটেন্টে কিছু material, বাধা-ক্ষমতা, shrink seal, খাবার/ঔষধের ব্যবহার, ফিনিশিং, সময়, মূল্য ও অর্ডারের নির্দিষ্ট তথ্য আছে; স্বাধীন মালিক/প্রস্তুতকারকের প্রমাণ পাওয়া যায়নি। | কোনো অনুমানকে সনদ বা গ্যারান্টি করবেন না। মালিক materials, food-contact ও regulatory evidence, সক্ষমতা, দাম, MOQ, timing এবং নমুনা প্রকাশের অনুমতি লিখিতভাবে যাচাই করবেন। |
| **P1 / মাপজোক ও privacy** | বিদ্যমান source-এ Meta Pixel PageView, WhatsApp Contact ও QuotePrepared event আছে। GA4/GTM tag বা GSC verification marker source-এ পাওয়া যায়নি; অ্যাকাউন্ট বা DNS verification আছে কি না অজানা। | আগে owner access ও privacy review। Quote fallback-এ `wa.me`-এর query-তে গ্রাহকের নাম/ফোনসহ message থাকতে পারে; GA4 enhanced outbound click-এর full URL পাঠালে ব্যক্তিগত তথ্য ফাঁস হতে পারে। নিরাপদ বাস্তবায়ন ছাড়া এটি চালু করবেন না। |
| **P1 / crawl ও index** | লাইভ robots কনটেন্টে crawl অনুমোদন ও canonical sitemap আছে। লাইভ অজানা পেজে 404 কনটেন্ট দেখা গেলেও raw status জানা নেই। | Deploy-এর পরে robots/XML/image-এর content type, বাস্তব 404 status, trailing slash, canonical, index/noindex, GSC URL Inspection ও sitemap পরীক্ষা করুন। |
| **P1 / প্রাসঙ্গিকতা** | লোকাল build-এ homepage, ১০টি service ও ৪টি guide-এর স্বতন্ত্র HTML, title, description, H1 ও canonical আছে; প্রাসঙ্গিক বাংলা/English product নাম ও WhatsApp পথ আছে। লাইভে আগের সংস্করণের content দেখা গেছে। | বিদ্যমান URL-এ নির্দিষ্ট ক্রয়-প্রশ্ন, স্বচ্ছ তথ্য, আর্টওয়ার্ক প্রস্তুতি ও সম্পর্কিত গাইড যুক্ত করুন। উদ্দেশ্য আলাদা না হলে duplicate landing/location page নয়। |
| **P2 / মাপা হয়নি এমন কর্মক্ষমতা** | লোকাল pre-change homepage HTML 155,470 bytes (gzip 19,716), initial JS bundle 409,930 bytes (gzip 112,081); product images-এর অধিকাংশ lazy ও WebP। লোগো image-এ intrinsic width/height ছিল না। | অনাবশ্যক below-fold interactive tool-এর কোড চাহিদামতো লোড এবং image dimensions যুক্ত করা যায়। এটি lab payload, field LCP/INP/CLS নয়; PSI/CrUX ও বাস্তব ডিভাইসে মাপতে হবে। |
| **P2 / structured data** | লোকাল JSON-LD-তে LocalBusiness, WebSite, WebPage; service-এ Service ও BreadcrumbList, guide-এ Article ও BreadcrumbList আছে। রিভিউ/রেটিং তৈরি করা হয়নি। ঠিকানা ও সময় schema-তে আলাদাভাবে hardcoded; Article image হিসেবে একটি সাধারণ social card ব্যবহৃত। | Owner address, hours, phone, logo ও বাস্তব সেবা যাচাই করবেন। Article-এর জন্য ভবিষ্যতে অনুমতিপ্রাপ্ত প্রাসঙ্গিক ছবি ও প্রকৃত প্রকাশ/সংশোধনের তারিখ থাকলে যুক্ত করুন, তারিখ বানিয়ে নয়। JSON parse করা Google Rich Results Test বা Schema Markup Validator-এর বিকল্প নয়। [1](https://developers.google.com/search/docs/appearance/structured-data/article) |
| **P2 / trust ও promotion** | বাস্তব portfolio/backlink profile, verified Business Profile, লিখিত product certificate এবং customer attribution যাচাই করা যায়নি। | অনুমতিপ্রাপ্ত নিজস্ব কাজের ছবি, সত্যিকারের case study ও স্বেচ্ছায় নিরপেক্ষ review; প্রাসঙ্গিক বৈধ citations/partners। Fake review, কেনা spam links, doorway pages নয়। |

## কিওয়ার্ড রিসার্চ ও পেজ ম্যাপ

[স্প্রেডশিটে ৩৩টি বাংলা/English query, intent, buyer segment, canonical URL ও অগ্রাধিকারের কারণ](KEYWORD-MAP.bn.csv)। CSV-টি UTF-8 BOM-সহ; Excel-এ Data → From Text/CSV থেকে UTF-8 দিয়ে খুললে বাংলা দেখা যাবে। সব monthly volume ও keyword difficulty `অজানা` রাখা হয়েছে; কোনো সংখ্যা, ranking বা প্রতিযোগিতার স্কোর অনুমান করা হয়নি। কিওয়ার্ড/URL mapping কনটেন্ট লেখার আগে তৈরি।

| মূল intent cluster | প্রধান canonical পেজ | কেন |
|---|---|---|
| প্যাকেজিং কোম্পানি / packaging & printing | `/` | বাস্তব ব্যবসা ও সেবার প্রধান হাব |
| পলি প্যাকেট / LD packet printing | `/services/ld-packet/` | নির্দিষ্ট ফরম্যাটে ক্রয় উদ্দেশ্য |
| ফয়েল প্যাকেট / custom pouch | `/services/foil-packet/` | ফয়েল পাউচের আলাদা সেবা |
| প্যাকেজিং বক্স / কার্টন | `/services/custom-box/` | বক্সের মাপ, বোর্ড ও ডিজাইন |
| স্টিকার / label printing | `/services/sticker/` | প্যাকেট, বোতল ও জারের লেবেল |
| রেডিমেড প্যাকেট / zipper pouch | `/services/ready-made/` | সাইজ ও স্টক আলোচনা |
| নিজের নামে প্যাকেট কীভাবে | `/guides/own-brand-packet-printing/` | বিস্তৃত ধাপভিত্তিক প্রশ্ন; service page-এ লিংক |
| food packaging printing / খাবারের প্যাকেট | `/guides/food-packaging-printing/` | চাহিদা ও food-contact প্রমাণ যাচাই; LD/ফয়েল/বক্স/লেবেলে প্রাসঙ্গিক লিংক |
| অফসেট / commercial printing | `/services/offset/` | বিদ্যমান commercial service; আলাদা পাতলা English URL নয় |
| মূল্য, ম্যাটেরিয়াল তুলনা, ছোট ব্যবসা | তিনটি বিদ্যমান সংশ্লিষ্ট `/guides/` | তথ্যভিত্তিক প্রশ্ন থেকে কোটেশন-পথ |

বাংলাদেশে actual search demand বা difficulty জানতে owner-এর Google Ads Keyword Planner-এ location Bangladesh, language Bengali ও English রেখে ধারণা দেখুন; GSC Performance-এ country Bangladesh, query ও landing page export করে এই sheet আপডেট করুন। নতুন সংখ্যা পেলে তার date, source এবং ranges লিখুন। Index status, impressions বা ranking অনুপস্থিত থাকলে `অজানা` রাখুন। English search term বাংলা পেজে স্বাভাবিকভাবে ব্যবহার করা যায়; প্রকৃত পূর্ণ অনুবাদ ছাড়া hreflang বা ডুপ্লিকেট English page তৈরি করা হয়নি।

## প্রতিযোগী পর্যবেক্ষণ — search position নয়

এগুলো discovery-এর পরে পেজ পর্যবেক্ষণ, কোনো verified Google Bangladesh ranking, traffic বা backlink estimate নয়। প্রতিযোগীর capability/certification এই ব্যবসার জন্য প্রমাণ নয়; ছবি বা কপি অনুলিপি করবেন না।

| পেজ | যা দেখা গেছে | নিরাপদ শেখার বিষয় |
|---|---|---|
| [1](https://canvasdpa.com/product/sticker-printing-in-bangladesh/) | স্টিকারের আলাদা পেজ, ছবি, size/material/finishing প্রশ্ন ও quote পথ। | নিজের যাচাইকৃত specification এবং প্রয়োজনীয় প্রশ্নসহ quote path স্পষ্ট করুন; তাদের MOQ, দাম বা সুবিধা কপি নয়। |
| [1](https://packagingbd.com/) | বাংলা সেবা, pouch format, material এবং বিভিন্ন ব্যবহার আলোচনা। | ব্যবহারের চাহিদা ও বাছাইয়ের কারণ ব্যাখ্যা; নিজের supply এবং food-contact evidence ছাড়া সমতুল্য দাবি নয়। |
| [1](https://idealfibrebd.com/flexible-packaging/) | flexible packaging-এর material, format ও শিল্প প্রয়োগের ব্যাখ্যা। | পরবর্তীতে প্রমাণিত নিজস্ব specifications ও অনুমতিপ্রাপ্ত বাস্তব কাজ যুক্ত করুন; অন্য প্রতিষ্ঠানের machine/capacity নিজের বলে লিখবেন না। |

Backlink বা referring-domain database পাওয়া যায়নি; তুলনামূলক authority, backlink সংখ্যা ও link gap অজানা। বিচিত্র gambling links দেখা `repack.com.bd`-কে trusted backlink হিসেবে সুপারিশ করা হচ্ছে না। সত্যিকারের supplier/customer/association সম্পর্ক, ব্যবসায়িক ডিরেক্টরি ও নিজস্ব সহায়ক রিসোর্সভিত্তিক outreach আগে owner vet করবেন; link exchange network/paid spam নয়।

## বাস্তবায়ন ও যাচাইয়ের অবস্থা

### সম্পন্ন — শুধু repository ও local build-এ

- ৩৩টি query-র intent → গ্রাহক → canonical URL → অগ্রাধিকার ম্যাপ; volume ও difficulty অজানা। বিদ্যমান দশটি সেবা URL বজায় আছে, duplicate শহর বা পাতলা ইংরেজি page তৈরি হয়নি।
- খাদ্যপণ্যের packaging printing নিয়ে ৭-অংশের ব্যবহারিক বাংলা গাইড, food-contact নথি ও পরীক্ষা-সংক্রান্ত সতর্কতা, পাঁচটি সংশ্লিষ্ট service link এবং ওই service পেজগুলো থেকে গাইডে crawlable link। বিদ্যমান নিজের নামে প্যাকেট গাইড ও আসল ব্র্যান্ড ফেভিকন/লোগোও build-এ আছে।
- Sticker ও offset পেজে আলাদা artwork, surface ও কোটেশন প্রস্তুতির নির্দেশনা; foil, box ও shrink seal-এর কিছু অযাচাইকৃত সুরক্ষা-নিশ্চয়তা সতর্ক ভাষায় সংশোধন। Service page-এ উপযোগিতা, সনদ, MOQ, দাম ও সময় নিশ্চিত করার নির্দেশনা। সব পুরোনো সুনির্দিষ্ট service/material/price/সময় **এখনো owner verification প্রয়োজন**।
- Product Finder-এ যাচাইহীন hardcoded MOQ, delivery ও free-design প্রতিশ্রুতি সরানো; খাদ্য ও ঔষধ সংক্রান্ত নির্দিষ্ট নিশ্চয়তা বা আইনগত সিদ্ধান্তের বদলে প্রমাণ/বিধি যাচাইয়ের নির্দেশনা। WhatsApp, quote form ও বিদ্যমান Meta Pixel event সংরক্ষিত। কোনো GA measurement ID, fake review, সনদ বা tracking account যোগ করা হয়নি।
- মূল SEO content prerendered রেখে optional finder/calculator-এর code শুধু প্রয়োজন হলে লোড; deep-link ও calculator-এ যাওয়া বজায়; JavaScript বন্ধ বা chunk failure-এ সরাসরি WhatsApp fallback। Logo image-এর intrinsic dimensions এবং decorative tracker-এর empty alt যোগ করা হয়েছে।
- Post-deploy checker-এ sitemap-এর অতিরিক্ত/duplicate URL, indexability header, unique metadata, JSON-LD syntax, asset/content type, canonical ও 404 পরীক্ষা; canonical production host-এ চালালে HTTP/www/slash permanent redirect chain-ও পরীক্ষা করে। স্বয়ংক্রিয় checker-এর negative tests-ও আছে।

### আগে/পরে — একই স্থানীয় পরীক্ষার পরিবেশ

| পরীক্ষা | কাজের আগের baseline | এই build |
|---|---|---|
| Pre-rendered canonical sitemap URL | ১৫ | ১৬: homepage + ১০ service + ৫ guide |
| Homepage HTML | 155,470 bytes; gzip 19,716 | 142,772 bytes; gzip 17,350 |
| Initial JS bundle | 409,930 bytes; gzip 112,081 | 375,593 bytes; gzip 104,781; optional tool chunk পরে লোড |
| Homepage `img` | ১৮; decorative tracker-এ alt ছিল না, ২টি logo-তে width/height ছিল না | ১৮; সবগুলোতে alt ও width/height আছে |
| Automated SEO | ২২টি pass | ২৭টি pass; canonical, metadata, sitemap, links, JSON parse, icon, content, noindex ও checker-এর failure cases |
| Browser | ৩৩টি pass, ১৫টি ইচ্ছাকৃত skip | ৩৫টি pass, ২১টি ইচ্ছাকৃত skip; ৩২০/৩৯০/৭৬৮/১৪৪০ px, ফর্ম, tools, JS-off fallback ও mobile/desktop automated axe checks |
| Local HTTP smoke | robots, sitemap, ১৫ route, icons ও 404 pass | robots, sitemap, ১৬ route, চারটি icon/logo ও প্রকৃত 404 pass; local JSON-LD syntax ও canonical পরীক্ষা |

Bytes Node gzip দিয়ে স্থানীয় build-এ মাপা; এটি network transfer, PageSpeed score বা field Core Web Vitals নয়। Browser skips বারবার একই mobile-only/desktop-only পরীক্ষা না চালানোর জন্য পরিকল্পিত। Automated axe scan সম্পূর্ণ accessibility certification নয়। Local preview-র HTTP result production host-এর প্রমাণ নয়। পূর্বের লাইভ ১৪-URL sitemap ও 404 **page content**-এর তথ্য থেকে live HTTP status, নতুন build deploy বা indexability নিশ্চিত করা যায় না।

### Pending — প্রকৃত অ্যাক্সেস ছাড়া করা হয়নি

Production deployment ও post-deploy raw HTTP/redirect test; Google Rich Results Test/Schema Markup Validator; GSC property verification, sitemap submission, URL Inspection/indexing; GA4 consent ও privacy-safe setup; Business Profile verification; backlink audit; keyword volume/difficulty ও real-user CWV—সবই pending। কোনো ranking, favicon display, indexing, lead বা revenue ফলাফল দাবি করা হচ্ছে না।

## মালিকের প্রকাশ-পূর্ব যাচাই তালিকা

- [ ] `src/data/services.ts`-এ প্রতিটি সেবা সত্যিই দেওয়া হয় কি না; নিজস্ব উৎপাদন/সাবকন্ট্রাক্ট, উপকরণ, রং, ফিনিশিং, seal ও cylinder-এর সক্ষমতা যাচাই। কোনো product category, material বা সনদের ব্যাপ্তি অনুমান করবেন না।
- [ ] মূল্য, MOQ, stock, lead time, ডিজাইন ও payment শর্ত বাস্তব current quotation-এর সঙ্গে মিলিয়ে নিন; `src/components/BudgetEstimator.tsx`-এর rate/MOQ/formula এবং storefront/FAQ-র পুরোনো তথ্যও পর্যালোচনা করুন। ভুল বা যাচাইহীন নির্দিষ্ট তথ্য সংশোধন/সরানোর আগে deploy নয়।
- [ ] খাদ্য/ঔষধ বা সংবেদনশীল পণ্যের contact layer, কালি, আঠা, ব্যবহার, উপযুক্ত পরীক্ষা ও প্রযোজ্য কর্তৃপক্ষের নথি যাচাই করুন। পরীক্ষাবিহীন barrier, shelf-life, food-safe বা tamper-proof নিশ্চয়তা নয়।
- [ ] `src/lib/site.ts`-এর ঠিকানা, ফোন, WhatsApp ও সময় এবং `src/lib/seo.ts`-এর আলাদা structured-data ঠিকানা/সময় মিলিয়ে দেখুন। বর্তমান generic maps search কোনো verified Business Profile pin নয়।
- [ ] লোগো, নমুনার ছবি ও customer-work ব্যবহারের অধিকার/অনুমতি নিশ্চিত করুন; ভবিষ্যতে সত্যিকারের ছবি ও case study যোগ করুন। Meta Pixel ও ভবিষ্যৎ GA4 event-এ privacy/consent এবং ad conversion configuration পর্যালোচনা করুন।
- [ ] আসল hosting provider, কে release অনুমোদন করবেন এবং আগের live release/সার্ভার rules কীভাবে ফিরিয়ে আনা যাবে তা নিশ্চিত করুন।

## Launch, Google access ও পরবর্তী যাচাই

1. মালিক বর্তমান live release/server settings-এর backup নিন এবং verified material, food-contact evidence, সেবার তালিকা, ঠিকানা, ফোন, অফিসের সময়, MOQ/মূল্য, ডিজাইন সাপোর্ট, সময়, ছবি ও customer permission নিশ্চিত করুন। সনদ না থাকলে সনদের দাবি করবেন না। বর্তমান repository-তে `netlify.toml` ও Apache `.htaccess` আছে, কিন্তু বাস্তব host/deploy path যাচাই হয়নি। GitHub-এর Website quality workflow পরীক্ষা চালায়, deploy workflow নয়; GitHub deployment record পাওয়া যায়নি। হোস্টিং provider ও অনুমোদিত release পদ্ধতি মালিককে নিশ্চিত করতে হবে।
2. Node 22 দিয়ে `npm ci && npm test`; অনুমোদিত hosting-এ সম্পূর্ণ `dist/` প্রকাশ করুন। সেবা/গাইড directory, assets, `robots.txt`, `sitemap.xml`, 404 এবং host-specific configuration বাদ দেবেন না। Unknown URL-এ প্রকৃত 404, canonical URL-এ 200 এবং image-এ image content type নিশ্চিত করুন। এরপর live access আছে এমন পরিবেশে `npm run check:live-seo` চালান। Google-এ submit করার আগে সব failure সংশোধন করুন।
3. GSC-তে বিদ্যমান property থাকলে সেটিই ব্যবহার করুন; নাহলে `smartpackagingbd.com` Domain property যোগ করুন, **owner নিজে DNS TXT record** দিয়ে verify করুন। বিকল্প: সঠিক URL-prefix property-তে Google প্রদত্ত HTML-file/meta-tag method। কোনো অনুমোদিত মানব সহযোগীকে access দিতে চাইলে GSC → Settings → Users and permissions → Add user ব্যবহার করুন। এই সেশনে connector সমর্থিত নয়, তাই এখানে invite দিয়ে সরাসরি access পাওয়া যাবে না; চাইলে Bangladesh-filtered query/page ও index report-এর ব্যক্তিগত তথ্যবিহীন export attachment হিসেবে দিন। Password, verification token বা customer data chat-এ দেবেন না। GSC → Sitemaps-এ `https://smartpackagingbd.com/sitemap.xml` submit; URL Inspection-এ homepage, food guide, own-brand guide ও প্রধান services-এর live test, Google-selected canonical ও index status দেখুন; প্রয়োজনমতো indexing request দিন। Submission crawl/indexing নিশ্চিত করে না।
4. [Google Rich Results Test](https://search.google.com/test/rich-results) ও [Schema Markup Validator](https://validator.schema.org/) দিয়ে homepage, service ও guide-এর প্রকাশিত URL পরীক্ষা করুন। Google supported feature নাও দেখাতে পারে। `/favicon.png` ও `/brand-logo.png` crawlable রাখুন; favicon Search-এ দেখানো Google-এর সিদ্ধান্ত, গ্যারান্টি নয়।
5. GA4 access/সম্মতি নিয়ে বিদ্যমান property/stream থাকলে সেটিই ব্যবহার করুন। অনুমোদিত মানব সহযোগীকে access দেওয়ার প্রয়োজন হলে GA4 Admin → Property access management → Add users ব্যবহার করুন; এখানে connector সমর্থিত নয়, তাই প্রয়োজনে ব্যক্তিগত তথ্যবিহীন aggregate report export দিন। ID owner-এর অনুমোদিত deployment configuration-এ বসান; এই repository-তে কোনো অনুমান করা measurement ID যোগ করা হয়নি। **Enhanced measurement outbound clicks বন্ধ রাখুন যতক্ষণ `link_url`-এ WhatsApp-এর prefilled customer name/phone/message না পাঠানোর সমাধান ও consent যাচাই না হচ্ছে**। পরীক্ষিত custom events-এ কেবল controlled `method`, `page_type`, `service_category` রাখুন; full URL, query, নাম, ফোন বা form text নয়। Tag Assistant/DebugView দিয়ে পরীক্ষা করুন। `contact_click` ও `quote_prepared` = আগ্রহ; WhatsApp message sent, qualified lead বা sale নয়। Consent ও privacy আইন/নীতি মালিক ও উপদেষ্টা যাচাই করবেন। বর্তমান Meta Pixel events বা ad conversion configuration পরিবর্তনের আগে owner review দরকার। [1](https://support.google.com/analytics/answer/9216061?hl=en)
6. বিদ্যমান Google Business Profile খুঁজে claim/verify করুন; duplicate নয়। প্রকৃত নাম, ঠিকানা, category, ফোন, business hours ও verified pin মিলান। মালিকানার প্রমাণ ছাড়া location, review, award বা social profile যোগ নয়।
7. মোবাইলে PageSpeed Insights এবং GSC Core Web Vitals-এ field LCP, INP ও CLS দেখুন; device/network, sample size ও date নোট করুন। Lab payload বা ভিজ্যুয়াল চেক field performance প্রমাণ নয়। [2](https://developers.google.com/search/docs/appearance/core-web-vitals)

## Rollback ও কাজের নিরাপত্তা

নতুন কাজের আগে dirty worktree-এর non-destructive snapshot রাখা হয়েছে `/home/user/smart-printing-pre-master-seo-20261028/`-এ: base commit, tracked patch, untracked archive ও status। এটি আগের uncommitted কাজও ধরে; `git reset --hard` করবেন না। Snapshot-টি আলাদা temporary directory-তে reconstruct করে patch ও ফেভিকন/গাইডের উপস্থিতি পরীক্ষা করা হয়েছে। প্রয়োজন হলে repository থেকে একটি **নতুন** directory-তে আগের অবস্থার অনুলিপি পুনর্গঠন করুন:

```sh
snapshot=/home/user/smart-printing-pre-master-seo-20261028
restore=$(mktemp -d /home/user/smartprint-restore-XXXXXX)
git archive "$(cat "$snapshot/base-commit.txt")" | tar -x -C "$restore"
(cd "$restore" && git apply --check "$snapshot/tracked-changes.patch" && git apply "$snapshot/tracked-changes.patch")
tar -xzf "$snapshot/untracked-files.tar.gz" -C "$restore"
printf 'পুনর্গঠিত অনুলিপি: %s\n' "$restore"
```

যাচাইয়ের পর প্রয়োজনীয় নির্দিষ্ট file তুলুন—বর্তমান কাজের ওপর অন্ধভাবে overwrite নয়। Production rollback-এর জন্য মালিকের host-এ deploy-পূর্ব **সম্পূর্ণ live release** ও server rules backup রাখুন; সমস্যায় অনুমোদিত host প্রক্রিয়ায় সেই release ফিরিয়ে HTTP, asset, form ও contact path আবার পরীক্ষা করুন। Repository snapshot production server backup নয়।

## ৯০ দিনের বাস্তবসম্মত পরিকল্পনা

- **দিন ১–৩০: ভিত্তি।** Owner verification ও privacy review; পূর্ণ build পরীক্ষা/অনুমোদিত deploy; GSC verification, sitemap ও URL inspection; Business Profile claim; GA4 সম্মতিসহ নিরাপদ baseline; PageSpeed/field reports সংগ্রহ। কাজের দায়িত্ব: owner + developer। KPI: verified URL/issue status এবং measured baseline, পূর্বনির্ধারিত ranking নয়।
- **দিন ৩১–৬০: প্রমাণ ও conversion।** Search Console-এর বাংলাদেশ query/page data দেখে priority ঠিক করুন; প্রধান পেজে যাচাইকৃত কনটেন্ট ও অনুমতিপ্রাপ্ত কাজের নমুনা; পরিষ্কার quote প্রশ্ন/WhatsApp flow পরীক্ষা; ১টি প্রকৃত কেস স্টাডি যদি অনুমতি ও তথ্য পাওয়া যায়; বৈধ business citations যাচাই। KPI: non-brand impressions/clicks, relevant enquiries, quote-prepared (ব্যাখ্যাসহ), indexed canonical।
- **দিন ৬১–৯০: তথ্যভিত্তিক উন্নয়ন।** গত সময়ের query-to-page map ও quality leads পর্যালোচনা; CTR কম হলে তথ্যপূর্ণ title/description পরীক্ষা; বাস্তব field CWV অনুযায়ী image/JS ও mobile উন্নতি; validated product evidence থাকলে আরেকটি উপকারী গাইড। KPI: ২৮ দিনের তুলনায় movement, conversion quality, technical issue resolution। Seasonal ও ছোট sample-এ সিদ্ধান্ত সতর্ক; ফলাফল বা #1 ranking গ্যারান্টি নয়।

## মাসিক রিপোর্ট টেমপ্লেট

**সময়কাল / আগের তুলনাকাল / timezone / data source:** ____

**Deploy ও content change + dates:** ____

**GSC Bangladesh:** clicks __; impressions __; CTR __; average position __; প্রধান brand/non-brand query ও landing URL __; note: position query mix ও ব্যক্তিকরণে বদলায়।

**Indexing:** submitted __; indexed __; excluded কারণ __; Google-selected canonical issue __; sitemap last read __।

**Mobile field data (sample/date সহ):** LCP __; INP __; CLS __; পর্যাপ্ত data না থাকলে `অজানা`।

**GA4/ব্যবসার নিজস্ব record:** organic sessions __; sanitized contact clicks __; quote-prepared __; qualified enquiries __; confirmed orders __; conversion definition ও deduplication __। ক্লিককে message/lead/sale বলে গণনা নয়।

**Business Profile ও সত্যিকারের mentions:** __ (owner-verified); **availability/capability পরিবর্তন:** __।

**Top insights, issues, hypothesis, next action, owner, due date:** ____। কোনো তথ্য না থাকলে `অজানা` লিখুন; কৃত্রিম শূন্য নয়।

## নীতিমালা ও রেফারেন্স

- [1](https://developers.google.com/search/docs/appearance/favicon-in-search) — স্থায়ী crawlable favicon; প্রদর্শন নিশ্চিত নয়।
- [15](https://developers.google.com/search/docs/appearance/structured-data/organization?hl=en) — বাস্তব প্রতিষ্ঠানের logo/organization schema।
- [1](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) — প্রকৃত crawlable links ও বর্ণনামূলক anchor text।
- [2](https://developers.google.com/search/docs/appearance/google-images) — ছবির অর্থবহ alt; keyword stuffing নয়।
- [10](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) — মূল content interaction-এর পেছনে লুকানো নয়।
- [8](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — বৈধ markup থাকলেও Google display নিশ্চিত নয়।
