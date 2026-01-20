import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 font-sans mt-auto">
            {/* Back to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 py-3 text-sm font-bold text-white transition-all"
            >
                Back to top
            </button>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Column 1 */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-base mb-3">Get to Know Us</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/about" className="hover:text-violet-400 transition-colors">About Kaltus</Link></li>
                            <li><Link to="/career" className="hover:text-violet-400 transition-colors">Careers</Link></li>
                            <li><Link to="/press" className="hover:text-violet-400 transition-colors">Press Releases</Link></li>
                            <li><Link to="/science" className="hover:text-violet-400 transition-colors">Kaltus Science</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-base mb-3">Connect with Us</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><a href="#" className="flex items-center gap-2.5 hover:text-violet-400 transition-colors"><Facebook size={16} /> Facebook</a></li>
                            <li><a href="#" className="flex items-center gap-2.5 hover:text-violet-400 transition-colors"><Twitter size={16} /> Twitter</a></li>
                            <li><a href="#" className="flex items-center gap-2.5 hover:text-violet-400 transition-colors"><Instagram size={16} /> Instagram</a></li>
                            <li><a href="#" className="flex items-center gap-2.5 hover:text-violet-400 transition-colors"><Linkedin size={16} /> LinkedIn</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-base mb-3">Make Money with Us</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/sell" className="hover:text-violet-400 transition-colors">Sell on Kaltus</Link></li>
                            <li><Link to="/affiliate" className="hover:text-violet-400 transition-colors">Become an Affiliate</Link></li>
                            <li><Link to="/advertise" className="hover:text-violet-400 transition-colors">Advertise Your Products</Link></li>
                            <li><Link to="/merch" className="hover:text-violet-400 transition-colors">Kaltus Pay on Merchants</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-base mb-3">Let Us Help You</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/profile" className="hover:text-violet-400 transition-colors">Your Account</Link></li>
                            <li><Link to="/orders" className="hover:text-violet-400 transition-colors">Returns Centre</Link></li>
                            <li><Link to="/help" className="hover:text-violet-400 transition-colors">100% Purchase Protection</Link></li>
                            <li><Link to="/help" className="hover:text-violet-400 transition-colors">Kaltus App Download</Link></li>
                            <li><Link to="/help" className="hover:text-violet-400 transition-colors">Help</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 mt-14 pt-10 text-center">

                    {/* Logo */}
                    <div className="mb-8 flex justify-center items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-xl">K</span>
                        </div>
                        <span className="text-2xl font-black text-white">kaltus</span>
                    </div>

                    {/* Language / Country (Mock) */}
                    <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-500 mb-8">
                        <button className="border border-slate-700 px-4 py-2 rounded-full hover:text-violet-400 hover:border-violet-500 transition-colors">English</button>
                        <button className="border border-slate-700 px-4 py-2 rounded-full hover:text-violet-400 hover:border-violet-500 transition-colors">USD - U.S. Dollar</button>
                        <button className="border border-slate-700 px-4 py-2 rounded-full hover:text-violet-400 hover:border-violet-500 transition-colors">United States</button>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
                        <Link to="/privacy" className="hover:text-violet-400 transition-colors">Conditions of Use</Link>
                        <Link to="/privacy" className="hover:text-violet-400 transition-colors">Privacy Notice</Link>
                        <Link to="/privacy" className="hover:text-violet-400 transition-colors">Consumer Health Data Privacy</Link>
                        <Link to="/privacy" className="hover:text-violet-400 transition-colors">Your Ads Privacy Choices</Link>
                    </div>

                    <div className="mt-4 text-xs text-slate-600">
                        © 1996-2026, Kaltus.com, Inc. or its affiliates
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
