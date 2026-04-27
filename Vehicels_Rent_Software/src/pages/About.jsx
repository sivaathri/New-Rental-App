import React from 'react';

const About = () => {
    return (
        <div className="pt-32 pb-20 px-8 font-['Plus_Jakarta_Sans'] bg-white min-height-screen">
            <div className="max-w-[1240px] mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <h1 className="text-[56px] font-[800] text-black leading-tight tracking-tight mb-6">
                        We're on a mission to<br />
                        <span className="text-gray-400">simplify your journey.</span>
                    </h1>
                    <p className="text-gray-500 text-[18px] max-w-[700px] mx-auto font-medium leading-relaxed">
                        Founded in 2024, Quick Services started with a simple idea: making vehicle rentals as easy as ordering a coffee. Today, we're the leading platform for explorers and commuters alike.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
                    {[
                        { label: 'Vehicles', value: '500+' },
                        { label: 'Customers', value: '10k+' },
                        { label: 'Cities', value: '25+' },
                        { label: 'Ratings', value: '4.9/5' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 rounded-[32px] p-10 text-center hover:bg-black hover:text-white transition-all duration-300 group cursor-default">
                            <h2 className="text-[42px] font-[800] mb-2">{stat.value}</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[12px] group-hover:text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-2 bg-black text-white text-[12px] font-bold rounded-full uppercase tracking-wider">
                            Our Story
                        </div>
                        <h2 className="text-[42px] font-[800] text-black leading-tight">
                            Quality mobility for<br />everyone, everywhere.
                        </h2>
                        <div className="space-y-6 text-gray-500 text-[16px] leading-relaxed font-medium">
                            <p>
                                We believe that transportation shouldn't be a barrier to experiences. Our platform connects vehicle owners with people who need reliable, high-quality rides.
                            </p>
                            <p>
                                Every vehicle on our platform undergoes a rigorous 50-point inspection before it's approved. When you book with Quick Services, you're booking peace of mind.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-gray-100 rounded-[48px] overflow-hidden relative">
                           {/* Placeholder for About Image */}
                           <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                               <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                   <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                               </svg>
                           </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black rounded-full -z-10 animate-pulse"></div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-black rounded-[48px] p-20 text-white overflow-hidden relative">
                    <div className="relative z-10">
                        <h2 className="text-[42px] font-[800] mb-12">Driven by values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: 'Safety First', desc: 'Secure payments and verified vehicles for a worry-free ride.' },
                                { title: 'No Hidden Fees', desc: 'What you see is what you pay. Honest pricing, always.' },
                                { title: '24/7 Support', desc: 'Our team is always on standby to help you on the road.' }
                            ].map((v, i) => (
                                <div key={i}>
                                    <h3 className="text-[20px] font-extrabold mb-4">{v.title}</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
