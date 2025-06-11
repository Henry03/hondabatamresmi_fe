import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import promopng from '../assets/promo.jpg'
import CarData from '../data/CarData';
import { useParams } from 'react-router';
import CarDetailData from '../data/CarDetailData'
import TextEditor from '../components/TextEditor';
import { useKeenSlider } from 'keen-slider/react';
import "keen-slider/keen-slider.min.css"

function CarDetail() {
  const [html, setHtml] = useState(CarDetailData.page);
  const [headings, setHeadings] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(CarDetailData.variants?.[0] ?? null);
  const lowestPrice = Math.min(...CarDetailData.variants.map(v => v.price));


  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    slides: {
      perView: 1,
      spacing: 16
    },
    renderMode: "performance"
  })

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = Array.from(doc.body.querySelectorAll('h2, h3'));

    const structuredHeadings = [];
    let currentH2 = null;

    elements.forEach(el => {
      if (el.tagName === 'H2') {
        currentH2 = {
          title: el.textContent.trim(),
          children: []
        };
        structuredHeadings.push(currentH2);
      } else if (el.tagName === 'H3' && currentH2) {
        currentH2.children.push(el.textContent.trim());
      }
    });

    setHeadings(structuredHeadings);
  }, [html]);

  useLayoutEffect(() => {
    if (headings.length === 0) return;

    const timeout = setTimeout(() => {
      if (window.HSStaticMethods?.autoInit) {
        window.HSStaticMethods.autoInit(["collapse"]); 
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [headings]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     instanceRef.current?.next();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [instanceRef]);

  return (
    <div className='mt-2 mb-5 my-10 mx-5 lg:mx-10'>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:sticky md:top-20 md:self-start w-full overflow-hidden">
          <div ref={sliderRef} className="keen-slider w-full overflow-hidden rounded-xl ">
            <div className="keen-slider__slide rounded-xl ">
              <video
                className="w-full h-full object-cover"
                controls
                src="https://www.w3schools.com/html/mov_bbb.mp4"
              />
            </div>
            <div className="keen-slider__slide rounded-xl ">
              <img
                src="https://asset.honda-indonesia.com/media-library/51c5bbee-d932-4438-ae75-c88b42e9bbfe/p4NgecHXr8blNQiEqGbBzocvOOmzSOI80X8hlwy1.jpg"
                alt="Slide 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-3 overflow-x-auto">
            <button
              className="w-20 h-14 border rounded hover:border-primary"
              onClick={() => instanceRef.current?.moveToIdx(0)}
            >
              <video className="w-full h-full object-cover" muted>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" />
              </video>
            </button>
            <button
              className="w-20 h-14 border rounded hover:border-primary"
              onClick={() => instanceRef.current?.moveToIdx(1)}
            >
              <img
                src="https://asset.honda-indonesia.com/media-library/51c5bbee-d932-4438-ae75-c88b42e9bbfe/p4NgecHXr8blNQiEqGbBzocvOOmzSOI80X8hlwy1.jpg"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className='flex flex-col gap-2'>
            <h1 className="text-3xl font-semibold">{CarDetailData.title}</h1>
            <div className='flex flex-wrap gap-2'>
              {
                CarDetailData.tags.map((tag, index)=> (
                  <span key={index} className="badge badge-sm badge-outline badge-primary">{tag}</span>
                ))
              }
            </div>
            <h3><span>Mulai dari </span><br/><span className='text-primary font-bold text-2xl'>Rp {lowestPrice.toLocaleString("id-ID")}</span></h3>
            <p className="mt-1 text-sm text-base-content/70">
              {CarDetailData.description ?? "Deskripsi singkat mobil..."}
            </p>
          </div>

          {CarDetailData.variants?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-lg font-semibold mb-2">Pilih Varian</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {CarDetailData.variants.map((variant, idx) => (
                  <label
                    key={idx}
                    className={`cursor-pointer border rounded-xl p-4 transition-all ${
                      selectedVariant?.type === variant.type
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-base-300 hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="car-variant"
                      className="hidden"
                      value={variant.type}
                      checked={selectedVariant?.type === variant.type}
                      onChange={() => setSelectedVariant(variant)}
                    />
                    <div className="font-semibold text-base">{variant.type}</div>
                    <div className="text-sm text-base-content/70 mt-1">
                      Rp {variant.price.toLocaleString("id-ID")}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
          <a href={`http://wa.me/6285211451178?text=Halo kak, saya mau bertanya terkait mobil ${selectedVariant.type}`} className="w-full">
            <button className={`btn btn-primary w-full mt-3 ${selectedVariant ?? 'btn-disabled'}`}>Hubungi Sales</button>
          </a>
        </div>
      </div>


      <div className="divider divider-neutral my-3"></div>
      <div className='flex flex-col md:flex-row'>
        <div className="px-2 pt-4 w-md hidden md:block md:sticky top-16 self-start">
          <div className='mb-2'>Navigation</div>
          <div className="divider"></div>
          <ul className="menu space-y-0.5 p-0">
            {
              headings.map((heading, index) =>
                (
                  <li className="space-y-0.5" key={index}>
                    <a href={`#${index+1}`} className="collapse-toggle collapse-open:bg-base-content/10" id={`menu-app-toggle-${index}`} data-collapse={`#menu-app-collapse-${index}`}>
                      <span></span>
                      <span>{heading.title}</span>
                      {
                        heading.children?.length > 0 && (
                          <span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4 transition-all duration-300"></span>
                        )
                      }
                    </a>
                    {
                      heading.children?.length > 0 && (
                        <ul id={`menu-app-collapse-${index}`} className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby={`menu-app-toggle-${index}`}>
                          {
                            heading.children.map((child, childIdx) =>
                              (
                                <li key={childIdx}>
                                  <a href={`#${index+1}-${childIdx+1}`}>
                                    {child}
                                  </a>
                                </li>
                              ))
                          }
                        </ul>
                      )
                    }
                  </li>
                )
              )
            }
          </ul>
        </div>

        <div className="sticky top-12 z-20 block md:hidden bg-base-100 pt-2 w-full">
          <button type="button" className="collapse-toggle btn btn-outline btn-primary w-full justify-between" data-collapse="#navbar-collapse" aria-controls="navbar-collapse" aria-label="Toggle navigation" >
            Navigation
            <span className="icon-[tabler--chevron-down] collapse-open:hidden size-4"></span>
            <span className="icon-[tabler--chevron-up] collapse-open:block hidden size-4"></span>
          </button>
          <div id="navbar-collapse" className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full" >
            <ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
              {
                headings.map((heading, index) =>
                  (
                    <li className="space-y-0.5" key={index}>
                      <a className="collapse-toggle collapse-open:bg-base-content/10" id={`menu-app-toggle-responsive-${index}`} data-collapse={`#menu-app-collapse-responsive-${index}`}>
                        <span></span>
                        <span>{heading.title}</span>
                        {
                          heading.children?.length > 0 && (
                            <span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4 transition-all duration-300"></span>
                          )
                        }
                      </a>
                      {
                        heading.children?.length > 0 && (
                          <ul id={`menu-app-collapse-responsive-${index}`} className="collapse hidden w-auto space-y-0.5 overflow-hidden transition-[height] duration-300" aria-labelledby={`menu-app-toggle-${index}`}>
                            {
                              heading.children.map((child, childIdx) =>
                                (
                                  <li key={childIdx}>
                                    <a href={`#${index+1}-${childIdx+1}`}>
                                      {child}
                                    </a>
                                  </li>
                                ))
                            }
                          </ul>
                        )
                      }
                    </li>
                  )
                )
              }
            </ul>
          </div>
        </div>
        <div className="divider divider-horizontal divider-neutral mx-5"></div>
        <div
          className="w-full text-editor"
          dangerouslySetInnerHTML={{ __html: CarDetailData.page }}
        />
      </div>
    </div>
  )
}

export default CarDetail
