import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC_ORIGIN = 'https://www.propiedadesenchiapas.com';

const SOURCES = {
  'bella-vista': 'bella-vista-terrenos-en-ocozocoautla-en-pagos',
  'colinas-del-campestre': 'colinas-del-campestre',
  'cuauhtli-terrenos-en-venta-en-el-jobo': 'cuauhtli-terrenos-en-venta-en-el-jobo',
  'el-higo-copoya-terrenos-10x20-en-copoya': 'el-higo-copoya-terrenos-10x20-en-copoya',
  'fraccionamiento-montecristo': 'fraccionamiento-montecristo',
  'la-canada-desarrollo-eco-campestre': 'la-canada-desarrollo-eco-campestre',
  'la-sima-park-terrenos-en-ocozocoautla': 'la-sima-park-terrenos-en-ocozocoautla',
  'monte-de-los-olivos': 'monte-de-los-olivos',
  'quinta-en-berriozabal': 'quinta-en-berriozabal'
};

const clean = (value = '') => value.replace(/\s+/g, ' ').trim();
const unique = values => [...new Set(values.filter(Boolean))];

function localMedia(source) {
  const base = path.join(ROOT, 'public', source);
  const found = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      if (entry.isFile() && /\.(png|jpe?g|webp|gif|mp4|webm|mov)$/i.test(entry.name)) {
        const relative = path.relative(path.join(ROOT, 'public'), absolute).split(path.sep).join('/');
        if (!/favicon|icon-|logo|search\.png|meh7\.png/i.test(relative)) found.push(`${PUBLIC_ORIGIN}/${relative}`);
      }
    }
  };
  visit(base);
  return found;
}

function publicUrl(source, value) {
  if (!value || value.startsWith('data:') || value.startsWith('#')) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/')) return `${PUBLIC_ORIGIN}${value}`;
  const normalized = path.posix.normalize(`/${source}/${value.replace(/^\.\//, '')}`);
  return `${PUBLIC_ORIGIN}${normalized}`;
}

function extract(slug, source) {
  const file = path.join(ROOT, 'public', source, 'index.html');
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  $('script, style, noscript, svg, form, nav, header, footer').remove();

  const textOf = element => clean($(element).text());
  const headings = unique($('h1,h2,h3').map((_, element) => textOf(element)).get())
    .filter(value => value.length >= 3 && value.length <= 180);

  const sections = [];
  $('section').each((index, element) => {
    const section = $(element);
    const title = clean(section.find('h1,h2,h3').first().text()) || `Sección ${index + 1}`;
    const lines = unique(section.find('p,li').map((_, item) => clean($(item).text())).get())
      .filter(value => value.length >= 3 && value.length <= 900);
    if (!lines.length && title.startsWith('Sección ')) return;
    sections.push({ title: title.slice(0, 180), body: lines.join('\n') });
  });

  const images = [];
  $('img[src],source[srcset]').each((_, element) => {
    const raw = $(element).attr('src') || ($(element).attr('srcset') || '').split(',')[0]?.trim().split(' ')[0];
    const url = publicUrl(source, raw);
    if (url && !/favicon|icon-|logo|search\.png|meh7\.png/i.test(url)) images.push(url);
  });

  const videos = [];
  $('video[src],video source[src],iframe[src]').each((_, element) => {
    const url = publicUrl(source, $(element).attr('src'));
    if (url && (/\.(mp4|webm|mov)(\?|$)/i.test(url) || /youtube|youtu\.be|vimeo/i.test(url))) videos.push(url);
  });

  const featureSections = $('section').filter((_, element) => {
    const marker = `${$(element).attr('id') || ''} ${$(element).attr('class') || ''} ${$(element).find('h1,h2,h3').first().text()}`;
    return /amenidad|beneficio|caracter[ií]stica|incluye|por qu[eé]|ventaja/i.test(marker);
  });
  const features = unique(featureSections.find('h3,h4,li,strong').map((_, element) => textOf(element)).get())
    .filter(value => value.length >= 3 && value.length <= 180);

  const paragraphs = unique($('main p, section p').map((_, element) => textOf(element)).get())
    .filter(value => value.length >= 12 && value.length <= 300);

  const diskMedia = localMedia(source);

  return {
    landing_slug: slug,
    canonical_key: slug,
    template_key: source,
    headline: headings[0] || '',
    subheadline: headings[1] || paragraphs[0] || '',
    tagline: paragraphs[0] || '',
    images: unique([...images, ...diskMedia.filter(url => /\.(png|jpe?g|webp|gif)$/i.test(url))]).slice(0, 60),
    video_urls: unique([...videos, ...diskMedia.filter(url => /\.(mp4|webm|mov)$/i.test(url))]).slice(0, 10),
    features: features.slice(0, 80),
    content_sections: sections.slice(0, 30)
  };
}

const result = Object.entries(SOURCES).map(([slug, source]) => extract(slug, source));
process.stdout.write(JSON.stringify(result));
