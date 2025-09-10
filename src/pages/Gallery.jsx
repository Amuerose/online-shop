import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        console.log("Gallery data:", data);
        setItems(data);
      }
    }
    loadGallery();
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {console.log("Gallery items for rendering:", items)}
        {items.map((item, index) => {
          const imageUrl = item.image_url;
          console.log("Rendering image_url:", imageUrl);
          return (
            <div key={item.id || index} className="overflow-hidden rounded">
              <img
                src={imageUrl}
                alt={item.title || 'Gallery item'}
                className="w-full h-auto block object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Gallery;