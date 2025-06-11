import { useRef, useState } from 'react'
import profileImg from '../assets/profile.png'
import profileSquareImg from '../assets/profile2.png'
import certificate1 from '../assets/certificate.jpg'
import certificate2 from '../assets/certificate2.jpg'
import { motion, useScroll, useTransform } from 'framer-motion';


function AboutMe() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <div ref={containerRef} className="relative">
      {/* Animated Text */}
      <motion.div
        style={{ opacity, scale, y }}
        className="sticky top-20 z-0 text-center"
      >
        <div className="text-xl sm:text-2xl md:text-3xl font-medium">~ Hello ~</div>
        <div className="text-4xl sm:text-5xl md:text-7xl">
          I'm <span className="text-primary underline">Sri Heryanti</span>
        </div>
        <span className="badge badge-primary rounded-full mt-5">Sales Consultant</span>
      </motion.div>

      <div className="mt-10 relative z-10 flex justify-center">
        <img
          src={profileSquareImg}
          alt="profile"
          className="w-1/2 rounded-full shadow-xl"
        />
      </div>
      <div className="card mt-10">
        <div className="card-body">
          <p>Welcome to our card Indulge in a delightful journey through our offerings. Jelly lemon drops, tiramisu, chocolate cake, cotton candy, soufflé, and oat cake sweet roll are just a taste of what's in store.</p>
        </div>
      </div>
      <div className='my-10 p-10 grid gap-3 card'>
        <h3 className='text-2xl text-primary font-semibold'>My Achievement : </h3>
        <img
          src={certificate1}
          alt="certificate"
          className=""
        />
      </div>
    </div>
  )
}

export default AboutMe
