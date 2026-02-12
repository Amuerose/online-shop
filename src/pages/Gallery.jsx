import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { blogBackgroundStyle } from '../styles/blogBackground';
import Seo from '../components/Seo';

// Known extensions
const IMAGE_EXT = ['jpg','jpeg','png','heic','gif','bmp','webp','tiff','svg'];
const VIDEO_EXT = ['mp4','mov','webm'];

// Public folder source
// Put files into: /public/gallery/
// Provide /public/gallery/manifest.json with an array of filenames, e.g. ["1.jpg","2.webp","video.mp4"]
const BASE_URL = import.meta.env.BASE_URL || '/';
const NORMALIZED_BASE = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
const GALLERY_BASE = `${NORMALIZED_BASE}/gallery`;
const MANIFEST_URL = `${GALLERY_BASE}/manifest.json`;
const DIRECTORY_URL = `${GALLERY_BASE}/`;

function MediaItem({ item, onSelect }) {
  const { type, url, title } = item;
  const [src, setSrc] = useState(item.url);

  return (
    <div
      className="mb-4 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer bg-white/10 border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.35),0_10px_28px_rgba(0,0,0,0.12)]"
      onClick={() => onSelect(item)}
    >
      {type === 'image' ? (
        <img
          src={src}
          alt={title || 'Gallery item'}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="w-full h-auto object-cover block"
          onError={() => {
            if (item.fallbackUrl && src !== item.fallbackUrl) setSrc(item.fallbackUrl);
          }}
        />
      ) : type === 'video' ? (
        <video
          src={url}
          className="w-full h-auto object-cover block"
          muted
          autoPlay
          playsInline
          loop
          controls={false}
          preload="metadata"
        />
      ) : null}
    </div>
  );
}

function Gallery() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const shuffle = (arr) => {
          const copy = [...arr];
          for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
          }
          return copy;
        };
        const toItems = (list) => {
          return (list || [])
            .filter((name) => typeof name === 'string' && name && !name.startsWith('.'))
            .map((name) => {
              const ext = name.split('.').pop().toLowerCase();
              let type = null;
              if (IMAGE_EXT.includes(ext)) type = 'image';
              else if (VIDEO_EXT.includes(ext)) type = 'video';
              if (!type) return null;
              const encoded = encodeURIComponent(name);
              const url = `${GALLERY_BASE}/${encoded}`;
              return { title: name, url, type };
            })
            .filter(Boolean);
        };

        // 1) Preferred: manifest.json with an array of filenames
        let list = null;
        const manifestRes = await fetch(MANIFEST_URL, { cache: 'no-store' });
        if (manifestRes.ok) {
          const json = await manifestRes.json();
          if (!Array.isArray(json)) throw new Error('manifest is not an array');
          list = json;
        } else {
          // 2) Fallback: try to parse a server-provided directory listing at /gallery/
          const dirRes = await fetch(DIRECTORY_URL, { cache: 'no-store' });
          if (!dirRes.ok) {
            throw new Error(`manifest not found (${manifestRes.status}) and directory fetch failed (${dirRes.status})`);
          }

          const contentType = dirRes.headers.get('content-type') || '';
          const text = await dirRes.text();

          // Only attempt HTML parsing when the server returns HTML
          if (!contentType.includes('text/html')) {
            throw new Error('directory listing is not available (non-HTML response)');
          }

          const doc = new DOMParser().parseFromString(text, 'text/html');
          const hrefs = Array.from(doc.querySelectorAll('a[href]'))
            .map((a) => a.getAttribute('href') || '')
            .map((h) => h.split('?')[0].split('#')[0])
            .filter((h) => h && !h.startsWith('/') && !h.startsWith('..') && h !== './');

          // Clean up common index formats (may include trailing slashes)
          list = hrefs
            .map((h) => (h.endsWith('/') ? h.slice(0, -1) : h))
            .filter((name) => {
              const ext = name.split('.').pop().toLowerCase();
              return IMAGE_EXT.includes(ext) || VIDEO_EXT.includes(ext);
            });

          if (!list.length) {
            throw new Error('directory listing parsed, but no media links found');
          }
        }

        const mapped = toItems(list);
        if (!cancelled) setItems(shuffle(mapped));
      } catch (e) {
        console.error('Gallery load error:', e);
        if (!cancelled) {
          setItems([]);
          setLoadError(
            t('galleryLoadError', {
              defaultValue:
                'Не удалось получить список файлов галереи. Варианты: (1) добавь /public/gallery/manifest.json (массив имён файлов), или (2) включи листинг директории /gallery/ на сервере.',
            })
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Seo
        title="Галерея Amuerose"
        description="Фотографии шоколадных ягод, коллекций и упаковки Amuerose — вдохновение для подарков и мероприятий."
        canonicalPath="/gallery"
      />
      <div
      className="relative min-h-[100dvh] overflow-y-auto pt-[calc(100px+var(--safe-area-inset-top,0px))] pb-[calc(80px+var(--safe-area-inset-bottom,0px))]"
      style={blogBackgroundStyle}
    >
      <div className="px-4 pb-6">
        <div
          className="columns-2 sm:columns-3 lg:columns-4 2xl:columns-5"
          style={{ columnGap: '16px' }}
        >
          {items.map((item, idx) => (
            <MediaItem key={`${item.title}-${idx}`} item={item} onSelect={setSelectedMedia} />
          ))}
        </div>
      </div>

      {loadError && (
        <div className="px-4 pb-4 text-center text-sm text-red-600">
          {loadError}
        </div>
      )}

      {!loading && !loadError && items.length === 0 && (
        <div className="px-4 pb-4 text-center text-sm text-neutral-500">
          {t('galleryEmpty', {
            defaultValue: 'В папке /public/gallery нет элементов (или manifest пустой).',
          })}
        </div>
      )}

      {loading && (
        <div className="p-4 text-center text-sm text-neutral-500">
          {t('galleryLoading', { defaultValue: 'Загрузка…' })}
        </div>
      )}

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedMedia(null)}
        >
          {selectedMedia.type === 'video' ? (
            <video
              src={selectedMedia.url}
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
              controls
              autoPlay
              playsInline
              loop
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={selectedMedia.url}
              alt="Full view"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setSelectedMedia(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  </>
  );
}

export default Gallery;
