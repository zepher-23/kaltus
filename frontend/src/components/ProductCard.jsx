import React, { useContext } from 'react';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            const res = await addToWishlist(product.id);
            if (res && !res.success) {
                alert(res.message);
            }
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="block h-full">
            <div className="bg-white h-full flex flex-col rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100 group relative">

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-violet-50 transition-colors shadow-sm border border-slate-100"
                >
                    <Heart size={16} className={isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
                </button>

                {/* Badge */}
                {product.isBestSeller && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 tracking-wide uppercase shadow-md">
                        Best Seller
                    </span>
                )}

                {/* Image Area */}
                <div className="w-full h-48 bg-gradient-to-b from-slate-50 to-white p-4 flex items-center justify-center relative">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 will-change-transform"
                    />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow border-t border-slate-100">
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-violet-700 transition-colors mb-2" title={product.title}>
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center text-amber-500">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-bold text-slate-700 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-slate-400">({product.reviews})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-slate-900">${Math.floor(product.price)}</span>
                            <span className="text-sm text-slate-400 line-through">${(product.price * 1.2).toFixed(0)}</span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-violet-500/25"
                            title="Add to Cart"
                        >
                            <ShoppingBag size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
