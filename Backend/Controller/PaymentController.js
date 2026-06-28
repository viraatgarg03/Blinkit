const Payment = require('../Models/PaymentModel');
const Order = require('../Models/OrderModel');
const crypto = require('crypto');
const https = require('https');

const paymentIncludes = [Order];

const requestRazorpay = (path, payload) =>
    new Promise((resolve, reject) => {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            reject(new Error('Razorpay keys are missing'));
            return;
        }

        const body = JSON.stringify(payload);
        const request = https.request(
            {
                hostname: 'api.razorpay.com',
                path,
                method: 'POST',
                headers: {
                    Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
            },
            (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    const parsed = data ? JSON.parse(data) : {};

                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        resolve(parsed);
                        return;
                    }

                    reject(new Error(parsed?.error?.description || 'Razorpay request failed'));
                });
            },
        );

        request.on('error', reject);
        request.write(body);
        request.end();
    });

const createRazorpayOrder = async (req, res) => {
    try {
        const amount = Math.round(Number(req.body.amount || 0) * 100);

        if (!amount || amount < 100) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        const razorpayOrder = await requestRazorpay('/v1/orders', {
            amount,
            currency: req.body.currency || 'INR',
            receipt: req.body.receipt || `blinkit-${Date.now()}`,
            notes: req.body.notes || {},
        });

        res.status(201).json(razorpayOrder);
    } catch (error) {
        res.status(500).json({ message: 'Razorpay order create nahi hua', error: error.message });
    }
};

const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keySecret) {
            return res.status(500).json({ message: 'Razorpay secret is missing' });
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Razorpay payment details are required' });
        }

        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Razorpay payment verification failed' });
        }

        res.status(200).json({ verified: true });
    } catch (error) {
        res.status(500).json({ message: 'Razorpay payment verify nahi hua', error: error.message });
    }
};

const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        const paymentWithDetails = await Payment.findByPk(payment.id, { include: paymentIncludes });
        res.status(201).json(paymentWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Payment create nahi hua', error: error.message });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({ include: paymentIncludes });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Payments fetch nahi hue', error: error.message });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id, { include: paymentIncludes });

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Payment fetch nahi hua', error: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        await payment.update(req.body);
        const updatedPayment = await Payment.findByPk(payment.id, { include: paymentIncludes });
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: 'Payment update nahi hua', error: error.message });
    }
};

const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment nahi mila' });
        }

        await payment.destroy();
        res.status(200).json({ message: 'Payment delete ho gaya' });
    } catch (error) {
        res.status(500).json({ message: 'Payment delete nahi hua', error: error.message });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    createRazorpayOrder,
    verifyRazorpayPayment,
};
