import { useEffect, useState } from 'react';
import axios from 'axios';

function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.amuerose.cz/api/galleries?populate=media')
      .then((res) => setItems(res.data.data))
      .catch((err) => console.error(err));
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
        {items.map((item) =>
          item.attributes.media.data.map((file) => (
            <div key={file.id} className="overflow-hidden rounded">
              {file.attributes.mime.startsWith('video') ? (
                <video controls className="w-full h-auto">
                  <source
                    src={`https://api.amuerose.cz${file.attributes.url}`}
                    type={file.attributes.mime}
                  />
                </video>
              ) : (
                <img
                  src={`https://api.amuerose.cz${file.attributes.url}`}
                  alt=""
                  className="w-full h-auto block object-cover"
                  loading="lazy"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Gallery;