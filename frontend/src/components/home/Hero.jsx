import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";





const HeroSection = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isSignedIn } = useUser();
const navigate = useNavigate();

const handleGetStarted = () => {
  if (isSignedIn) {
    navigate("/dashboard");
  } else {
    navigate("/login");
  }
};

    return (
        <section className="mt-25 bg-[#f0faff]">

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <a href="/">Home</a>
                <a href="/products">Products</a>
                <a href="/stories">Stories</a>
                <a href="/pricing">Pricing</a>

                <button
                    onClick={() => setMenuOpen(false)}
                    className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
                >
                    ✕
                </button>
            </div>

            {/* Hero Section */}
            <main className=" pt-4 flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between gap-10 md:gap-16 mt-23 px-4 md:px-12 lg:px-16 xl:px-20">
                <div className="w-full md:w-3/5 flex flex-col items-center md:items-start">
                    <h1 className="uppercase font-semibold text-sm md:text-base lg:text-lg text-gray-700 tracking-wide">
                        Free Online Resume Builder
                    </h1>
                    <h1 className="font-bold text-slate-800 text-4xl tracking-[-1.5px] 500:text-5xl md:text-4xl 500:tracking-[-2px] md:tracking-[-1.5px] mq9:text-5xl mq9:tracking-[-2px] lg:tracking-[-2.5px] lg:text-6xl xl:text-7xl 2xl:text-[80px] xl:tracking-[-3px] 2xl:tracking-[-3.5px] text-black mt-3 lg:mt-4 xl:mt-5 2xl:mt-6">
                        Build a job-winning <br></br>resume <span className="text-[#05a2ff]">in minutes</span>
                    </h1>

                    <p className="mt-4 lg:mt-6 text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg">
                        Build a job-winning resume without the hassle.
                        Just enter your details and get a polished resume ready to apply in minutes.
                        <span className="block font-medium text-slate-700 mt-2">
                            Yes, really 🚀
                        </span>
                    </p>

                    <div className="flex items-center gap-4 mt-8 text-sm">
                        <button onClick={handleGetStarted} className="bg-[#05a2ff] hover:bg-slate-900 text-white text-lg active:scale-95 transition rounded-md px-9 h-19">
                            Get Started for free
                        </button>

                        {/* <button className="flex items-center gap-2 border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-md px-6 h-11">
              Watch Demo
            </button> */}
                    </div>
                    <div className=" py- mt-8 lg:mt-10 flex items-center gap-4 flex flex-col md:flex-row md:text-left">
                        <img
                            src="https://assets.flowcvassets.com/landing/flowcv-loved-by-users.webp"
                            alt="Happy users"
                            className="w-56 md:w-64 lg:w-72 h-auto -ml-3"
                        />
                        <p class="text-slate-700 -mt-1 mr-2 text-base lg:text-lg font-bold lg:mt-2 3xl:mt-4 ">
                            Trusted by 5.3 million users
                        </p>
                    </div>
                </div>

                <div className="bg-red-00 w-full md:w-2/5 relative flex justify-center items-center">
                    {/* Glow Effect */}
                    <div className="absolute w-[450px] h-[450px] rounded-full bg-[#a2dcff] opacity-100 blur-[100px] z-0"></div>
                    {/* ATS Perfect Badge */}
                    <div className='relative z-15'>
                        <div className="absolute left-0 top-3/4 -translate-x-1/2 -translate-y-1/2  z-15 inline-flex items-center gap-1 px-2 py-1 bg-[#EEFFF3] rounded-full shadow-md border border-green-300">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-semibold text-[#0cc377]">
                                ATS Perfect
                            </span>
                        </div>
                        <img
                            src="/images/Resume.png"
                            alt="hero"
                            // className="max-w-sm sm:max-w-md lg:max-w-lg 2xl:max-w-xl transition-all duration-300"
                            className="z-10 h-[380px] sm:h-[450px] md:h-[520px] lg:h-[600px] w-auto object-contain transition-all duration-300"
                        />
                    </div>
                </div>

            </main>
            
            
        </section>
    );
};

export default HeroSection;