# Smart Printing Packaging

Product-first Bengali printing and packaging website for https://smartpackagingbd.com.
Built with React, TypeScript and Vite. Production builds export complete HTML for the homepage, ten services and three guides; React hydrates the same content for interactive tools and forms.

## Develop and preview

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

To test the actual static export, including page-specific metadata and HTTP routing:

```sh
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## Verify before merging

```sh
npm ci
npx playwright install --with-deps chromium
npm test
```

`npm test` runs TypeScript validation, the production build, SEO regression tests and Playwright browser tests. The browser suite checks four viewport sizes, all exported routes, explicit `index.html` URLs, filters, mobile menu, quote validation, the finder/calculator, no-JavaScript content and accessibility. Broader mobile accessibility and route-alias sweeps run once rather than redundantly across every viewport; those deliberate skips are not unfinished tests.

External analytics, map and WhatsApp requests are blocked in browser tests; no customer messages are sent. Browser reports go into ignored `playwright-report/` and `test-results/` directories. GitHub Actions runs the same checks for pull requests.

Optional: set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use a locally supplied Chromium binary in a restricted environment. Normal development and GitHub Actions use Playwright's managed browser.

## Deploy

Publish the **entire `dist/` directory**, not only `index.html`. Service and guide directories, assets, fonts, `robots.txt`, `sitemap.xml` and `404.html` must all be uploaded. Do not rewrite unknown URLs or SEO files to the homepage.

- Netlify: `netlify.toml` configures the build, publish directory and HTTP 404 fallback.
- Apache/cPanel: upload `dist/.htaccess` as well; remove conflicting SPA fallback rules. Server override permission is required.
- Other static hosts: configure directory indexes and true HTTP 404 responses using the provider's settings.

After deployment, from an environment with access to the live domain:

```sh
npm run check:live-seo
```

This checks the live site's robots/XML responses, all expected canonical URLs, WhatsApp links and true 404 handling. It does not submit to Google or measure rankings.

## Edit content

- `src/lib/site.ts`: company details, office phone, shared WhatsApp number, address and domain.
- `src/data/services.ts`: service facts, sample images and quote form values.
- `src/lib/seo.ts`: page titles, descriptions and factual structured data.
- `src/data/guides.ts`: packaging guides.
- `src/components/Services.tsx`: storefront labels and custom service order.
- `scripts/optimize-images.mjs`: regenerate WebP variants and the social card with `npm run optimize:images` after changing original images.

All WhatsApp enquiries use **01660191039**. The office telephone remains separate. Prices, minimum orders and timelines must be confirmed by the business before publication. Do not add fabricated reviews, ratings, certifications or location pages.

See the Bengali audit and launch instructions:

- [SEO and UX audit](docs/SEO-AUDIT.bn.md)
- [Deployment and Google launch checklist](docs/SEO-LAUNCH.bn.md)

Merging code is not the same as deploying it. Search Console verification, sitemap submission and Google Business Profile verification require the owner's access. No ranking position is guaranteed.
