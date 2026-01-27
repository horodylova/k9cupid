'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';

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
  // Since we only have one image from the API, we'll use it.
  // We can't really do a thumbnail gallery with one image, but we'll keep the structure
  // compliant with the request to follow the template.
  
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
               <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                  <Image 
                    src={image || '/images/no-image.jpg'} 
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="img-fluid rounded-4"
                    unoptimized // API images might be external
                  />
               </div>
            </SwiperSlide>
            {/* Duplicate for demo effect if needed, but for now just one */}
          </Swiper>
        </div>
      </div>
      
      {/* Thumbnail slider - optional since we only have one image */}
      {/* 
      <div className="col-md-12 mt-2">
        <div className="swiper product-thumbnail-slider">
             <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <img src={image} className="img-fluid" />
                </SwiperSlide>
              </Swiper>
        </div>
      </div> 
      */}
    </div>
  );
}
