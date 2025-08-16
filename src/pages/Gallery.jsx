import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    supabase
      .from('galleries')
      .select('id, media_url, mime')
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setItems(data);
        }
      });
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
        {items.map((file) => (
          <div key={file.id} className="overflow-hidden rounded">
            {file.mime.startsWith('video') ? (
              <video controls className="w-full h-auto">
                <source
                  src={file.media_url}
                  type={file.mime}
                />
              </video>
            ) : (
              <img
                src={file.media_url}
                alt=""
                className="w-full h-auto block object-cover"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;