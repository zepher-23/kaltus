import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal, cartCount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login?redirect=cart');
        } else {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Your Cart is Empty</h2>
                <p className="text-slate-500 text-sm mb-6 text-center max-w-sm">Start shopping to add items to your cart.</p>
                <Link to="/" className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all text-sm flex items-center gap-2">
                    Start Shopping <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans py-6">
            <div className="max-w-[1200px] mx-auto px-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Shopping Cart ({cartCount})</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items */}
                    <div className="flex-grow">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            {cartItems.map((item, idx) => (
                                <div key={item.id} className={`p-4 flex gap-4 items-center ${idx !== cartItems.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    {/* Image */}
                                    <Link to={`/product/${item.id}`} className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg p-1 flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-grow min-w-0">
                                        <Link to={`/product/${item.id}`} className="font-semibold text-slate-900 text-sm hover:text-violet-600 transition-colors line-clamp-1">
                                            {item.title}
                                        </Link>
                                        <p className="text-xs text-green-600 font-medium">In Stock</p>
                                    </div>

                                    {/* Qty */}
                                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                                        <button
                                            onClick={() => updateQty(item.id, item.qty - 1)}
                                            disabled={item.qty <= 1}
                                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="w-6 text-center font-bold text-sm text-slate-900">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item.id, item.qty + 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right w-20">
                                        <p className="font-bold text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 sticky top-20">
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Order Summary</h3>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold">Free</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="text-xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/25 text-sm"
                            >
                                Proceed to Checkout
                            </button>

                            <p className="text-center text-[10px] text-slate-400 mt-3">
                                Secure Checkout • Money Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
