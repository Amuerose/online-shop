import fs from 'fs';
import path from 'path';
import { catalogProducts } from '../src/data/catalog.js';

const BASE_URL = 'https://amuerose.cz';
const PUBLIC_DIR = path.resolve('public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');
const today = new Date().toISOString().split('T')[0];

const ensureDir = () => {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
};

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/shop', changefreq: 'daily', priority: '0.9' },
  { path: '/gallery', changefreq: 'weekly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/partnership', changefreq: 'monthly', priority: '0.5' },
  { path: '/valentine', changefreq: 'weekly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
  { path: '/success', changefreq: 'monthly', priority: '0.4' },
  { path: '/data-deletion', changefreq: 'yearly', priority: '0.2' },
];

const productRoutes = (Array.isArray(catalogProducts) ? catalogProducts : [])
  .map((product) => {
    const rawSlug = product?.slug?.toString()?.trim() || product?.id?.toString()?.trim();
    if (!rawSlug) return null;
    const encoded = encodeURIComponent(rawSlug);
    return {
      path: `/product/${encoded}`,
      changefreq: 'weekly',
      priority: '0.8',
    };
  })
  .filter(Boolean);

const buildEntry = ({ path: routePath, changefreq, priority }) => ({
  loc: new URL(routePath, BASE_URL).href,
  changefreq,
  priority,
  lastmod: today,
});

const entriesMap = new Map();

[...staticRoutes, ...productRoutes].forEach((route) => {
  const entry = buildEntry(route);
  entriesMap.set(entry.loc, entry);
});

const entries = [...entriesMap.values()]
  .sort((a, b) => {
    const priorityDiff = parseFloat(b.priority) - parseFloat(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    return a.loc.localeCompare(b.loc);
  });

ensureDir();

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((entry) => [
    '  <url>',
    `    <loc>${entry.loc}</loc>`,
    `    <lastmod>${entry.lastmod}</lastmod>`,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
].join('\n');

fs.writeFileSync(OUTPUT_FILE, xmlLines + '\n', 'utf-8');

console.log(`Generated sitemap with ${entries.length} entries: ${OUTPUT_FILE}`);
