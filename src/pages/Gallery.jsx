import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Masonry from 'react-masonry-css';

function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase
        .storage
        .from('product-images')
        .list(null, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });
      if (error) {
        console.error('Error fetching files:', error);
        setItems([]);
        return;
      }
      console.log("Files from storage:", data);
      // Detect file type by extension: images and videos
      const bucketUrl = "https://hqputwaqghrbsprtanqo.supabase.co/storage/v1/object/public/product-images";
      const knownImageExtensions = ['jpg', 'jpeg', 'png', 'heic', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
      const knownVideoExtensions = ['mp4', 'mov', 'webm'];
      const itemsWithUrls = (data ?? [])
        .filter(file => !!file.name && !file.name.startsWith('.'))
        .map(file => {
          const ext = file.name.split('.').pop().toLowerCase();
          let type = null;
          if (knownImageExtensions.includes(ext)) {
            type = 'image';
          } else if (knownVideoExtensions.includes(ext)) {
            type = 'video';
          }
          if (!type) {
            console.log(`Ignoring unsupported extension file: ${file.name}`);
            return null;
          }
          return {
            title: file.name,
            url: `${bucketUrl}/${file.name}`,
            type,
          };
        })
        .filter(Boolean);
      setItems(itemsWithUrls);
      console.log("Gallery items set:", itemsWithUrls);
    }
    fetchFiles();
  }, []);

  return (
    <div
      className="relative h-[100dvh] overflow-y-auto 
             pt-[calc(100px+var(--safe-area-inset-top,0px))] 
             pb-[calc(80px+var(--safe-area-inset-bottom,0px))]"
      style={{
        backgroundImage: 'linear-gradient(135deg, #f8e6e0 0%, #e8d8c3 100%), linear-gradient(315deg, #ffe4e1 0%, #ffeacd 100%)',
        backgroundBlendMode: 'soft-light',
        backgroundSize: 'cover'
      }}
    >
      <Masonry
        breakpointCols={{ default: 5, 1100: 4, 700: 2, 500: 1 }}
        className="flex gap-4 p-4"
        columnClassName="bg-clip-padding"
      >
        {items.map((item, index) => {
          return (
            <div key={item.title || index} className="mb-4 break-inside-avoid">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title || 'Gallery item'}
                  className="w-full h-auto object-cover rounded"
                  loading="lazy"
                />
              ) : item.type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-auto object-cover rounded"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                />
              ) : null}
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}

export default Gallery;