// API Configuration for Production/Development
// Uses environment variable in production, localhost in development

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API = {
    BASE_URL: API_BASE_URL,

    // Products
    PRODUCTS: `${API_BASE_URL}/api/products`,
    PRODUCT: (id) => `${API_BASE_URL}/api/products/${id}`,
    SUGGESTIONS: `${API_BASE_URL}/api/products/suggestions`,

    // Users
    USERS: `${API_BASE_URL}/api/users`,
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/users/register`,
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    WISHLIST: `${API_BASE_URL}/api/users/wishlist`,
    ADDRESS: `${API_BASE_URL}/api/users/address`,

    // Orders
    ORDERS: `${API_BASE_URL}/api/orders`,
    ORDER: (id) => `${API_BASE_URL}/api/orders/${id}`,
    MY_ORDERS: `${API_BASE_URL}/api/orders/myorders`,

    // Payment
    PAYMENT_CREATE: `${API_BASE_URL}/api/payment/create-order`,
    PAYMENT_VERIFY: `${API_BASE_URL}/api/payment/verify`,
    RAZORPAY_KEY: `${API_BASE_URL}/api/payment/key`,

    // Reviews
    REVIEWS: `${API_BASE_URL}/api/reviews`,
    PRODUCT_REVIEWS: (productId) => `${API_BASE_URL}/api/reviews/product/${productId}`,
};

export default API;
