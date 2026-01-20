import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

import { CATEGORIES, DEPARTMENTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, Filter, ChevronRight, SlidersHorizontal } from 'lucide-react';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');
    const [selectedSub, setSelectedSub] = useState(null);

    // Reset subcategory when category changes
    useEffect(() => {
        setSelectedSub(null);
    }, [categoryName]);

    const activeCategory = CATEGORIES.find(c => c.link === `/category/${categoryName}`) || {
        title: categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        id: 'unknown'
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products if "all" or specific category filter
                const url = categoryName === 'all'
                    ? 'http://localhost:5000/api/products'
                    : `http://localhost:5000/api/products?category=${categoryName}`;

                const res = await fetch(url);
                const data = await res.json();

                // If backend doesn't filter by query param strictly enough, we can filter client side too
                // This ensures specific results even if the API just returns all
                const filtered = categoryName === 'all'
                    ? data
                    : data.filter(p => p.category?.toLowerCase().includes(categoryName.toLowerCase()) || p.category === categoryName);

                setProducts(filtered);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    // Sort Logic
    const sortedProducts = React.useMemo(() => {
        let sorted = [...products];
        if (sortBy === 'low-high') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'high-low') {
            sorted.sort((a, b) => b.price - a.price);
        }
        return sorted;
    }, [products, sortBy]);

    // Filter by Subcategory
    const visibleProducts = React.useMemo(() => {
        if (!selectedSub) return sortedProducts;
        return sortedProducts.filter(p => p.subcategory === selectedSub);
    }, [sortedProducts, selectedSub]);

    return (
        <div className="bg-neutral-50 min-h-screen font-sans pb-20 pt-4">

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Mobile Category Strip (Visible only on mobile/tablet) */}
                <div className="lg:hidden mb-6">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map(cat => {
                            const isActive = cat.link === `/category/${categoryName}`;
                            return (
                                <Link
                                    key={cat.id}
                                    to={cat.link}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${isActive
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
                                        }`}
                                >
                                    {cat.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar (Desktop Only) */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                            <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <Filter size={14} /> Departments
                            </h3>
                            <div className="space-y-1">
                                {CATEGORIES.map(cat => {
                                    const isActive = cat.link === `/category/${categoryName}`;
                                    // Find matching department for subcategories
                                    // Fuzzy match title to handle cases like "Sports" vs "Sports & Outdoors"
                                    const dept = isActive ? DEPARTMENTS.find(d => d.name.includes(cat.title) || cat.title.includes(d.name)) : null;

                                    return (
                                        <div key={cat.id} className="mb-1">
                                            <Link
                                                to={cat.link}
                                                className={`flex items-center justify-between p-2 rounded-lg transition-all group ${isActive
                                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                                                    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center overflow-hidden border ${isActive ? 'border-slate-700' : 'border-slate-100 bg-slate-50'}`}>
                                                        <img src={cat.image} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <span className="font-bold text-xs">{cat.title}</span>
                                                </div>
                                                {isActive && <ChevronRight size={12} className={dept && dept.sub ? "rotate-90 transition-transform" : ""} />}
                                            </Link>

                                            {/* Subcategories List */}
                                            {isActive && dept && dept.sub && (
                                                <div className="ml-4 pl-4 border-l-2 border-slate-100 mt-2 space-y-1 animate-in slide-in-from-left-2 fade-in duration-300">
                                                    <button
                                                        onClick={() => setSelectedSub(null)}
                                                        className={`block w-full text-left text-xs font-bold py-1.5 px-2 rounded-md transition-colors ${!selectedSub ? 'text-violet-600 bg-violet-50' : 'text-slate-500 hover:text-slate-800'}`}
                                                    >
                                                        All {cat.title}
                                                    </button>
                                                    {dept.sub.map((sub, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSelectedSub(sub)}
                                                            className={`block w-full text-left text-xs font-medium py-1.5 px-2 rounded-md transition-colors ${selectedSub === sub
                                                                ? 'text-violet-600 bg-violet-50'
                                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">

                        {/* Header */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                                        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
                                        <ChevronRight size={12} />
                                        <span>Categories</span>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-black text-slate-900">{activeCategory.title}</h1>
                                    <p className="text-slate-500 mt-2 font-medium">
                                        {selectedSub ? `${selectedSub} - ` : ''}
                                        {visibleProducts.length} Products found
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative group">
                                        <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-800 transition-colors pointer-events-none" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all"
                                        >
                                            <option value="relevance">Sort by: Relevance</option>
                                            <option value="low-high">Price: Low to High</option>
                                            <option value="high-low">Price: High to Low</option>
                                        </select>
                                        <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Background for Header */}
                            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="bg-white h-[350px] rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : visibleProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {visibleProducts.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-16 text-center border dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-6">We couldn't find any products in this category. Try selecting another department or check back later.</p>
                                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25">
                                    Back to Home
                                </Link>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
