import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-full flex flex-col justify-center items-center h-[calc(100dvh-4rem)]'>
      <h2 className='text-xl'>Honda Taman Kota</h2>
      <h1 className='text-6xl mb-3'>Coming Soon</h1>
      <p>We're working hard to bring you something awesome. Stay tuned!</p>
    </div>
  )
}

export default App
