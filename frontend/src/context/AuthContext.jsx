import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const register = async (name, email, password) => {
        const response = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateProfile = async (userProfile) => {
        const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(userProfile),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const addAddress = async (address) => {
        const response = await fetch('http://localhost:5000/api/users/profile/addresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(address),
        });

        let data;
        try {
            data = await response.json();
        } catch (err) {
            return { success: false, message: 'Server returned an invalid response. Please check backend logs.' };
        }

        if (response.ok) {
            // Backend returns THE WHOLE ADDRESS ARRAY
            const updatedUser = { ...user, addresses: data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        } else {
            return { success: false, message: data.message || 'An error occurred' };
        }
    };

    const deleteAddress = async (addressId) => {
        const response = await fetch(`http://localhost:5000/api/users/profile/addresses/${addressId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            // Backend returns THE WHOLE ADDRESS ARRAY
            const updatedUser = { ...user, addresses: data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const updateAddress = async (addressId, address) => {
        const response = await fetch(`http://localhost:5000/api/users/profile/addresses/${addressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(address),
        });

        const data = await response.json();

        if (response.ok) {
            const updatedUser = { ...user, addresses: data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const setDefaultAddress = async (addressId) => {
        const response = await fetch(`http://localhost:5000/api/users/profile/addresses/${addressId}/default`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            const updatedUser = { ...user, addresses: data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, addAddress, deleteAddress, updateAddress, setDefaultAddress, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
