import React from 'react'
import NaNavbar from '../components/Navbar'
import Hero from '../components/home/Hero' 
import Section1 from '../components/home/Section1'
import Section2 from '../components/home/Section2'
import Feature from '../components/home/Feature'



const Home = () => {
  return (
    <div>
        <NaNavbar />
        {/* <div className='h-[100px] bg-gray-200 flex items-center justify-center'>
            <p className='text-lg font-bold'>vinamra sahu</p>
        </div> */}
        <Hero />
        <Feature />
        <Section1 />
        <Section2 />  
        
    </div>
  )
}

export default Home