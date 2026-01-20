const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
    // 100 series: Electronics & Gaming
    {
        id: 101,
        title: "Wireless Gaming Headset with 7.1 Surround Sound, Noise Cancelling Mic, RGB Lighting",
        price: 99.99, rating: 4.5, reviews: 1250,
        image: "/images/products/gaming_headset.png",
        isExpress: true, isBestSeller: true, category: "gaming",
        description: "Immerse yourself in the game with our premium Wireless Gaming Headset. Featuring 7.1 Surround Sound, you'll hear every footstep and explosion with crystal clarity. The noise-cancelling microphone ensures your team hears you loud and clear, while the customizable RGB lighting adds a touch of style to your setup.",
        features: ["7.1 Virtual Surround Sound", "Active Noise Cancelling Microphone", "Customizable RGB Lighting", "20-Hour Battery Life", "Ultra-Soft Memory Foam Earcups"]
    },
    {
        id: 102,
        title: "Mechanical Keyboard RGB with Customized Blue Switches for Typing and Gaming",
        price: 59.99, rating: 4.8, reviews: 890,
        image: "/images/products/mechanical_keyboard.png",
        isExpress: true, isBestSeller: false, category: "gaming",
        description: "Dominate the competition with this high-performance Mechanical Keyboard. Equipped with custom Blue switches for tactile feedback and audible clicks, every keystroke is satisfying and precise. The durable aluminum frame and dynamic RGB backlighting make it a centerpiece for any gaming rig.",
        features: ["Custom Blue Mechanical Switches", "Per-Key RGB Backlighting", "Aircraft-Grade Aluminum Frame", "100% Anti-Ghosting", "Detachable Wrist Rest"]
    },
    {
        id: 103,
        title: "4K Monitor 27-inch IPS 144Hz Refresh Rate, 1ms Response Time, HDR Support",
        price: 299.00, rating: 4.6, reviews: 450,
        image: "/images/products/monitor_4k.png",
        isExpress: false, isBestSeller: true, category: "electronics",
        description: "Experience visuals like never before with this 27-inch 4K IPS Monitor. With a 144Hz refresh rate and 1ms response time, motion blur is a thing of the past. HDR support brings out the deepest blacks and brightest whites for a truly cinematic experience.",
        features: ["27-inch 4K UHD (3840 x 2160) IPS Display", "144Hz Refresh Rate & 1ms Response Time", "HDR10 Support", "NVIDIA G-SYNC Compatible", "Ultra-Thin Bezels"]
    },
    {
        id: 104,
        title: "Smart Watch Series 5 - Space Grey Aluminium Case with Black Sport Band",
        price: 199.50, rating: 4.2, reviews: 3200,
        image: "/images/products/smart_watch.png",
        isExpress: true, isBestSeller: true, category: "electronics",
        description: "Stay connected and healthy with the Series 5 Smart Watch. Track your workouts, monitor your heart rate, and receive notifications directly on your wrist. The always-on retina display ensures you never miss a beat.",
        features: ["Always-On Retina Display", "ECG App & Heart Rate Monitor", "Built-in GPS & Compass", "Water Resistant to 50 Meters", "All-Day Battery Life"]
    },
    {
        id: 105,
        title: "Bluetooth Speaker Portable Waterproof IPX7 with 24H Playtime",
        price: 45.99, rating: 4.0, reviews: 150,
        image: "/images/products/bluetooth_speaker.png",
        isExpress: true, isBestSeller: false, category: "electronics",
        description: "Take the party anywhere with this Portable Bluetooth Speaker. IPX7 waterproof rating means it can handle pool parties and rain. Enjoy 24 hours of non-stop music with deep bass and clear highs.",
        features: ["360° Sound with Deep Bass", "IPX7 Waterproof", "24-Hour Playtime", "Wireless Stereo Pairing", "Rugged Design"]
    },
    {
        id: 106,
        title: "Laptop Stand Aluminum Ergonomic Riser for Desk, Ventilated Holder",
        price: 25.00, rating: 4.7, reviews: 670,
        image: "/images/products/laptop_stand.png",
        isExpress: true, isBestSeller: false, category: "office",
        description: "Improve your posture and cooling with this Ergonomic Aluminum Laptop Stand. Its ventilated design prevents overheating, while the adjustable height viewing angle reduces neck strain.",
        features: ["Premium Aluminum Alloy Construction", "Ergonomic Height & Angle Adjustment", "Ventilated Cooling Design", "Anti-Slip Silicone Pads", "Foldable & Portable"]
    },
    {
        id: 107,
        title: "Mirrorless Camera 24.2MP with 15-45mm Lens Kit",
        price: 649.00, rating: 4.9, reviews: 210,
        image: "/images/products/mirrorless_camera.png",
        isExpress: true, isBestSeller: true, category: "electronics",
        description: "Capture stunning photos and videos with this 24.2MP Mirrorless Camera. The included 15-45mm lens is perfect for everything from landscapes to portraits. Fast autofocus and 4K video recording capabilties make it a creator's dream.",
        features: ["24.2MP APS-C CMOS Sensor", "4K UHD Video Recording", "Dual Pixel CMOS AF", "Vari-Angle Touchscreen LCD", "Wi-Fi & Bluetooth Connectivity"]
    },
    {
        id: 109,
        title: "Gaming Mouse Pro with 16,000 DPI Optical Sensor, Customizable Chroma RGB",
        price: 69.99, rating: 4.7, reviews: 1840,
        image: "/images/products/gaming_mouse.png",
        isExpress: true, isBestSeller: false, category: "gaming",
        description: "Achieve pixel-perfect accuracy with the Gaming Mouse Pro. Featuring a 16,000 DPI optical sensor and customizable Chroma RGB lighting, it's designed for esports professionals.",
        features: ["16,000 DPI 5G Optical Sensor", "Razer Chroma RGB Lighting", "8 Programmable Buttons", "Mechanical Mouse Switches", "Ergonomic Design"]
    },
    {
        id: 110,
        title: "Ultra-Thin 15.6 Inch Laptop 16GB RAM, 512GB SSD, Windows 11",
        price: 749.00, rating: 4.4, reviews: 920,
        image: "/images/products/laptop_ultrathin.png",
        isExpress: true, isBestSeller: true, category: "electronics",
        description: "Power meets portability in this Ultra-Thin 15.6 Inch Laptop. With 16GB of RAM and a lightning-fast 512GB SSD, it handles multitasking with ease. The sleek metal body is both durable and stylish.",
        features: ["15.6-inch Full HD IPS Display", "Intel Core i7 Processor", "16GB RAM & 512GB NVMe SSD", "Backlit Keyboard", "All-Day Battery Life"]
    },

    // 200 series: Home & Kitchen
    {
        id: 201,
        title: "Professional Grade Blender for Smoothies, Shakes, and Frozen Drinks",
        price: 129.99, rating: 4.6, reviews: 2100,
        image: "/images/products/blender_pro.png",
        isExpress: true, isBestSeller: true, category: "home",
        description: "Blend anything from smoothies to hot soups with this Professional Grade Blender. Its powerful motor and hardened stainless steel blades pulverize tough ingredients for the smoothest results.",
        features: ["Powerful 1500W Motor", "Variable Speed Control & Pulse", "64oz BPA-Free Container", "Aircraft-Grade Stainless Steel Blades", "Self-Cleaning Function"]
    },
    {
        id: 202,
        title: "Chef's Knife 8-Inch High Carbon Stainless Steel with Ergonomic Handle",
        price: 39.99, rating: 4.8, reviews: 1540,
        image: "/images/products/chef_knife.png",
        isExpress: true, isBestSeller: false, category: "home",
        description: "Master the art of cooking with this 8-Inch Chef's Knife. Forged from high-carbon stainless steel, it retains a razor-sharp edge and resists corrosion. The ergonomic handle ensures comfort and control.",
        features: ["High-Carbon German Stainless Steel", "Razor-Sharp 15-Degree Edge", "Ergonomic Pakkawood Handle", "Full Tang Construction", "Rust & Stain Resistant"]
    },
    {
        id: 203,
        title: "Non-Stick Cookware Set 12-Piece Pots and Pans, Dishwasher Safe",
        price: 159.00, rating: 4.5, reviews: 3400,
        image: "/images/products/cookware_set.png",
        isExpress: false, isBestSeller: true, category: "home",
        description: "Upgrade your kitchen with this 12-Piece Non-Stick Cookware Set. The durable non-stick coating ensures easy food release and cleanup. Includes varied pots, pans, and lids for all your cooking needs.",
        features: ["Durable Non-Stick Coating", "Dishwasher & Oven Safe", "Tempered Glass Lids", "Cool-Touch Ergonomic Handles", "Even Heat Distribution"]
    },
    {
        id: 204,
        title: "Adjustable Standing Desk with Memory Presets, 48 x 24 Inches",
        price: 249.99, rating: 4.7, reviews: 1205,
        image: "/images/products/standing_desk.png",
        isExpress: true, isBestSeller: false, category: "office",
        description: "Stay active seamlessly with this Adjustable Standing Desk. Use the memory presets to easily switch between sitting and standing heights. The spacious 48x24 inch surface fits dual monitors.",
        features: ["Electric Height Adjustment", "4 Programmable Memory Presets", "Spacious 48\" x 24\" Work Surface", "Industrial-Grade Steel Frame", "Cable Management System"]
    },
    {
        id: 205,
        title: "Air Purifier with HEPA Filter for Large Rooms, Pollen and Dust Removal",
        price: 89.95, rating: 4.3, reviews: 2310,
        image: "/images/products/air_purifier.png",
        isExpress: true, isBestSeller: true, category: "home",
        description: "Breathe cleaner air with this HEPA Air Purifier. It captures 99.97% of dust, pollen, smoke, and pet dander. Perfect for large rooms, it operates quietly so you can sleep soundly.",
        features: ["True HEPA H13 Filter", "Coverage up to 500 sq. ft.", "Real-Time Air Quality Sensor", "Whisper-Quiet Sleep Mode", "Filter Replacement Indicator"]
    },

    // 300 series: Fashion & Accessories
    {
        id: 108,
        title: "Running Shoes Men's Lightweight Breathable Mesh Sport Sneakers",
        price: 49.95, rating: 4.3, reviews: 5400,
        image: "/images/products/running_shoes.png",
        isExpress: false, isBestSeller: true, category: "fashion",
        description: "Run further and faster with these Lightweight Running Shoes. The breathable mesh upper keeps feet cool, while the cushioned responsive midsole provides superior energy return.",
        features: ["Breathable Knit Mesh Upper", "Responsive Foam Cushioning", "Durable Rubber Outsole", "Lightweight Design", "Reflective Accents"]
    },
    {
        id: 301,
        title: "Polarized Sunglasses for Men and Women, UV Protection Sun Glasses",
        price: 19.99, rating: 4.1, reviews: 12000,
        image: "https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "fashion"
    },
    {
        id: 302,
        title: "Leather Wallet for Men with RFID Blocking, Slim Bifold Design",
        price: 34.50, rating: 4.6, reviews: 8900,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "fashion"
    },
    {
        id: 303,
        title: "Classic Canvas Backpack for School and Travel, Water Resistant",
        price: 29.99, rating: 4.4, reviews: 3400,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "fashion"
    },

    // 400 series: Beauty & Personal Care
    {
        id: 401,
        title: "Hydrating Facial Cleanser with Hyaluronic Acid and Ceramides",
        price: 15.99, rating: 4.8, reviews: 45200,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "beauty"
    },
    {
        id: 402,
        title: "Electric Toothbrush Rechargeable with 5 Modes, 3 Brush Heads",
        price: 49.00, rating: 4.5, reviews: 15600,
        image: "https://images.unsplash.com/photo-1559591409-6c3983087bd1?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "health"
    },
    {
        id: 403,
        title: "Vitamin C Serum for Face, Brightening and Anti-Aging Treatment",
        price: 24.99, rating: 4.7, reviews: 8900,
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "beauty"
    },

    // 500 series: Sports & Outdoors
    {
        id: 501,
        title: "Yoga Mat High Density Anti-Tear Exercise Mat with Carrying Strap",
        price: 21.99, rating: 4.6, reviews: 12400,
        image: "https://images.unsplash.com/photo-1592432676556-26d56d0abc45?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "sports"
    },
    {
        id: 502,
        title: "Insulated Stainless Steel Water Bottle, Leak Proof Flask",
        price: 18.50, rating: 4.7, reviews: 25000,
        image: "https://images.unsplash.com/photo-1602143399827-bd95ef68c3be?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "sports"
    },
    {
        id: 503,
        title: "Dumbbell Set with Rack, Rubber Encased Hex Design",
        price: 145.00, rating: 4.5, reviews: 1800,
        image: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&q=80&w=400",
        isExpress: false, isBestSeller: true, category: "sports"
    },

    // New categories fillers
    {
        id: 601,
        title: "Smart Wi-Fi Thermostat with Voice Control",
        price: 129.00, rating: 4.4, reviews: 560,
        image: "https://images.unsplash.com/photo-1563456338870-76678252277e?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "smart-home"
    },
    {
        id: 701,
        title: "Automatic Pet Feeder with Programmable Timer, 6L",
        price: 65.99, rating: 4.6, reviews: 890,
        image: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "pets"
    },
    {
        id: 901,
        title: "Car Trunk Organizer with Lid, Collapsible Multi-Compartment",
        price: 35.99, rating: 4.5, reviews: 1240,
        image: "https://images.unsplash.com/photo-1590124765662-cb89d38c6f60?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "automotive"
    },
    {
        id: 1001,
        title: "Building Blocks Set for Kids, 500 Pieces Classic Toys",
        price: 29.99, rating: 4.8, reviews: 3400,
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "toys"
    }
    ,

    // --- NEW PRODUCTS ---

    // Gaming
    {
        id: 111,
        title: "Gaming Desk with RGB LED Lights and Headphone Hook",
        price: 149.99, rating: 4.6, reviews: 320,
        image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "gaming",
        description: "Elevate your battlestation with this RGB Gaming Desk. Features a spacious carbon fiber surface, built-in headphone hook, cup holder, and dynamic RGB lighting.",
        features: ["Carbon Fiber Texture Surface", "RGB Lighting with Remote", "Headphone Hook & Cup Holder", "Heavy-Duty Z-Shape Legs", "Cable Management Grommets"]
    },
    {
        id: 112,
        title: "Wireless Gaming Controller for PC and Console",
        price: 49.99, rating: 4.4, reviews: 890,
        image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "gaming",
        description: "Experience precision control with this Wireless Gaming Controller. Ergonomic design, tactile buttons, and dual vibration motors provide an immersive gaming experience.",
        features: ["Wireless Connectivity", "Dual Vibration Motors", "Ergonomic Grip", "Long Battery Life", "Compatible with PC/Console"]
    },

    // Electronics
    {
        id: 113,
        title: "Noise Cancelling Wireless Earbuds with Charging Case",
        price: 89.99, rating: 4.5, reviews: 1540,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "electronics",
        description: "Block out the world and enjoy your music with these Noise Cancelling Earbuds. Compact charging case provides up to 24 hours of total playtime.",
        features: ["Active Noise Cancellation", "Transparency Mode", "24-Hour Battery with Case", "IPX4 Water Resistance", "Touch Controls"]
    },
    {
        id: 114,
        title: "Portable Power Bank 20000mAh Fast Charging",
        price: 39.99, rating: 4.7, reviews: 2100,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "electronics",
        description: "Never run out of battery again with this 20000mAh Power Bank. Supports fast charging for multiple devices simultaneously.",
        features: ["20000mAh High Capacity", "PD 20W Fast Charging", "Dual USB Output", "Slim & Portable Design", "LED Power Indicator"]
    },
    {
        id: 115,
        title: "Drone with 4K Camera and GPS Return Home",
        price: 299.00, rating: 4.3, reviews: 450,
        image: "https://images.unsplash.com/photo-1507581134179-c98d07636f88?auto=format&fit=crop&q=80&w=400",
        isExpress: false, isBestSeller: false, category: "electronics",
        description: "Capture breathtaking aerial footage with this 4K Camera Drone. Features GPS assisted flight, auto return home, and intelligent flight modes.",
        features: ["4K Ultra HD Camera", "GPS Return Home", "30-Minute Flight Time", "Follow Me Mode", "Brushless Motors"]
    },

    // Home & Kitchen
    {
        id: 206,
        title: "Robot Vacuum Cleaner with Smart Mapping",
        price: 199.99, rating: 4.4, reviews: 1200,
        image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "home",
        description: "Keep your floors spotless with this Smart Robot Vacuum. Intelligent mapping technology ensures efficient cleaning, while app control lets you schedule cleanings from anywhere.",
        features: ["Smart Mapping Navigation", "App & Voice Control", "Self-Charging", "Strong Suction Power", "Pet Hair Friendly"]
    },
    {
        id: 207,
        title: "Espresso Machine with Milk Frother",
        price: 149.50, rating: 4.6, reviews: 850,
        image: "https://images.unsplash.com/photo-1517088455820-e9aa1ebbea4f?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "home",
        description: "Brew coffeehouse-quality espresso at home. Includes a powerful steam wand for creamy cappuccinos and lattes.",
        features: ["15-Bar Pressure Pump", "Built-in Milk Frother", "Removable Water Tank", "Stainless Steel Boiler", "Cup Warmer"]
    },
    {
        id: 208,
        title: "Luxury Cotton Bath Towel Set, 6 Pieces",
        price: 45.00, rating: 4.7, reviews: 2300,
        image: "https://images.unsplash.com/photo-1616627561950-9f84a144b249?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "home",
        description: "Wrap yourself in luxury with this 6-Piece Cotton Bath Towel Set. Ultra-soft, highly absorbent, and durable.",
        features: ["100% Turkish Cotton", "6-Piece Set (2 Bath, 2 Hand, 2 Wash)", "High Absorbency", "Double-Stitched Hems", "Machine Washable"]
    },

    // Fashion
    {
        id: 304,
        title: "Men's Slim Fit Casual Cotton Shirt",
        price: 29.99, rating: 4.2, reviews: 1560,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "fashion",
        description: "A versatile slim-fit cotton shirt perfect for casual or semi-formal occasions. Breathable fabric ensures all-day comfort.",
        features: ["100% Premium Cotton", "Slim Fit Design", "Button-Down Collar", "Wrinkle-Resistant", "Available in Multiple Colors"]
    },
    {
        id: 305,
        title: "Women's High-Waisted Yoga Leggings with Pockets",
        price: 24.95, rating: 4.8, reviews: 4200,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "fashion",
        description: "Stay comfortable during your workout with these High-Waisted Yoga Leggings. Features side pockets for your phone and keys.",
        features: ["Buttery Soft Fabric", "4-Way Stretch", "High Waistband", "Side Pockets", "Squat Proof"]
    },
    {
        id: 306,
        title: "Unisex Aviator Sunglasses Gold Frame",
        price: 15.99, rating: 4.1, reviews: 980,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "fashion",
        description: "Classic Aviator Sunglasses with a gold frame. Provides UV400 protection to keep your eyes safe from harmful rays.",
        features: ["Classic Aviator Style", "UV400 Protection", "Metal Frame", "Comfortable Nose Pads", "Lightweight"]
    },

    // Beauty & Health
    {
        id: 404,
        title: "Organic Moroccan Argan Oil for Hair and Skin",
        price: 18.99, rating: 4.6, reviews: 1500,
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "beauty",
        description: "Pure Organic Argan Oil. Hydrates hair, skin, and nails. Cold-pressed to retain all essential nutrients.",
        features: ["100% Pure & Organic", "Cold Pressed", "Hair & Skin Moisturizer", "Non-Greasy Formula", "Cruelty-Free"]
    },
    {
        id: 405,
        title: "Digital Forehead Thermometer Non-Contact",
        price: 29.99, rating: 4.5, reviews: 3100,
        image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "health",
        description: "Get accurate temperature readings instantly with this Non-Contact Infrared Thermometer. Safe and hygienic for the whole family.",
        features: ["Non-Contact Measurement", "1-Second Reading", "Fever Alarm", "LCD Backlit Display", "Memory Recall"]
    },

    // Sports & Outdoors
    {
        id: 504,
        title: "Camping Tent 4 Person Waterproof",
        price: 89.99, rating: 4.4, reviews: 670,
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=400",
        isExpress: false, isBestSeller: false, category: "sports",
        description: "Enjoy the outdoors with this spacious 4-Person Camping Tent. Waterproof and easy to set up, precise for weekend getaways.",
        features: ["Sleeps 4 People", "Waterproof Rainfly", "Easy Setup", "Ventilated Mesh Windows", "Durable Storage Bag"]
    },
    {
        id: 505,
        title: "Adjustable Resistance Bands Set for Workout",
        price: 19.99, rating: 4.7, reviews: 5600,
        image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "sports",
        description: "Get a full-body workout at home with this Resistance Bands Set. Includes 5 bands of varying resistance levels.",
        features: ["5 Resistance Levels", "Door Anchor & Handles", "Portable & Lightweight", "Durable Latex", "Full Body Workout"]
    },

    // Smart Home
    {
        id: 602,
        title: "Smart LED Light Bulbs Color Changing, WiFi",
        price: 24.99, rating: 4.5, reviews: 1890,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "smart-home",
        description: "Transform your home ambiance with Smart LED Bulbs. Choose from 16 million colors and control with your voice or phone.",
        features: ["16 Million Colors", "Voice Control", "App Remote Control", "Schedule & Timer", "No Hub Required"]
    },
    {
        id: 603,
        title: "Video Doorbell Camera with Two-Way Audio",
        price: 79.99, rating: 4.3, reviews: 850,
        image: "https://images.unsplash.com/photo-1558002038-1091a166111c?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "smart-home",
        description: "See who's at your door from anywhere with this Video Doorbell. Features HD video, night vision, and two-way talk.",
        features: ["1080p HD Video", "Two-Way Audio", "PIR Motion Detection", "Night Vision", "Cloud Storage Support"]
    },

    // Pets
    {
        id: 702,
        title: "Orthopedic Memory Foam Dog Bed",
        price: 55.00, rating: 4.8, reviews: 1300,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=400",
        isExpress: false, isBestSeller: true, category: "pets",
        description: "Provide ultimate comfort for your furry friend with this Orthopedic Dog Bed. Memory foam supports joints and relieves pain.",
        features: ["High-Density Memory Foam", "Removable Washable Cover", "Waterproof Liner", "Non-Slip Bottom", "Sizes for All Breeds"]
    },
    {
        id: 703,
        title: "Adjustable Reflective Dog Harness",
        price: 22.99, rating: 4.6, reviews: 2100,
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "pets",
        description: "Keep your dog safe and comfortable with this Adjustable Harness. Reflective strips ensure visibility at night.",
        features: ["No-Pull Design", "Reflective Straps", "Adjustable Fit", "Breathable Mesh", "Sturdy Handle"]
    },

    // Automotive
    {
        id: 902,
        title: "Portable Car Vacuum Cleaner High Power",
        price: 32.99, rating: 4.4, reviews: 980,
        image: "https://images.unsplash.com/photo-1552998945-2990d134af1d?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: true, category: "automotive",
        description: "Keep your car interior clean with this Portable Vacuum. Strong suction picks up dust, crumbs, and pet hair easily.",
        features: ["High Power Suction", "Wet & Dry Use", "HEPA Filter", "Long Power Cord", "Multiple Attachments"]
    },

    // Toys
    {
        id: 1002,
        title: "RC Car High Speed Off-Road Truck",
        price: 45.99, rating: 4.5, reviews: 670,
        image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=400",
        isExpress: true, isBestSeller: false, category: "toys",
        description: "Race through any terrain with this High Speed RC Truck. Durable anti-collision design and responsive controls.",
        features: ["20km/h High Speed", "All-Terrain Tires", "2.4GHz Remote Control", "Anti-Collision Shell", "Rechargeable Battery"]
    }
];

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported Successfully with Categories!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
