import React from 'react'
import NaNavbar from '../components/Navbar'
import Hero from '../components/home/Hero' 
import Section1 from '../components/home/Section1'
import Section2 from '../components/home/Section2'
import Feature from '../components/home/Feature'
import Marquee from '../components/home/Marquee'
import Footer from '../components/Footer'




const Home = () => {
  return (
    <div>
        <NaNavbar />
        {/* <div className='h-[100px] bg-gray-200 flex items-center justify-center'>
            <p className='text-lg font-bold'>vinamra sahu</p>
        </div> */}
        <Hero />
        <Marquee className="bg-[#f0faff]"  />
        <Feature />
        <Section1 />
        <Section2 /> 
        
        <Footer/>
        
    </div>
  )
}

export default Home