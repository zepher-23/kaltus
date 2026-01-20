export const DEPARTMENTS = [
    { name: "Gaming", sub: ["Controllers", "Headsets", "Keyboards", "Mice", "Console Gaming", "PC Gaming"] },
    { name: "Electronics", sub: ["Computers & Accessories", "Camera & Photo", "Headphones", "Television & Video", "Car Electronics", "Wearable Technology"] },
    { name: "Home & Kitchen", sub: ["Kitchen & Dining", "Home Décor", "Bedding", "Furniture", "Bath", "Storage & Organization"] },
    { name: "Health & Care", sub: ["Vitamins & Supplements", "Personal Care", "Medical Supplies", "Nutrition", "Wellness"] },
    { name: "Fashion", sub: ["Women", "Men", "Girls", "Boys", "Baby", "Luggage & Travel Gear"] },
    { name: "Smart Home", sub: ["Security Cameras", "Lighting", "Plugs & Outlets", "Voice Assistants", "Locks & Entry"] },
    { name: "Pets", sub: ["Dogs", "Cats", "Fish & Aquatic", "Birds", "Small Animals"] },
    { name: "Office", sub: ["Office Supplies", "Electronics", "Office Furniture", "Papers", "Organization"] },
    { name: "Sports", sub: ["Exercise & Fitness", "Outdoor Recreation", "Camping", "Cycling", "Team Sports", "Hunting & Fishing"] },
    { name: "Beauty", sub: ["Makeup", "Skin Care", "Hair Care", "Fragrance", "Tools & Accessories"] },
    { name: "Automotive", sub: ["Parts", "Accessories", "Tools", "Tires", "Motorcycle"] },
    { name: "Toys", sub: ["Preschool", "Party Supplies", "Games", "Dolls", "Arts & Crafts", "Outdoor Play"] }
];

export const CATEGORIES = [
    {
        id: 1,
        title: "Gaming",
        image: "https://m.media-amazon.com/images/I/51aTOcI3h1L._AC_SL1200_.jpg",
        link: "/category/gaming"
    },
    {
        id: 2,
        title: "Electronics",
        image: "https://m.media-amazon.com/images/I/41qrX56lsYL._AC_.jpg",
        link: "/category/electronics"
    },
    {
        id: 3,
        title: "Home & Kitchen",
        image: "https://m.media-amazon.com/images/I/61NZkejMUIL._AC_SL1169_.jpg",
        link: "/category/home"
    },
    {
        id: 4,
        title: "Health & Care",
        image: "https://m.media-amazon.com/images/I/41qfjSfqNyL.jpg",
        link: "/category/health"
    },
    {
        id: 5,
        title: "Fashion",
        image: "https://m.media-amazon.com/images/I/61KIZjb54AL._AC_UL1500_.jpg",
        link: "/category/fashion"
    },
    {
        id: 6,
        title: "Smart Home",
        image: "https://m.media-amazon.com/images/I/51qxU4Zd5TL._AC_SL1050_.jpg",
        link: "/category/smart-home"
    },
    {
        id: 7,
        title: "Pets",
        image: "https://m.media-amazon.com/images/I/81yYPSv4X8L._AC_SL1500_.jpg",
        link: "/category/pets"
    },
    {
        id: 8,
        title: "Office",
        image: "https://m.media-amazon.com/images/I/61RPxmi+mPL._AC_SL1500_.jpg",
        link: "/category/office"
    },
    {
        id: 9,
        title: "Sports",
        image: "https://m.media-amazon.com/images/I/510tgKWHp2L._AC_.jpg",
        link: "/category/sports"
    },
    {
        id: 10,
        title: "Beauty",
        image: "https://m.media-amazon.com/images/I/71g1lP0pMbL._SL1500_.jpg",
        link: "/category/beauty"
    },
    {
        id: 11,
        title: "Automotive",
        image: "https://m.media-amazon.com/images/I/719FB7OJyTL._AC_SL1000_.jpg",
        link: "/category/automotive"
    },
    {
        id: 12,
        title: "Toys",
        image: "https://m.media-amazon.com/images/I/51tskkWgFmL._AC_SL1000_.jpg",
        link: "/category/toys"
    }
];

export const PRODUCTS = [
    {
        id: 101,
        title: "Pro Wireless Gaming Headset with 7.1 Surround",
        price: 99.99,
        rating: 4.5,
        reviews: 1250,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
        isPrime: true,
        isBestSeller: true
    },
    {
        id: 102,
        title: "RGB Mechanical Gaming Keyboard Blue Switch",
        price: 59.99,
        rating: 4.8,
        reviews: 890,
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600",
        isPrime: true,
        isBestSeller: false
    },
    {
        id: 103,
        title: "Ultra HD 4K Monitor 27-inch IPS Panel",
        price: 299.00,
        rating: 4.6,
        reviews: 450,
        image: "https://images.unsplash.com/photo-1527443224156-31a88056eafd?auto=format&fit=crop&q=80&w=600",
        isPrime: false,
        isBestSeller: true
    },
    {
        id: 104,
        title: "Smart Watch Series 5 Aluminium Case",
        price: 199.50,
        rating: 4.2,
        reviews: 3200,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
        isPrime: true,
        isBestSeller: true
    },
    {
        id: 105,
        title: "Portable Bluetooth Speaker Waterproof",
        price: 45.99,
        rating: 4.0,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600",
        isPrime: true,
        isBestSeller: false
    },
    {
        id: 106,
        title: "Ergonomic Laptop Stand Aluminum",
        price: 25.00,
        rating: 4.7,
        reviews: 670,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600",
        isPrime: true,
        isBestSeller: false
    },
    {
        id: 107,
        title: "Mirrorless Digital Camera Kit",
        price: 649.00,
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
        isPrime: true,
        isBestSeller: true
    },
    {
        id: 108,
        title: "Men's Lightweight Running Sneakers",
        price: 49.95,
        rating: 4.3,
        reviews: 5400,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
        isPrime: false,
        isBestSeller: true
    }
];

export const NAV_ITEMS = [
    "Today's Deals",
    "Customer Service",
    "Registry",
    "Gift Cards",
    "Sell"
];
