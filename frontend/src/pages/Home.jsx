import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ArrowRight, Sparkles, TrendingUp, ChevronRight, Star, Truck, Shield, Gift } from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const recommendedProducts = React.useMemo(() => {
        return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
    }, [products]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products');
                const data = await res.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center animate-pulse">
                        <span className="text-white font-black text-2xl">K</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-slate-500">
                No products found.
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-white/90 text-sm font-medium">Free shipping on orders $50+</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 max-w-4xl mx-auto">
                        Shop the Future.<br />
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                            Today.
                        </span>
                    </h1>

                    <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                        Discover curated collections of premium products. From cutting-edge tech to timeless fashion.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/category/electronics"
                            className="group px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-violet-50 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-2"
                        >
                            Explore Collection
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/category/fashion"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            View Lookbook
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Truck, label: 'Free Shipping', sub: 'On orders $50+' },
                            { icon: Shield, label: 'Secure Payment', sub: '100% Protected' },
                            { icon: Gift, label: 'Gift Wrapping', sub: 'Available' },
                            { icon: Star, label: '4.9 Rating', sub: '50k+ Reviews' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                                    <item.icon size={28} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{item.label}</p>
                                    <p className="text-slate-500 text-sm">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">Trending Now</h2>
                            <p className="text-slate-500 mt-1">Most popular picks this week</p>
                        </div>
                        <Link to="/search/all" className="text-violet-600 font-bold hover:text-violet-800 flex items-center gap-1">
                            View All <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {recommendedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banners */}
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Tech Banner */}
                        <Link to="/category/electronics" className="group relative rounded-3xl overflow-hidden h-72">
                            <img
                                src="/images/deal_electronics.png"
                                alt="Electronics"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
                            <div className="absolute inset-0 p-10 flex flex-col justify-center">
                                <span className="text-violet-400 font-bold uppercase tracking-wider mb-3">Limited Time</span>
                                <h3 className="text-3xl font-black text-white mb-3">Tech Essentials</h3>
                                <p className="text-white/60 mb-6">Up to 50% off on premium audio</p>
                                <span className="inline-flex items-center gap-2 text-white font-bold text-lg group-hover:gap-3 transition-all">
                                    Shop Now <ArrowRight size={20} />
                                </span>
                            </div>
                        </Link>

                        {/* Fashion Banner */}
                        <Link to="/category/fashion" className="group relative rounded-3xl overflow-hidden h-72">
                            <img
                                src="/images/lifestyle_shopping.png"
                                alt="Fashion"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
                            <div className="absolute inset-0 p-10 flex flex-col justify-center">
                                <span className="text-pink-400 font-bold uppercase tracking-wider mb-3">New Arrivals</span>
                                <h3 className="text-3xl font-black text-white mb-3">Style Edit</h3>
                                <p className="text-white/60 mb-6">Discover the latest trends</p>
                                <span className="inline-flex items-center gap-2 text-white font-bold text-lg group-hover:gap-3 transition-all">
                                    Explore <ArrowRight size={20} />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Category Product Sections */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

                    {/* Electronics */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                    <TrendingUp size={22} className="text-violet-600" />
                                </div>
                                Tech & Electronics
                            </h2>
                            <Link to="/category/electronics" className="text-violet-600 font-bold hover:text-violet-800 flex items-center gap-1">
                                See all <ChevronRight size={18} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {products.filter(p => p.category === 'electronics' || p.category === 'gaming').slice(0, 5).map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>

                    {/* Fashion */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                    <Sparkles size={22} className="text-pink-500" />
                                </div>
                                Fashion & Beauty
                            </h2>
                            <Link to="/category/fashion" className="text-violet-600 font-bold hover:text-violet-800 flex items-center gap-1">
                                See all <ChevronRight size={18} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {products.filter(p => p.category === 'beauty' || p.category === 'fashion').slice(0, 5).map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-black text-white mb-4">Stay in the Loop</h2>
                    <p className="text-xl text-violet-100 mb-10 max-w-xl mx-auto">
                        Subscribe to get special offers, free giveaways, and exclusive deals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-2xl text-slate-900 font-medium text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                        />
                        <button className="px-10 py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl hover:bg-slate-800 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
