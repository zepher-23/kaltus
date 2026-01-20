import React from 'react';

const Hero = () => {
    return (
        <div className="relative w-full max-w-[1500px] mx-auto pt-6 px-6">
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000"
                    alt="Hero Banner"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-12 lg:p-24">
                    <div className="max-w-xl text-white space-y-6">
                        <span className="bg-violet-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">New Arrival</span>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                            Next Gen <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Gaming</span>
                        </h1>
                        <p className="text-lg text-gray-200">
                            Experience audio like never before with our premium selection of gaming peripherals.
                        </p>
                        <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-violet-50 transition-colors shadow-lg">
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
