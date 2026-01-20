import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Package, RefreshCw, Lock, Mail, Save, MapPin, Plus, Trash2, Edit2 } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateProfile, addAddress, deleteAddress, updateAddress, setDefaultAddress, loading: authLoading } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('settings');
    const navigate = useNavigate();

    // Profile State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Addresses State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', postalCode: '', country: '' });

    // Orders State
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);

            if (activeTab === 'orders') {
                fetchOrders();
            }
        }
    }, [user, navigate, activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await fetch('http://localhost:5000/api/orders/myorders', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const res = await updateProfile({ id: user._id, name, email, password });
        if (res.success) {
            setMessage('Profile Updated Successfully');
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(res.message);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (isEditing) {
            const res = await updateAddress(editAddressId, addressForm);
            if (res.success) {
                setShowAddressForm(false);
                setIsEditing(false);
                setEditAddressId(null);
                setAddressForm({ street: '', city: '', state: '', postalCode: '', country: '' });
                setMessage('Address Updated Successfully');
            } else {
                setError(res.message);
            }
        } else {
            const res = await addAddress(addressForm);
            if (res.success) {
                setShowAddressForm(false);
                setAddressForm({ street: '', city: '', state: '', postalCode: '', country: '' });
                setMessage('Address Added Successfully');
            } else {
                setError(res.message);
            }
        }
    };

    const handleEditAddress = (addr) => {
        setIsEditing(true);
        setEditAddressId(addr._id);
        setAddressForm({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country
        });
        setShowAddressForm(true);
        setMessage('');
        setError('');
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            setMessage('');
            setError('');
            const res = await deleteAddress(addressId);
            if (res.success) {
                setMessage('Address Deleted Successfully');
            } else {
                setError(res.message);
            }
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        setMessage('');
        setError('');
        const res = await setDefaultAddress(addressId);
        if (res.success) {
            setMessage('Default Address Updated');
        } else {
            setError(res.message);
        }
    };

    const tabs = [
        { id: 'settings', label: 'Profile Settings', icon: User },
        { id: 'addresses', label: 'Your Addresses', icon: MapPin },
        { id: 'orders', label: 'Order History', icon: Package },
        { id: 'returns', label: 'Returns', icon: RefreshCw },
    ];

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Your Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === tab.id
                                        ? 'bg-slate-50 border-slate-900 text-slate-900'
                                        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow">
                        {message && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm font-medium shadow-sm border border-green-200">{message}</div>}
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm font-medium shadow-sm border border-red-200">{error}</div>}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-slate-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-slate-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <h3 className="text-sm font-medium text-slate-900 mb-4 text-slate-400 uppercase tracking-widest text-[10px]">Security</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">New Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock size={16} className="text-slate-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-colors"
                                                        placeholder="Leave blank to keep current password"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Confirm New Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock size={16} className="text-slate-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-md shadow-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all hover:-translate-y-0.5"
                                        >
                                            <Save size={16} className="mr-2" />
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h2 className="text-xl font-bold">Your Addresses</h2>
                                        <p className="text-sm text-slate-500 mt-1">Manage your shipping addresses for a faster checkout experience.</p>
                                    </div>
                                    {!showAddressForm && (
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setAddressForm({ street: '', city: '', state: '', postalCode: '', country: '' });
                                                setShowAddressForm(true);
                                            }}
                                            className="flex items-center text-sm font-bold text-white bg-slate-900 rounded-md px-5 py-2.5 hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5"
                                        >
                                            <Plus size={18} className="mr-2" />
                                            Add New Address
                                        </button>
                                    )}
                                </div>

                                {showAddressForm && (
                                    <form onSubmit={handleSaveAddress} className="mb-10 bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-inner">
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-900 text-white rounded-md">{isEditing ? <Edit2 size={16} /> : <Plus size={16} />}</div>
                                            {isEditing ? 'Edit Shipping Address' : 'New Shipping Address'}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Street Address</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. 123 Main St"
                                                    value={addressForm.street}
                                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">State / Province</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Postal Code</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.postalCode}
                                                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addressForm.country}
                                                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddressForm(false);
                                                    setIsEditing(false);
                                                }}
                                                className="px-6 py-2.5 border border-slate-300 rounded-md text-sm font-bold text-slate-700 hover:bg-white transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2.5 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
                                            >
                                                {isEditing ? 'Update Address' : 'Save Address'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {!user.addresses || user.addresses.length === 0 ? (
                                        <div className="col-span-full text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                            <MapPin size={40} className="mx-auto text-slate-300 mb-4" />
                                            <h3 className="text-base font-bold text-slate-900">No addresses saved yet</h3>
                                            <p className="text-slate-500 text-sm mt-1 mb-6">Start by adding your first shipping address.</p>
                                            <button onClick={() => {
                                                setIsEditing(false);
                                                setAddressForm({ street: '', city: '', state: '', postalCode: '', country: '' });
                                                setShowAddressForm(true);
                                            }} className="text-sm font-bold text-slate-900 underline underline-offset-4">Add one now</button>
                                        </div>
                                    ) : (
                                        user.addresses.map((addr, index) => (
                                            <div key={addr._id || index} className={`border rounded-xl p-6 relative group transition-all duration-300 ${addr.isDefault ? 'border-slate-900 bg-slate-50 shadow-lg ring-1 ring-slate-900 scale-[1.02]' : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/50'}`}>
                                                {addr.isDefault && (
                                                    <span className="absolute top-4 right-12 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-[0.1em] shadow-sm">
                                                        Default
                                                    </span>
                                                )}
                                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    <button
                                                        onClick={() => handleEditAddress(addr)}
                                                        className="text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-100 rounded"
                                                        title="Edit Address"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr._id)}
                                                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                                        title="Delete Address"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-start gap-5">
                                                    <div className={`p-3 rounded-xl shadow-sm ${addr.isDefault ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                                        <MapPin size={22} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-black text-slate-900 text-lg leading-tight uppercase tracking-tight">{user.name}</p>
                                                        <div className="mt-3 space-y-0.5">
                                                            <p className="text-slate-700 font-medium">{addr.street}</p>
                                                            <p className="text-slate-600 text-sm">{addr.city}, {addr.state} {addr.postalCode}</p>
                                                            <p className="text-slate-600 text-sm">{addr.country}</p>
                                                        </div>

                                                        {!addr.isDefault && (
                                                            <div className="mt-5 pt-4 border-t border-slate-200/60">
                                                                <button
                                                                    onClick={() => handleSetDefaultAddress(addr._id)}
                                                                    className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1 transition-all group/btn"
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/btn:bg-slate-900 transition-colors"></div>
                                                                    Set as Default
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-bold mb-6">Order History</h2>
                                {loadingOrders ? (
                                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>
                                ) : orders.length === 0 ? (
                                    <p className="text-slate-500">No orders found.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="font-mono text-[10px] text-slate-400 block mb-1 uppercase tracking-widest font-bold">Order ID</span>
                                                        <span className="font-bold text-sm text-slate-700">#{order._id}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {order.isDelivered ? 'Delivered' : 'In Progress'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Amount</p>
                                                        <p className="text-lg font-black text-slate-900">${order.totalPrice}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Order Date</p>
                                                        <p className="text-sm font-medium text-slate-600">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Returns Tab */}
                        {activeTab === 'returns' && (
                            <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-bold mb-6">Returns & Refunds</h2>
                                <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                                        <RefreshCw size={28} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">No Returns Active</h3>
                                    <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto font-medium">
                                        You have no active return requests. Items can be returned within 30 days of delivery.
                                    </p>
                                    <button onClick={() => setActiveTab('orders')} className="mt-8 text-sm font-bold bg-white border border-slate-200 px-6 py-2 rounded-md hover:bg-slate-50 transition-all shadow-sm">View eligible orders</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
