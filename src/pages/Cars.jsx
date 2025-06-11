import { useState } from 'react'
import promopng from '../assets/promo.jpg'
import CarData from '../data/CarData';
import { Link, useParams } from 'react-router';

function Cars() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState(["Honda Civic RS", "Honda e:N1", "Honda BR-V", "Honda HR-V", "Honda WR-V", "New Honda Brio"])
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState('');
  let { id } = useParams();

  const filteredCars = CarData.filter((car) => {
    const matchesCategory = category === "All" || car.category === category;
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <div className='mt-2 mb-5'>
      <div className='grid grid-flow-row md:grid-flow-col gap-2 md:justify-between items-center mb-2 my-10 mx-5 lg:mx-10'>
        <div className="drop-shadow gap-2 hidden md:flex">
          <input className="btn btn-soft" type="radio" name="radio-15" aria-label="All" checked={category === "All"} onChange={() => setCategory("All")}/>
          <input className="btn btn-soft" type="radio" name="radio-15" aria-label="City Car & Hatchback" checked={category === "City Car & Hatchback"} onChange={() => setCategory("City Car & Hatchback")}/>
          <input className="btn btn-soft" type="radio" name="radio-15" aria-label="MPV" checked={category === "MPV"} onChange={() => setCategory("MPV")}/>
          <input className="btn btn-soft" type="radio" name="radio-15" aria-label="Sedan" checked={category === "Sedan"} onChange={() => setCategory("Sedan")}/>
          <input className="btn btn-soft" type="radio" name="radio-15" aria-label="Sports" checked={category === "Sports"} onChange={() => setCategory("Sports")}/>
          <input className="btn btn-soft" type="radio" name="radio-15" aria-label="SUV" checked={category === "SUV"} onChange={() => setCategory("SUV")}/>
        </div>
        <div className="select-floating w-full block md:hidden">
          <select
            className="select w-full"
            aria-label="Select category"
            id="selectFloating"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>City Car & Hatchback</option>
            <option>MPV</option>
            <option>Sedan</option>
            <option>Sports</option>
            <option>SUV</option>
          </select>
          <label className="select-floating-label" htmlFor="selectFloating">Tipe Mobil</label>
        </div>
        <div className="input input-md w-full flex md:max-w-sm space-x-4">
          <span className="icon-[tabler--search] text-base-content/80 my-auto size-6 shrink-0"></span>
          <input type="search" className="grow w-full" placeholder="Search" id="kbdInput" value={search} onChange={(e)=>setSearch(e.target.value)}/>
          <label className="sr-only" htmlFor="kbdInput">Search</label>
          <span className="my-auto flex gap-2">
            <kbd className="kbd kbd-sm">Enter</kbd>
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 mx-5 lg:mx-10">
        {filteredCars.map((car) => (
          <div className="card sm:max-w-sm">
            <figure><img className='rounded-2xl' src={car.image} alt="Watch" /></figure>
              <div className="card-body p-4">
                <h5 className="card-title">{car.name}</h5>
                <div className='flex flex-wrap gap-2'>
                  {
                    car.tags.map((tag) => (
                      <span className="badge badge-sm badge-outline badge-primary">{tag}</span>
                    ))
                  }
                </div>
                <p className='text-xl text-base-content'>${car.price.toLocaleString()}</p>
                <div className="card-actions">
                  <Link to={"/detail/" + car.id} className="btn btn-primary" >Detail</Link>
                </div>
              </div>
          </div>
          // <div key={car.id} className="p-4 border rounded-lg shadow">
          //   <img
          //     src={car.image}
          //     alt={car.name}
          //     className="w-full h-48 object-cover rounded"
          //   />
          //   <h2 className="mt-2 text-lg font-semibold">{car.name}</h2>
          //   <p className="text-gray-600">${car.price.toLocaleString()}</p>
          //   <div className="mt-1 flex flex-wrap gap-1">
          //     {car.tags.map((tag, idx) => (
          //       <span key={idx} className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
          //         {tag}
          //       </span>
          //     ))}
          //   </div>
          // </div>
        ))}
    </div>

    </div>
  )
}

export default Cars
