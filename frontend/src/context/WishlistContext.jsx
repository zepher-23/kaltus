import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users/wishlist', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setWishlist(data);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        }
    };

    const addToWishlist = async (productId) => {
        if (!user) {
            // Can't add to wishlist if not logged in (for now)
            // Or could store locally like cart? 
            // Let's enforce login for wishlist as it's a user feature.
            return { success: false, message: 'Please login to add to wishlist' };
        }

        try {
            const res = await fetch('http://localhost:5000/api/users/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (res.ok) {
                setWishlist(data);
                return { success: true };
            }
        } catch (error) {
            console.error("Failed to add to wishlist", error);
            return { success: false, message: 'Error adding to wishlist' };
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return;

        try {
            const res = await fetch(`http://localhost:5000/api/users/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setWishlist(data);
                return { success: true };
            }
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
            return { success: false, message: 'Error removing from wishlist' };
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(id => id == productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;
