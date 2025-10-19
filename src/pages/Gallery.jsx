import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import Masonry from 'react-masonry-css';

const PAGE_SIZE = 24; // how many objects per batch

// Known extensions
const IMAGE_EXT = ['jpg','jpeg','png','heic','gif','bmp','webp','tiff','svg'];
const VIDEO_EXT = ['mp4','mov','webm'];

// Public bucket base URL (unchanged)
const BUCKET_BASE = 'https://hqputwaqghrbsprtanqo.supabase.co/storage/v1/object/public/product-images';

function useIntersection(ref, { root = null, rootMargin = '0px', threshold = 0.1 } = {}) {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), { root, rootMargin, threshold });
    obs.observe(node);
    return () => obs.disconnect();
  }, [ref, root, rootMargin, threshold]);
  return isIntersecting;
}

function MediaItem({ item, onSelect }) {
  const { type, url, title } = item;
  const ref = useRef(null);
  const visible = useIntersection(ref, { threshold: 0.15, rootMargin: '200px' });

  const [src, setSrc] = useState(item.url);

  // render lightweight skeleton until visible
  return (
    <div
      ref={ref}
      className="mb-4 break-inside-avoid rounded overflow-hidden cursor-pointer"
      onClick={() => type === 'image' && onSelect(src)}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '300px' }}
    >
      {!visible ? (
        <div className="animate-pulse bg-neutral-200/70 dark:bg-neutral-800/50 w-full h-[260px] rounded" />
      ) : type === 'image' ? (
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
          // delay loading until visible to avoid heavy bandwidth
          src={url}
          className="w-full h-auto object-cover block"
          muted
          playsInline
          loop
          controls={false}
          preload="none"
        />
      ) : null}
    </div>
  );
}

function Gallery() {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const sentinelRef = useRef(null);
  const sentinelVisible = useIntersection(sentinelRef, { rootMargin: '600px' });

  const mapFiles = useCallback((list) => {
    return (list ?? [])
      .filter((file) => !!file.name && !file.name.startsWith('.'))
      .map((file) => {
        const ext = file.name.split('.').pop().toLowerCase();
        let type = null;
        if (IMAGE_EXT.includes(ext)) type = 'image';
        else if (VIDEO_EXT.includes(ext)) type = 'video';
        if (!type) return null;
        const encoded = encodeURIComponent(file.name);
        const objectUrl = `${BUCKET_BASE}/${encoded}`;
        if (type === 'image') {
          const renderUrl = `https://hqputwaqghrbsprtanqo.supabase.co/storage/v1/render/image/public/product-images/${encoded}?width=800&quality=75&format=webp`;
          return { title: file.name, url: renderUrl, fallbackUrl: objectUrl, type };
        }
        // video
        return { title: file.name, url: objectUrl, type };
      })
      .filter(Boolean);
  }, []);

  const fetchPage = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { data, error } = await supabase.storage.from('product-images').list(null, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) {
      console.error('Error fetching files:', error);
      setLoading(false);
      return;
    }
    const batch = mapFiles(data);
    setItems((prev) => [...prev, ...batch]);
    setOffset((prev) => prev + (data?.length || 0));
    setHasMore((data?.length || 0) === PAGE_SIZE);
    setLoading(false);
  }, [offset, hasMore, loading, mapFiles]);

  // initial load
  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load next page when sentinel appears
  useEffect(() => {
    if (sentinelVisible) fetchPage();
  }, [sentinelVisible, fetchPage]);

  const masonryCols = useMemo(() => ({ default: 5, 1400: 4, 900: 3, 700: 2, 500: 2 }), []);

  return (
    <div
      className="relative min-h-[100dvh] overflow-y-auto pt-[calc(100px+var(--safe-area-inset-top,0px))] pb-[calc(80px+var(--safe-area-inset-bottom,0px))]"
      style={{
        backgroundImage:
          'linear-gradient(135deg, #f8e6e0 0%, #e8d8c3 100%), linear-gradient(315deg, #ffe4e1 0%, #ffeacd 100%)',
        backgroundBlendMode: 'soft-light',
        backgroundSize: 'cover',
      }}
    >
      <Masonry breakpointCols={masonryCols} className="flex gap-4 p-4" columnClassName="bg-clip-padding">
        {items.map((item, idx) => (
          <MediaItem key={`${item.title}-${idx}`} item={item} onSelect={setSelectedImage} />
        ))}
      </Masonry>

      {/* Load more sentinel */}
      <div ref={sentinelRef} className="h-10 w-full" />

      {/* Subtle loader */}
      {loading && (
        <div className="p-4 text-center text-sm text-neutral-500">Загрузка…</div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default Gallery;