const Razorpay = require('razorpay');
const crypto = require('crypto');

// Lazy initialization of Razorpay instance
let razorpayInstance = null;

const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        const key_id = process.env.RZR_PAY_TEST_KEY;
        const key_secret = process.env.RZR_PAY_TEST_SECRET;

        if (!key_id || !key_secret) {
            console.error('Razorpay credentials not found in environment variables');
            console.error('Required: RZR_PAY_TEST_KEY and RZR_PAY_TEST_SECRET');
            return null;
        }

        razorpayInstance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });
    }
    return razorpayInstance;
};

const checkout = async (req, res) => {
    try {
        const instance = getRazorpayInstance();

        if (!instance) {
            return res.status(500).json({
                success: false,
                message: "Payment service not configured. Please contact support."
            });
        }

        // Currency Conversion: USD to INR (Approx 1 USD = 86 INR)
        const EXCHANGE_RATE = 86;
        const amountInINR = Math.ceil(Number(req.body.amount) * EXCHANGE_RATE);

        const options = {
            // razorpay works in smallest currency unit (paise for INR)
            amount: amountInINR * 100,
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({
            success: false,
            message: "Payment Order Creation Failed"
        });
    }
};

const paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const key_secret = process.env.RZR_PAY_TEST_SECRET;

        if (!key_secret) {
            return res.status(500).json({
                success: false,
                message: "Payment verification service not configured"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            res.status(200).json({
                success: true,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid Signature",
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: "Verify Failed"
        });
    }
};

const getKey = (req, res) => {
    const key = process.env.RZR_PAY_TEST_KEY;
    if (!key) {
        return res.status(500).json({
            success: false,
            message: "Payment key not configured"
        });
    }
    res.status(200).json({ key });
};

module.exports = {
    checkout,
    paymentVerification,
    getKey
};
