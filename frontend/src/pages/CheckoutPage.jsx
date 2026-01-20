import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, CheckCircle, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import API from '../config/api';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const { user, addAddress } = useContext(AuthContext);
    const navigate = useNavigate();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });
    const [loadingPay, setLoadingPay] = useState(false);

    useEffect(() => {
        const loadRazorpay = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpay();
    }, []);

    useEffect(() => {
        if (user && user.addresses && user.addresses.length > 0 && !selectedAddress) {
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [user, selectedAddress]);

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        const res = await addAddress(newAddress);
        if (res.success) {
            setIsAddingAddress(false);
        } else {
            alert(res.message);
        }
    };

    const handlePayment = async () => {
        if (!selectedAddress) {
            alert("Please select a delivery address.");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setLoadingPay(true);

        try {
            const keyRes = await fetch(API.PAYMENT_GETKEY, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const { key } = await keyRes.json();

            if (!key) throw new Error("Could not retrieve Razorpay Key");

            const orderRes = await fetch(API.PAYMENT_CHECKOUT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ amount: cartTotal })
            });
            const { order } = await orderRes.json();

            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Kaltus Store",
                description: "Premium Purchase",
                image: "https://avatars.githubusercontent.com/u/12345678?v=4",
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await fetch(API.PAYMENT_VERIFY, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        placeOrder(verifyData);
                    } else {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: "9999999999"
                },
                theme: {
                    color: "#7c3aed"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment Error: ", error);
            alert("Payment initiation failed.");
        } finally {
            setLoadingPay(false);
        }
    };

    const placeOrder = async (paymentDetails) => {
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.title,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item.id
                })),
                shippingAddress: selectedAddress,
                paymentMethod: 'Razorpay',
                itemsPrice: cartTotal,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: cartTotal,
                paymentResult: {
                    id: paymentDetails.razorpay_payment_id,
                    status: 'paid',
                    update_time: new Date().toISOString(),
                    email_address: user.email
                }
            };

            const res = await fetch(API.ORDERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                clearCart();
                navigate('/orders');
            } else {
                alert("Order creation failed. Please contact support.");
            }
        } catch (error) {
            console.error("Order Creation Error:", error);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 text-center">
                <div>
                    <h2 className="text-xl font-bold mb-3">Cart is Empty</h2>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm">Go Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans py-6">
            <div className="max-w-[1100px] mx-auto px-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-5">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Address & Payment */}
                    <div className="flex-grow space-y-4">

                        {/* Address Section */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <MapPin size={18} className="text-violet-500" /> Delivery Address
                                </h2>
                                <button
                                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                                    className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add New
                                </button>
                            </div>

                            {/* Add Address Form */}
                            {isAddingAddress && (
                                <form onSubmit={handleAddressSubmit} className="mb-4 p-4 bg-violet-50 rounded-xl border border-violet-100">
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <input type="text" placeholder="Street" className="p-2.5 border rounded-lg text-sm w-full" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} required />
                                        <input type="text" placeholder="City" className="p-2.5 border rounded-lg text-sm w-full" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} required />
                                        <input type="text" placeholder="State" className="p-2.5 border rounded-lg text-sm w-full" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} required />
                                        <input type="text" placeholder="Postal Code" className="p-2.5 border rounded-lg text-sm w-full" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} required />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsAddingAddress(false)} className="px-3 py-1.5 text-slate-500 font-semibold text-sm hover:bg-slate-100 rounded-lg">Cancel</button>
                                        <button type="submit" className="px-4 py-1.5 bg-violet-600 text-white font-semibold text-sm rounded-lg hover:bg-violet-700">Save</button>
                                    </div>
                                </form>
                            )}

                            {/* Address Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {user?.addresses?.map((addr) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => setSelectedAddress(addr)}
                                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-sm relative ${selectedAddress?._id === addr._id ? 'border-violet-500 bg-violet-50' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        {selectedAddress?._id === addr._id && (
                                            <CheckCircle size={16} className="absolute top-2 right-2 text-violet-600" fill="#7c3aed" />
                                        )}
                                        <p className="font-semibold text-slate-800">{addr.street}</p>
                                        <p className="text-slate-500 text-xs">{addr.city}, {addr.state} {addr.postalCode}</p>
                                    </div>
                                ))}
                                {(!user?.addresses || user.addresses.length === 0) && (
                                    <p className="text-slate-400 text-sm col-span-2">No addresses found. Add one above.</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                                <CreditCard size={18} className="text-violet-500" /> Payment
                            </h2>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="font-bold text-indigo-700 text-sm">Razorpay</span>
                                <span className="text-xs text-slate-500">Secure payment gateway</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 sticky top-20">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ShoppingBag size={16} /> Summary
                            </h3>

                            <div className="space-y-2 max-h-40 overflow-y-auto mb-4 pr-1">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center text-sm">
                                        <div className="w-10 h-10 bg-slate-50 rounded p-0.5 border border-slate-100 flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-slate-800 font-medium truncate text-xs">{item.title}</p>
                                            <p className="text-slate-400 text-[10px]">x{item.qty}</p>
                                        </div>
                                        <p className="font-semibold text-slate-900 text-xs">${(item.price * item.qty).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm mb-4">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold flex items-center gap-1"><Truck size={12} /> Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-900 pt-2">
                                    <span>Total</span>
                                    <span className="text-lg">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loadingPay || !selectedAddress || cartItems.length === 0}
                                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingPay ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                            </button>

                            <p className="text-center text-[10px] text-slate-400 mt-3">
                                By placing this order, you agree to our Terms & Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
