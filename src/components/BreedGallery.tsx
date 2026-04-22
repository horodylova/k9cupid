'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import { useMemo, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface BreedGalleryProps {
  image: string;
  name: string;
}

export default function BreedGallery({ image, name }: BreedGalleryProps) {
  const fallbackSrc = '/no-image-available.jpg';
  const initialSrc = useMemo(() => {
    const value = (image || '').trim();
    if (!value || value === 'N/A' || value === 'null' || value === 'undefined') {
      return fallbackSrc;
    }
    return value;
  }, [image]);
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="swiper product-large-slider">
           <Swiper
            style={{
              // @ts-expect-error Swiper CSS variables
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#fff',
            }}
            spaceBetween={10}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2"
          >
            <SwiperSlide>
               <div className="breed-gallery-wrapper">
                  <Image 
                    src={imgSrc} 
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="img-fluid rounded-4"
                    sizes="(max-width: 992px) 100vw, 50vw"
                    priority
                    onError={() => setImgSrc(fallbackSrc)}
                  />
               </div>
            </SwiperSlide>
            {/* Duplicate for demo effect if needed, but for now just one */}
          </Swiper>
        </div>
      </div>
      
    </div>
  );
}
