# SEO ও UX অডিট — Smart Printing Packaging

**পরিদর্শনের তারিখ:** ২৮ অক্টোবর ২০২৬  
**মূল ওয়েবসাইট:** https://smartpackagingbd.com/  
**পরিধি:** লাইভ হোমপেজের সম্পূর্ণ প্রাপ্ত কনটেন্ট (৫টি অংশ), robots, sitemap ও একটি service URL; উন্নত সংস্করণের ১৪টি build-generated URL, navigation, WhatsApp links, mobile layout ও interaction।

এটি Search Console data, Google ranking position বা real-user Core Web Vitals-এর অডিট নয়—এসব অ্যাক্সেস/ডেটা এই সেশনে পাওয়া যায়নি। নিচের লাইভ সমস্যা ও repository-তে সমাধান আলাদা করে উল্লেখ করা হয়েছে। **এই পরিবর্তন এখনো production-এ deploy বা Google-এ submit করা হয়নি।**

## সবচেয়ে জরুরি ফলাফল

| অগ্রাধিকার | পর্যবেক্ষণ | করা কাজ / পরবর্তী পদক্ষেপ |
|---|---|---|
| P0 | লাইভ `/robots.txt` ও `/sitemap.xml` fetch করলে homepage title/content এসেছে, প্রত্যাশিত robots/XML নয়। | build-এ প্রকৃত robots ও XML আছে। পুরো `dist` deploy করে SPA catch-all সরাতে হবে। Apache ও Netlify-এর static/404 configuration যোগ হয়েছে; অন্য host হলে সমতুল্য routing প্রয়োজন। |
| P0 | লাইভ `/services/ld-packet/`-এ পৃথক LD page নয়, একই homepage পাওয়া গেছে। | ১০টি service URL-এর আলাদা HTML, metadata, canonical ও সেবার বিস্তারিত তৈরি। Deploy-এর পরে প্রত্যেকটি URL সরাসরি পরীক্ষা করতে হবে। |
| P0 | সাধারণ ও packet কাজের জন্য দুই WhatsApp নম্বর ছিল। | সব WhatsApp destination `8801660191039` করা হয়েছে। অফিসে কলের আগের নম্বর সচেতনভাবে অপরিবর্তিত। JSON-LD contactPoint-এও নতুন WhatsApp আছে। |
| P1 | এক হোমপেজে একই প্রোডাক্ট/প্রাইস/সেবার বহু উপস্থাপনা, দীর্ঘ ফর্ম ও অপ্রয়োজনীয় স্ক্রল। | প্রোডাক্ট-first storefront, search/category filter, ৯টি custom service card, সংক্ষিপ্ত তিন ধাপ, ৩টি required field-এর quote form। Calculator/finder চাহিদামতো খোলার disclosure-এ। |
| P1 | লাইভে বড় PNG image ও বাইরের font/image dependency ছিল। | WebP variants বজায়; নতুন storefront-এ স্থানীয় sample ছবি ও self-hosted বাংলা/ইংরেজি fonts। এটি lab optimisation, live speed score মাপা হয়নি। |
| P1 | বিদ্যমান SEO mapping-এ security poly-কে courier poly বলা হয়েছিল, অথচ service data-তে shrink seal। | Metadata, service labels ও internal link text বোতল/জারের shrink seal অনুযায়ী সংশোধিত। ভুল search intent-এ traffic আনা ব্যবসার উপকার করে না। |
| P1 | Quote navigation click-ও Lead হিসেবে track হতো; finder শুরু/শেষ checkout/registration হিসেবে track হতো। | প্রকৃত WhatsApp link click-এ Contact, validated quote preparation-এ QuotePrepared, finder-এ আলাদা custom events। এগুলো confirmed order নয়; বিজ্ঞাপনের conversion rules প্রয়োজন হলে আলাদাভাবে আপডেট করতে হবে। |
| P2 | generic facebook.com link এবং প্রমাণবিহীন customer counter আস্থা দুর্বল করে। | generic Facebook link ও counters নতুন homepage থেকে বাদ। ভুয়া rating/review/schema যোগ করা হয়নি। নিজস্ব কাজের ছবি ও verified profile পরে যোগ করতে হবে। |

### সরাসরি পরীক্ষিত live URL

- https://smartpackagingbd.com/
- https://smartpackagingbd.com/robots.txt
- https://smartpackagingbd.com/sitemap.xml
- https://smartpackagingbd.com/services/ld-packet/

পর্যবেক্ষণগুলো fetch-এর সময়ে পাওয়া কনটেন্টের ভিত্তিতে; raw HTTP headers/status, Googlebot rendering বা live server configuration আলাদাভাবে যাচাই করা হয়নি।

