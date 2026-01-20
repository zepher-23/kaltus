const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.RZR_PAY_TEST_KEY,
    key_secret: process.env.RZR_PAY_TEST_SECRET,
});

const checkout = async (req, res) => {
    try {
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Payment Order Creation Failed"
        });
    }
};

const paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RZR_PAY_TEST_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database operations here (e.g. mark order as paid) happens in order creation usually
            // but we can return success here for frontend to proceed
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Verify Failed"
        });
    }
};

const getKey = (req, res) => {
    res.status(200).json({ key: process.env.RZR_PAY_TEST_KEY });
};

module.exports = {
    checkout,
    paymentVerification,
    getKey
};
