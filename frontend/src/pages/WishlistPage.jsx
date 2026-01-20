import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import WishlistContext from '../context/WishlistContext';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import API from '../config/api';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=wishlist');
            return;
        }

        const fetchWishlistProducts = async () => {
            setLoading(true);
            if (wishlist.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                // Fetch details for all wishlist items
                const validProducts = [];
                await Promise.all(wishlist.map(async (id) => {
                    try {
                        const res = await fetch(API.PRODUCT(id));
                        if (res.ok) {
                            const data = await res.json();
                            validProducts.push(data);
                        }
                    } catch (err) {
                        console.error(`Failed to fetch product ${id}`, err);
                    }
                }));
                // Sort by ID to keep consistent order maybe? Or just keep as is.
                setProducts(validProducts);
            } catch (error) {
                console.error("Error fetching wishlist products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlist, user, navigate]);

    const moveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-300">
                    <Heart size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
                <p className="text-slate-500 mb-8 max-w-md text-center">Save items you want to buy later. Heart your favorites and they'll appear here.</p>
                <Link to="/" className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-black/20 flex items-center gap-2">
                    Start Shopping <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans py-8">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-black text-slate-900 mb-8">My Wishlist</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-xl hover:border-black transition-all duration-300 flex flex-col group relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFromWishlist(p.id);
                                }}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10 shadow-sm border border-slate-100"
                                title="Remove from Wishlist"
                            >
                                <Trash2 size={16} />
                            </button>

                            <Link to={`/product/${p.id}`} className="aspect-square bg-slate-50 rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden border border-slate-100">
                                <img src={p.image} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={p.title} />
                            </Link>

                            <div className="flex-grow flex flex-col">
                                <Link to={`/product/${p.id}`} className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                                    {p.title}
                                </Link>

                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-lg font-black text-slate-900">${p.price}</span>

                                    <button
                                        onClick={() => moveToCart(p)}
                                        className="flex items-center gap-2 px-3 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                    >
                                        <ShoppingCart size={14} /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