## সার্চ ইন্টেন্ট → সঠিক পেজ

Keyword-এর একই শব্দ অসংখ্যবার লিখলে লাভ হয় না। প্রতিটি পেজকে একটি বাস্তব প্রয়োজনের উত্তর দিতে হবে। নিচের তালিকা content planning-এর জন্য; search volume বা ranking data মেপে তৈরি নয়।

| গ্রাহকের প্রয়োজন / সম্ভাব্য query | লক্ষ্য URL |
|---|---|
| প্যাকেজিং বাংলাদেশ, packaging and printing Dhaka | `/` |
| custom LD packet printing Bangladesh, এলডি প্যাকেট প্রিন্টিং | `/services/ld-packet/` |
| foil packet printing, ফয়েল পাউচ | `/services/foil-packet/` |
| ready made packet, zipper pouch Bangladesh | `/services/ready-made/` |
| box printing Dhaka, কাস্টম প্রিন্টেড বক্স | `/services/custom-box/` |
| sticker label printing Dhaka | `/services/sticker/` |
| packaging printing cylinder | `/services/cylinder/` |
| বোতলের শ্রিংক সিল, security shrink seal | `/services/security-poly/` |
| art paper printing, offset printing | সংশ্লিষ্ট `/services/art-paper/`, `/services/offset/` |
| LD বনাম foil: কোনটি ভালো? | `/guides/ld-vs-foil-packet/` |
| প্যাকেট তৈরির কোটেশন নিতে কী লাগে? | `/guides/packaging-quotation-checklist/` |
| কম বাজেটে ছোট ব্যবসার প্যাকেজিং | `/guides/small-business-packaging/` |

গাইড থেকে সেবার পেজে এবং সেবার পেজ থেকে quotation checklist-এ link আছে। বাংলা পাঠকের জন্য বাংলা কনটেন্টের সঙ্গে প্রচলিত English product নাম রাখা হয়েছে। পরবর্তীতে পূর্ণ English পেজ তৈরি হলে বাস্তব অনুবাদ ও যথাযথ hreflang দিন; এখন অনুবাদ না বানিয়ে কৃত্রিম alternate URL দেওয়া হয়নি।

## প্রকাশের আগে acceptance checklist

- [ ] নতুন build-এর সম্পূর্ণ `dist/` deploy করা হয়েছে, `.htaccess` প্রযোজ্য হলে সেটিও গেছে।
- [ ] ১৪টি sitemap URL-এ নিজস্ব HTML, একটি H1, self-canonical ও HTTP 200 আসে।
- [ ] `/robots.txt` text file ও `/sitemap.xml` XML, homepage fallback নয়।
- [ ] অজানা পথ প্রকৃত 404 দেয়; homepage 200 দিয়ে soft-404 তৈরি হয় না।
- [ ] HTTPS ও www/non-www redirect একটিমাত্র canonical domain-এ; redirect loop নেই।
- [ ] Product ও service quote সব WhatsApp link `01660191039`-এ যায়। নিজের ফোনে একটি test message **ম্যানুয়ালি** পাঠিয়ে reception পরীক্ষা করা হয়েছে। এই সেশনে কোনো গ্রাহক বার্তা পাঠানো হয়নি।
- [ ] দাম, minimum order, অফিস ঠিকানা/সময় ও ডিজাইন সাপোর্টের শর্ত ব্যবসার মালিক নিশ্চিত করেছেন।
- [ ] Google Search Console Domain verification সম্পন্ন; sitemap submit; গুরুত্বপূর্ণ URL inspect ও indexing request করা হয়েছে।
- [ ] Verified Google Business Profile-এ একই business name/address/phone, সঠিক pin/category ও প্রকৃত ছবি আছে।
- [ ] Meta Pixel event পরিবর্তনের সঙ্গে ad conversion configuration মিলিয়ে নেওয়া হয়েছে।

## পরবর্তী কাজ: নিয়মিত উন্নয়ন, একবারের কৌশল নয়

### প্রথম অগ্রাধিকার — crawl ও বাস্তব পরিচয়

Deployment সমস্যা মেটানো, Search Console-এ indexing error দেখা, Google Business Profile verify করা এবং অফিসিয়াল social link নিশ্চিত করা। নিজস্ব factory/product ছবি ছাড়া sample/stock ছবিকে বাস্তব উৎপাদন কেন্দ্র বা গ্রাহকের কাজ বলে দাবি করবেন না।

### এরপর — নিজের কাজের প্রমাণ

অনুমতি নিয়ে বাস্তব কাজের case study যোগ করুন: পণ্যের ধরন, প্যাকেজিংয়ের সমস্যা, নির্বাচিত material/size, কাজের সীমাবদ্ধতা ও নিজস্ব ছবি। ব্যবসায়িক গোপন তথ্য বা গ্রাহকের নাম অনুমতি ছাড়া প্রকাশ করবেন না। প্রকৃত review চাইতে পারেন; fake/paid positive review বা জোরপূর্বক review নয়।

