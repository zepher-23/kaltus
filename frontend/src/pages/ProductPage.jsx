import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Truck, ShieldCheck, ArrowLeft, Check, Heart, Share2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [reviews, setReviews] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleBuyNow = () => {
        addToCart(product);
        navigate('/checkout');
    };

    const handleWishlistToggle = async () => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            const res = await addToWishlist(product.id);
            if (res && !res.success) {
                alert(res.message);
            }
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
                setMainImage(data.image);

                // Fetch reviews
                const reviewRes = await fetch(`http://localhost:5000/api/reviews/${id}`);
                if (reviewRes.ok) {
                    const reviewData = await reviewRes.json();
                    setReviews(reviewData);
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen font-sans text-slate-900 pb-12 pt-4">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

                {/* Breadcrumb / Back */}
                <nav className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <Link to={`/category/${product.category}`} className="hover:text-black transition-colors capitalize">{product.category}</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">

                    {/* Left: Image Gallery */}
                    <div className="flex flex-col gap-3">
                        <div className="aspect-square bg-white rounded-lg border border-slate-200 relative group overflow-hidden">
                            <img
                                src={mainImage}
                                alt={product.title}
                                className="w-full h-full object-contain mix-blend-multiply p-4"
                            />
                            {product.isBestSeller && (
                                <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                                    Best Seller
                                </span>
                            )}
                        </div>
                        {/* Small Thumbnails Carousel */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`flex-shrink-0 w-14 h-14 rounded-md border cursor-pointer overflow-hidden p-1 ${mainImage === img ? 'border-slate-900' : 'border-slate-200 hover:border-slate-400'}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt={`Variant ${idx}`} className="w-full h-full object-contain mix-blend-multiply opacity-90 hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 leading-snug mb-2">{product.title}</h1>

                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-slate-300"} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-cyan-700 hover:underline cursor-pointer">{product.reviews} ratings</span>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${isInWishlist(product?.id) ? 'text-red-500' : 'text-slate-400'}`}
                                >
                                    <Heart size={18} fill={isInWishlist(product?.id) ? "currentColor" : "none"} />
                                </button>
                                <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"><Share2 size={18} /></button>
                            </div>
                        </div>

                        <div className="border-t border-b border-slate-100 py-3 mb-4">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-red-600 text-lg font-normal">-20%</span>
                                <span className="text-3xl font-medium text-slate-900">${product.price}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                                List Price: <span className="line-through">${(product.price * 1.2).toFixed(2)}</span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-700 mb-4 leading-relaxed line-clamp-4">
                            {product.description || "Experience premium quality with this exceptional product. Designed for performance and durability, it meets the highest standards of craftsmanship."}
                        </p>

                        {/* Features List Condensed */}
                        {product.features && product.features.length > 0 && (
                            <ul className="mb-6 space-y-1">
                                {product.features.slice(0, 4).map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
                                        <span className="font-bold text-slate-900">•</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Action Box */}
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                            <div className="flex items-center gap-2 mb-3 text-sm text-green-700 font-bold">
                                <Check size={16} /> In Stock
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-yellow-400 text-slate-900 py-2.5 rounded-full font-medium hover:bg-yellow-500 transition-colors text-sm shadow-sm"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full bg-orange-400 text-slate-900 py-2.5 rounded-full font-medium hover:bg-orange-500 transition-colors text-sm shadow-sm"
                                >
                                    Buy Now
                                </button>
                            </div>
                            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                                <div className="flex items-center gap-1"><Truck size={12} /> Secure transaction</div>
                                <div className="flex items-center gap-1"><ShieldCheck size={12} /> Returns Policy</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Reviews Section Condensed */}
                <div className="mt-12 border-t border-slate-200 pt-6">
                    <h2 className="text-xl font-bold mb-4 text-slate-900">Customer Reviews</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.length === 0 ? (
                            <p className="text-slate-500 text-sm">No reviews yet for this product.</p>
                        ) : (
                            reviews.map((review, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                                                {review.user_id ? review.user_id.substring(0, 1).toUpperCase() : 'U'}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">Verified Customer</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400">{new Date(review.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex text-yellow-500 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < Math.floor(review.rating) ? "currentColor" : "none"} className={i < Math.floor(review.rating) ? "" : "text-slate-300"} />
                                        ))}
                                        <span className="ml-2 text-xs font-bold text-slate-900">{review.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{review.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductPage;
