import { useContext, useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Heart, ChevronDown, MapPin, Loader, Menu, X } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { CATEGORIES } from '../data/mockData';
import WishlistContext from '../context/WishlistContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('All');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    // Location State
    const [userLocation, setUserLocation] = useState('Select Location');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [pincodeInput, setPincodeInput] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('userLocation');
        if (saved) setUserLocation(saved);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.trim().length > 1) {
                try {
                    let url = `http://localhost:5000/api/products/suggestions?keyword=${encodeURIComponent(searchTerm)}`;
                    if (searchCategory !== 'All') {
                        url += `&category=${encodeURIComponent(searchCategory)}`;
                    }
                    const res = await fetch(url);
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setSuggestions(data);
                        setShowSuggestions(true);
                    } else {
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }
                } catch (error) {
                    console.error("Error fetching suggestions");
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchCategory]);

    const handleSuggestionClick = (product) => {
        setSearchTerm('');
        setShowSuggestions(false);
        navigate(`/product/${product.id}`);
    };

    const handleLogout = () => {
        logout();
        setShowAccountMenu(false);
        navigate('/');
    };

    const handleSearch = () => {
        setShowSuggestions(false);
        if (searchTerm.trim()) {
            let url = `/search/${searchTerm}`;
            if (searchCategory !== 'All') {
                url += `?category=${encodeURIComponent(searchCategory)}`;
            }
            navigate(url);
            setSearchTerm('');
        } else if (searchCategory !== 'All') {
            navigate(`/category/${searchCategory}`);
        }
    };

    const handleAutoLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await res.json();
                    const city = data.city || data.locality || "Unknown";
                    const newLoc = `${city}`;
                    setUserLocation(newLoc);
                    localStorage.setItem('userLocation', newLoc);
                    setShowLocationModal(false);
                } catch (error) {
                    setUserLocation("Location Set");
                    setShowLocationModal(false);
                } finally {
                    setIsLocating(false);
                }
            }, () => {
                alert("Location access denied.");
                setIsLocating(false);
            });
        } else {
            alert("Geolocation not supported");
            setIsLocating(false);
        }
    };

    const handlePincodeSubmit = (e) => {
        e.preventDefault();
        if (pincodeInput.length === 6) {
            setUserLocation(`PIN: ${pincodeInput}`);
            localStorage.setItem('userLocation', `PIN: ${pincodeInput}`);
            setShowLocationModal(false);
            setPincodeInput('');
        }
    };

    // Check if current page is a category
    const getCurrentCategory = () => {
        const path = location.pathname;
        if (path.startsWith('/category/')) {
            return path.replace('/category/', '');
        }
        return null;
    };

    return (
        <header className="sticky top-0 z-50 font-sans">
            {/* Main Navbar */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                    <div className="h-[72px] flex items-center justify-between gap-6">

                        {/* Left Section */}
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
                            </button>

                            <Link to="/" className="flex items-center gap-2.5 group">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                                    <span className="text-white font-black text-xl">K</span>
                                </div>
                                <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent hidden sm:block">
                                    kaltus
                                </span>
                            </Link>

                            {/* Location - Desktop */}
                            <div className="relative hidden xl:block">
                                <button
                                    onClick={() => setShowLocationModal(!showLocationModal)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors group"
                                >
                                    <MapPin size={16} className="text-violet-600" />
                                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[100px]">{userLocation}</span>
                                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </button>

                                {showLocationModal && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowLocationModal(false)}></div>
                                        <div className="absolute top-full left-0 mt-3 w-[300px] bg-white rounded-3xl p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 z-50">
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">Delivery Location</h3>
                                            <p className="text-sm text-slate-500 mb-5">Set your location for accurate delivery info.</p>

                                            <button
                                                onClick={handleAutoLocation}
                                                disabled={isLocating}
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3.5 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-70 mb-4 shadow-lg shadow-violet-500/25"
                                            >
                                                {isLocating ? <Loader size={18} className="animate-spin" /> : <MapPin size={18} />}
                                                {isLocating ? "Detecting..." : "Use My Location"}
                                            </button>

                                            <div className="flex items-center gap-3 my-4">
                                                <div className="flex-1 h-px bg-slate-200"></div>
                                                <span className="text-xs font-semibold text-slate-400 uppercase">or</span>
                                                <div className="flex-1 h-px bg-slate-200"></div>
                                            </div>

                                            <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="Enter Pincode"
                                                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-violet-500 focus:bg-white transition-all"
                                                    value={pincodeInput}
                                                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={pincodeInput.length !== 6}
                                                    className="bg-slate-900 text-white px-5 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-40 transition-colors"
                                                >
                                                    Set
                                                </button>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Center - Search */}
                        <div className="flex-1 max-w-2xl hidden md:block relative">
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-slate-400">
                                    <Search size={20} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-violet-500 rounded-full py-3.5 pl-12 pr-32 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Search for products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <div className="absolute right-1.5 flex items-center gap-1">
                                    <select
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                        className="appearance-none bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs font-bold px-3 py-2 rounded-full outline-none cursor-pointer transition-colors"
                                    >
                                        <option value="All">All</option>
                                        {CATEGORIES.slice(0, 6).map(cat => (
                                            <option key={cat.id} value={cat.title.toLowerCase().replace(/\s+/g, '-')}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleSearch}
                                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-2.5 rounded-full transition-all shadow-md shadow-violet-500/25"
                                    >
                                        <Search size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Suggestions */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50">
                                    {suggestions.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleSuggestionClick(product)}
                                            className="px-5 py-4 hover:bg-slate-50 cursor-pointer flex items-center gap-4 border-b border-slate-100 last:border-b-0 group transition-colors"
                                        >
                                            <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-xl p-2">
                                                <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-violet-700 transition-colors">{product.title}</p>
                                                <p className="text-xs text-slate-400 capitalize mt-0.5">in {product.category}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-1">
                            {/* Account */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                                        <User size={18} className="text-violet-700" />
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-[11px] text-slate-500 font-medium leading-tight">
                                            {user ? `Hello, ${user.name.split(' ')[0]}` : 'Sign In'}
                                        </p>
                                        <p className="text-sm font-bold text-slate-800 leading-tight flex items-center gap-1">
                                            Account <ChevronDown size={12} />
                                        </p>
                                    </div>
                                </button>

                                {showAccountMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)}></div>
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50">
                                            {user ? (
                                                <>
                                                    <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-slate-100">
                                                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                    </div>
                                                    <Link to="/profile" onClick={() => setShowAccountMenu(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-violet-700">Your Profile</Link>
                                                    <Link to="/orders" onClick={() => setShowAccountMenu(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-violet-700">Your Orders</Link>
                                                    <div className="border-t border-slate-100">
                                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">Sign Out</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-4">
                                                        <Link
                                                            to="/login"
                                                            onClick={() => setShowAccountMenu(false)}
                                                            className="block w-full text-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md shadow-violet-500/25"
                                                        >
                                                            Sign In
                                                        </Link>
                                                    </div>
                                                    <div className="px-4 pb-4 text-center">
                                                        <span className="text-xs text-slate-500">New customer? </span>
                                                        <Link to="/register" onClick={() => setShowAccountMenu(false)} className="text-xs font-bold text-violet-600 hover:underline">Start here</Link>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Wishlist */}
                            <Link to="/wishlist" className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                                <Heart size={22} className="text-slate-700" />
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-md">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="relative flex items-center gap-1.5 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <div className="relative">
                                    <ShoppingBag size={24} className="text-slate-700" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-md">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-bold text-slate-800 hidden lg:block">Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Bar - Desktop */}
            <div className="hidden lg:block bg-slate-900">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
                        {CATEGORIES.map(cat => {
                            const isActive = getCurrentCategory() === cat.link.replace('/category/', '');
                            return (
                                <Link
                                    key={cat.id}
                                    to={cat.link}
                                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-white text-slate-900'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {cat.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="lg:hidden bg-white border-b border-slate-200 shadow-lg">
                    <div className="p-4">
                        {/* Mobile Search */}
                        <div className="relative mb-4">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                className="w-full bg-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Mobile Categories */}
                        <div className="space-y-1">
                            {CATEGORIES.map(cat => (
                                <Link
                                    key={cat.id}
                                    to={cat.link}
                                    onClick={() => setShowMobileMenu(false)}
                                    className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-violet-700 rounded-xl transition-colors"
                                >
                                    {cat.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
