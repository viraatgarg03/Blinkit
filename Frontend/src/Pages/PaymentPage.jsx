import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLockOutline, MdPayment } from 'react-icons/md';
import useCart from '../hooks/useCart';
import { api } from '../services/api';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  const total = subtotal + (subtotal > 0 ? 25 : 0);
  const customer = JSON.parse(localStorage.getItem('blinkit_customer') || 'null');
  const checkoutDetails = JSON.parse(localStorage.getItem('blinkit_checkout') || 'null');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState('razorpay'); // razorpay | cash

  const createOrdersAndPayment = async ({ paymentMethod, paymentStatus, transactionId = null }) => {
    const createdOrders = [];

    for (const item of cartItems) {
      const order = await api.createOrder({
        customerId: customer.id,
        productId: item.p_id ?? item.id,
        quantity: item.quantity,
      });

      await api.createPayment({
        orderId: order.id,
        amount: item.amount * item.quantity,
        paymentMethod,
        paymentStatus,
        transactionId,
      });

      createdOrders.push(order.id);
    }

    return createdOrders;
  };

  const handlePayment = async (event) => {
    event.preventDefault();


    if (!customer?.id) {
      toast.error('Please login again');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      navigate('/');
      return;
    }

    // Cash on Delivery flow (skip Razorpay)
    if (paymentMode === 'cash') {
      setIsProcessing(true);
      try {
        const createdOrders = await createOrdersAndPayment({
          paymentMethod: 'cash',
          paymentStatus: 'success',
          transactionId: null,
        });

        clearCart();
        localStorage.removeItem('blinkit_checkout');
        toast.success('Order placed successfully (COD)!');
        navigate('/order-success', { replace: true, state: { orderIds: createdOrders } });
      } catch (error) {
        toast.error(error.message || 'COD failed');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (!razorpayKeyId) {
      toast.error('Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID in Frontend/.env');
      return;
    }

    setIsProcessing(true);

    try {

      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        throw new Error('Razorpay checkout could not be loaded');
      }

      const razorpayOrder = await api.createRazorpayOrder({
        amount: total,
        currency: 'INR',
        receipt: `blinkit-${Date.now()}`,
        notes: {
          customerId: String(customer.id),
          items: String(cartItems.length),
        },
      });

      const razorpay = new window.Razorpay({
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Blinkit',
        description: `${cartItems.length} grocery item${cartItems.length === 1 ? '' : 's'}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: checkoutDetails?.name || customer.name || '',
          email: customer.email || '',
          contact: checkoutDetails?.phone || customer.phone || '',
        },
        notes: {
          address: checkoutDetails?.address || customer.address || '',
        },
        theme: {
          color: '#16a34a',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (response) => {
          try {
            await api.verifyRazorpayPayment(response);
            const createdOrders = await createOrdersAndPayment({
              paymentMethod: 'razorpay',
              paymentStatus: 'success',
              transactionId: `${response.razorpay_payment_id}`,
            });


            clearCart();
            localStorage.removeItem('blinkit_checkout');
            toast.success('Payment successful!');
            navigate('/order-success', { replace: true, state: { orderIds: createdOrders } });
          } catch (error) {
            toast.error(error.message);
          } finally {
            setIsProcessing(false);
          }
        },
      });

      razorpay.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed');
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-md bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <MdLockOutline className="text-xl text-green-600" />
          <h1 className="text-2xl font-bold text-gray-950">Secure Payment</h1>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handlePayment}>
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
            Payable amount: Rs. {total}
          </div>
          <div className="rounded-md border border-gray-200 p-4">
            <p className="text-sm font-bold text-gray-950">Payment Options</p>
            <div className="mt-3 flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-3">
                <input
                  type="radio"
                  name="paymentMode"
                  value="razorpay"
                  checked={paymentMode === 'razorpay'}
                  onChange={() => setPaymentMode('razorpay')}
                />
                <span className="text-sm font-bold text-gray-950">Razorpay</span>
                <span className="ml-auto text-xs font-semibold text-gray-500">UPI / Cards / Netbanking</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-3">
                <input
                  type="radio"
                  name="paymentMode"
                  value="cash"
                  checked={paymentMode === 'cash'}
                  onChange={() => setPaymentMode('cash')}
                />
                <span className="text-sm font-bold text-gray-950">Cash on Delivery</span>
                <span className="ml-auto text-xs font-semibold text-gray-500">Pay at doorstep</span>
              </label>
            </div>
          </div>

          {paymentMode === 'razorpay' ? (
            <button
              disabled={isProcessing}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              type="submit"
            >
              <MdPayment /> {isProcessing ? 'Opening Razorpay...' : 'Pay with Razorpay'}
            </button>
          ) : (
            <button
              disabled={isProcessing}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-yellow-500 px-5 py-3 font-bold text-gray-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-gray-300"
              type="submit"
            >
              <MdPayment /> {isProcessing ? 'Placing COD order...' : 'Place COD Order'}
            </button>
          )}

        </form>
      </div>
    </section>
  );
}
