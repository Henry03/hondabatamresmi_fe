import React, { useEffect, useRef, useState } from 'react'
import promopng from '../assets/promo.jpg'
import testimoniImg from '../assets/testimoni.jpg'
import Carousel from '../components/Carousel';
import TestimoniData from '../data/TestimoniData';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState(["Honda Civic RS", "Honda e:N1", "Honda BR-V", "Honda HR-V", "Honda WR-V", "New Honda Brio"])
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [promo] = useState(['Blibli', 'Es Teler 77', 'Boga Group – Cashback 20%', 'Hong Tang', 'Another Promo']);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    spacing:16,
    slides: {
      perView: 1
    },
    breakpoints: {
      "(min-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 16, // optional, if you want to ensure spacing is consistent
        },
      },
    },
  });

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - carousel.offsetLeft);
      setScrollLeft(carousel.scrollLeft);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1; // drag speed
      carousel.scrollLeft = scrollLeft - walk;
    };

    // Attach events
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mousemove', handleMouseMove);

    // Clean up
    return () => {
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <div>
      <div
        data-carousel='{
          "loadingClasses": "opacity-0",
          "dotsItemClasses": "carousel-box carousel-active:bg-primary"
        }' className="relative w-full" >
        <div className="carousel rounded-none">
          <div className="carousel-body h-full opacity-0">
            <div className="carousel-slide">
              <div className="bg-base-200/60 flex h-full justify-center">
                <span className="self-center text-2xl sm:text-4xl h-full w-full">
                  <img src='https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promotional-Carousel-Model-3-Desktop-US.png' className='object-cover h-full w-full'/>
                </span>
              </div>
            </div>
            <div className="carousel-slide active">
              <div className="bg-base-200/80 flex h-full justify-center">
                <span className="self-center text-2xl sm:text-4xl h-full w-full">
                  <img src='https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promotional-Carousel-Model-Y-Desktop-US.jpg' className='object-cover h-full w-full'/>
                </span>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="carousel-prev">
          <span className="size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm">
            <span className="icon-[tabler--chevron-left] size-5 cursor-pointer rtl:rotate-180"></span>
          </span>
          <span className="sr-only">Previous</span>
        </button>
        <button type="button" className="carousel-next">
          <span className="sr-only">Next</span>
          <span className="size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm">
            <span className="icon-[tabler--chevron-right] size-5 cursor-pointer rtl:rotate-180"></span>
          </span>
        </button>

        <div className="carousel-pagination absolute bottom-3 end-0 start-0 flex justify-center gap-3"></div>
      </div>
      <div className='my-10 mx-5 lg:mx-10'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-medium'>Daftar Mobil</h3>
          <button className="btn btn-text btn-primary">Lihat semua</button>
        </div>
        <Carousel>
          {
            promo.map((title, index) =>(
              <div
                className="snap-center shrink-0 w-80 sm:w-96 flex flex-col items-center"
                key={index}
              >
                <span className="self-center text-lg w-full select-none">
                  <figure><img className='rounded-2xl pointer-events-none' src="https://cdn.flyonui.com/fy-assets/components/card/image-9.png" alt="Watch" /></figure>
                  <div className="card-body p-4">
                    <h5 className="card-title">{name[index]}</h5>
                    <div className='flex gap-2'>
                      <span className="badge badge-outline badge-primary">SUV</span>
                      <span className="badge badge-outline badge-secondary">Hybrid</span>
                    </div>
                    <p className="mb-2">Harga mulai Rp100.000.000</p>
                    <div className="card-actions">
                        <a href={`/mobil`} className="btn btn-primary">Detail</a>
                      </div>
                  </div>
                </span>
              </div>
            ))
          }
        </Carousel>
      </div>
      <div className='my-10 mx-5 lg:mx-10'>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-2xl font-medium'>Promo</h3>
        </div>
        <Carousel>
          {
            promo.map((title, index) =>(
              <div
                className="snap-center shrink-0 w-80 sm:w-96 flex flex-col items-center"
                key={index}
              >
                <span className="self-center text-lg w-full select-none">
                  <figure>
                    <img
                      className="rounded-2xl max-h-96 w-full object-cover pointer-events-none"
                      src={promopng}
                      alt="Watch"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h5 className="card-title text-xl">{title}</h5>
                    <div className="mb-2 flex items-center text-md gap-2">
                      <span className="icon-[tabler--calendar-event] w-7 h-7"></span>
                      <p>1 April 2025 - 1 Mei 2025</p>
                    </div>
                    <div className="card-actions">
                      <a href={`/promo`} className="btn btn-primary">Detail</a>
                    </div>
                  </div>
                </span>
              </div>
            ))
          }
        </Carousel>
      </div>
      <div className='my-10 mx-5 lg:mx-10'>
        <div className='flex flex-col justify-center mb-3'>
          <h2 className='text-primary text-2xl font-medium mx-auto'>Apa Yang Pembeli Katakan?</h2>
        </div>
        <div ref={sliderRef} className="keen-slider">
          {TestimoniData.map((testimoni, index) => (
            <div key={index} className="keen-slider__slide px-2">
              <div className="card sm:card-side max-w-4xl sm:max-w-full">
                <figure className='sm:w-2xl'><img className='' src={testimoniImg} alt="headphone" /></figure>
                <div className="card-body">
                  <blockquote className="relative p-4 max-w-lg">
                    <span className="icon-[tabler--quote] text-base-300/20 absolute -start-3 -top-3 size-16 rotate-180 rtl:rotate-0"></span>
                    <div className="relative z-1">
                      <p className="text-base-content text-lg">
                        <em>
                          {testimoni.review}
                        </em>
                      </p>
                    </div>
                    <footer className="mt-4">
                      <div className="text-base-content/50 text-base font-semibold">~ {testimoni.name}</div>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {TestimoniData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === idx ? "bg-primary" : "bg-base-300"
              }`}
            />
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default App
