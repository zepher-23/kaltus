import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    // Generate a user-specific storage key
    const getCartKey = () => {
        if (user && user._id) {
            return `cart_${user._id}`;
        }
        return 'cart_guest';
    };

    // Load cart from localStorage based on current user
    useEffect(() => {
        const cartKey = getCartKey();
        try {
            const savedCart = localStorage.getItem(cartKey);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        } catch (error) {
            console.error("Failed to load cart from local storage:", error);
            setCartItems([]);
        }
    }, [user]); // Re-run when user changes (login/logout)

    // Update totals and local storage whenever cartItems change
    useEffect(() => {
        try {
            // Calculate total price
            const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
            setCartTotal(parseFloat(total.toFixed(2)));

            // Calculate item count
            const count = cartItems.reduce((acc, item) => acc + item.qty, 0);
            setCartCount(count);

            // Persist to local storage with user-specific key
            const cartKey = getCartKey();
            localStorage.setItem(cartKey, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to update cart totals or local storage:", error);
        }
    }, [cartItems, user]);

    // Add item to cart
    const addToCart = (product, qty = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            } else {
                return [...prevItems, {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    qty: qty
                }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Update item quantity directly
    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        if (newQty > 99) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, qty: newQty } : item
            )
        );
    };

    // Clear cart (e.g., after purchase)
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

