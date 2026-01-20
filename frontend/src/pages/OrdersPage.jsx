import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Package, Clock, CheckCircle } from 'lucide-react';
import API from '../config/api';

const OrdersPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (user) {
            const fetchOrders = async () => {
                try {
                    const response = await fetch(API.MY_ORDERS, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    const data = await response.json();
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [user, navigate]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-[1000px] mx-auto">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg border border-slate-200 p-8 text-center shadow-sm">
                        <Package size={48} className="mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
                        <p className="text-slate-500 mb-6">Looks like you haven't bought anything from Kaltus yet.</p>
                        <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                                    <div>
                                        <p className="uppercase text-xs font-bold text-slate-500">Order Placed</p>
                                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="uppercase text-xs font-bold text-slate-500">Total</p>
                                        <p className="font-bold text-slate-900">${order.totalPrice}</p>
                                    </div>
                                    <div>
                                        <p className="uppercase text-xs font-bold text-slate-500">Order #</p>
                                        <p className="font-mono text-xs">{order._id}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        {order.isDelivered ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle size={18} /> Delivered</span>
                                        ) : (
                                            <span className="text-blue-600 flex items-center gap-1"><Clock size={18} /> Arriving Soon</span>
                                        )}
                                        {order.isDelivered && order.deliveredAt && (
                                            <span className="text-slate-500 text-sm font-normal">- {new Date(order.deliveredAt).toLocaleDateString()}</span>
                                        )}
                                    </h4>

                                    <div className="space-y-4">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="w-20 h-20 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center p-2">
                                                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 hover:text-blue-600 cursor-pointer">{item.name}</p>
                                                    <p className="text-sm text-slate-500 mt-1">Qty: {item.qty} | Sold by: Kaltus</p>
                                                    <p className="text-sm font-bold text-slate-900 mt-1">${item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