### তারপর — ডেটা অনুযায়ী content ও performance

Search Console-এ বাংলাদেশ filter দিয়ে queries, impressions, clicks, CTR, canonical selection ও indexed pages তুলনা করুন। PageSpeed Insights-এ mobile LCP/INP/CLS দেখুন। বেশি search পাওয়া প্রশ্নের উত্তর সেবার পেজে উন্নত করুন। কেবল অপ্রাসঙ্গিক বড় traffic নয়, WhatsApp-এ আসা উপযুক্ত inquiry ও বাস্তব অর্ডারের মান মাপুন।

## এই সেশনের পরীক্ষার ফল

- TypeScript ও production static build সফল।
- ১৯টি automated SEO/HTML test পাস: unique metadata, self-canonical, valid JSON-LD, sitemap, internal URL/hash, WhatsApp destination ও product-first structure।
- Local static preview-তে robots, XML, ১৪টি route এবং অজানা URL-এর HTTP 404 পরীক্ষা পাস। এটি live domain-এর deployment যাচাই নয়।
- ৩২০, ৩৯০, ৭৬৮ ও ১৪৪০ px viewport-এ সব ১৪টি URL খুলে horizontal overflow ও hydration error পাওয়া যায়নি।
- Product search/filter, service filter, FAQ, keyboard Escape-এ mobile menu বন্ধ, বাংলা অঙ্কের ফোন validation, quote message preparation ও fallback link পরীক্ষা পাস।
- Product Finder ও budget calculator end-to-end পরীক্ষা পাস।
- axe-core-এর WCAG 2 A/AA ও 2.1 AA automated scan-এ ১৪টি page-এর mobile initial state এবং homepage desktop/mobile-এ violation পাওয়া যায়নি; service page-এর একটি contrast issue শনাক্ত করে সংশোধনের পরে আবার পরীক্ষা করা হয়েছে। Automated scan সম্পূর্ণ accessibility certification নয়—বাস্তব screen reader/device পরীক্ষা আরও প্রয়োজন।
- JavaScript বন্ধ রেখে homepage, service ও guide-এর মূল কনটেন্ট দৃশ্যমান। ফর্ম/search/filter JavaScript-নির্ভর; সরাসরি WhatsApp links কাজের বিকল্প হিসেবে আছে।

## কী নিশ্চিত করা হয়নি

Google-এ #1 ranking, নির্দিষ্ট সময়ের মধ্যে indexing, সব packaging-related query-তে উপস্থিতি, rich result পাওয়া বা নির্দিষ্ট traffic বৃদ্ধি নিশ্চিত করা যায় না। প্রতিযোগিতা, search intent, অবস্থান, প্রাসঙ্গিকতা, ব্যবসার সুনাম ও Google-এর সিদ্ধান্ত প্রভাব ফেলে। এই কাজগুলো প্রযুক্তিগত ভিত্তি, user journey এবং প্রাসঙ্গিক কনটেন্ট উন্নত করে—ranking কেনা বা গ্যারান্টি দেওয়ার ব্যবস্থা নয়।

## পুনরায় যাচাই ও merge-পূর্ব সংশোধন

- সরাসরি `/index.html` এবং service/guide-এর `index.html` URL-এ client hydration ভুল পেজে চলে যাওয়ার সমস্যা route normalization দিয়ে ঠিক করা হয়েছে। সব ১৪টি alias browser test-এ যাচাই করা হয়েছে; canonical অপরিবর্তিত।
- service page-এর quotation form-এ সংশ্লিষ্ট service এখন আগে থেকে নির্বাচিত থাকে; গ্রাহক চাইলে বদলাতে পারেন।
- static build-এ HTML insertion marker বা duplicate route থাকলে build ব্যর্থ হবে, যাতে ভুলবশত খালি SPA প্রকাশ না হয়।
- পুনরাবৃত্তিযোগ্য Playwright test suite ও GitHub Actions যোগ করা হয়েছে। স্থানীয় পুনঃপরীক্ষায় ১৯টি SEO test এবং ৩২টি browser test পাস; ১২টি viewport-ভিত্তিক test ইচ্ছাকৃতভাবে বাদ, কারণ সেগুলো নির্ধারিত mobile/desktop project-এ চালানো হয়।
- `README.md`-তে installation, tests, deployment ও live verification-এর নির্দেশনা আছে। Merge বা test পাস হওয়া live deployment/Google indexing সম্পন্ন হওয়ার প্রমাণ নয়।
