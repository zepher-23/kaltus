import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, Search } from 'lucide-react';

const SearchPage = () => {
    const { keyword } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryFilter = new URLSearchParams(location.search).get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/products?keyword=${keyword}`;
                if (categoryFilter && categoryFilter !== 'All') {
                    url += `&category=${encodeURIComponent(categoryFilter)}`;
                }
                const res = await fetch(url);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, categoryFilter]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans pb-20">
            {/* Header / Breadcrumb area */}
            <div className="bg-white shadow-sm border-b border-neutral-100 sticky top-[100px] z-40">
                <div className="max-w-[1500px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-black">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1">Search Results</p>
                            <h1 className="text-2xl font-black text-black leading-none">"{keyword}"</h1>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="max-w-[1500px] mx-auto px-6 py-8">
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                            <Search size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">No matches found</h2>
                        <p className="text-neutral-500 max-w-md mx-auto">We couldn't find any products matching "{keyword}". Try checking for typos or using broader terms.</p>
                        <Link to="/" className="inline-block mt-8 px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm font-bold text-neutral-500 mb-6">Found {products.length} results</p>
                        <div className="grid grid-cols-1 sc:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {products.map(p => (
                                <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 hover:shadow-xl hover:border-black hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col hover:border-indigo-100">
                                    <div className="aspect-square bg-white rounded-xl mb-4 p-4 flex items-center justify-center relative overflow-hidden border border-neutral-50">
                                        {p.isBestSeller && <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-sm z-10">BESTSELLER</span>}
                                        <img src={p.image} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="mb-2">
                                        <span className="text-sm font-bold text-black group-hover:text-indigo-600 line-clamp-2 leading-snug transition-colors">
                                            {p.title}
                                        </span>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="text-yellow-400 text-xs flex items-center mb-2 gap-1">
                                            <div className="flex">{'★'.repeat(Math.floor(p.rating || 0))}{'☆'.repeat(5 - Math.floor(p.rating || 0))}</div>
                                            <span className="text-neutral-400 font-bold">({p.reviews})</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-black text-black">${p.price}</span>
                                                {p.isExpress && <div className="mt-1 flex items-center gap-1"><span className="text-black font-bold italic text-[10px]">🚀 Express</span><span className="text-[10px] text-neutral-400">2 Days</span></div>}
                                            </div>
                                            <button className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-all shadow-sm hover:shadow-md">
                                                <span className="text-xl font-light mb-0.5">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
