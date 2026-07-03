import React from 'react'
// import ScrollStackUsage from '../animations/ScrollStackUsage'

import ParallaxStackCards from '../home/StackCards'

const Section1 = () => {
  return (
    <div className="mt-20">
       
        <div className="mb-24 text-center">

          <span className="text-[#05a2ff] font-semibold uppercase tracking-[4px]">
            How it works
          </span>

          <h2 className="text-slate-800 mt-5 text-4xl md:text-7xl font-bold">
            Build your resume in
            <span className="text-[#05a2ff] "> 4 easy steps</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            From choosing a template to downloading an ATS-friendly resume,
            everything takes only a few minutes.
          </p>

        </div>
        <ParallaxStackCards smoothScroll={false} />
    </div>
  )
}

export default Section1