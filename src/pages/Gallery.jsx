import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Masonry from 'react-masonry-css';

function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const files = ["Fik.JPG", "Malina.png", "Datle.png", "Boruvka.png"];
    const bucketUrl = "https://hqputwaqghrbsprtanqo.supabase.co/storage/v1/object/public/product-images";
    const itemsWithUrls = files.map((file) => ({
      title: file,
      image_url: `${bucketUrl}/${file}`,
    }));
    setItems(itemsWithUrls);
    console.log("Gallery items set:", itemsWithUrls);
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
          const imageUrl = item.image_url;
          return (
            <div key={item.title || index} className="mb-4 break-inside-avoid">
              <img
                src={imageUrl}
                alt={item.title || 'Gallery item'}
                className="w-full h-auto object-cover rounded"
                loading="lazy"
              />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}

export default Gallery;