import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLockOutline } from 'react-icons/md';
import useCart from '../hooks/useCart';
import { api } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((total, item) => total + item.amount * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const total = subtotal + deliveryFee;
  const customer = JSON.parse(localStorage.getItem('blinkit_customer') || 'null');
  const [form, setForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: '',
    pincode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = [form.address, form.city, form.pincode].filter(Boolean).join(', ');

      if (customer?.id) {
        const updatedCustomer = await api.updateCustomer(customer.id, {
          name: form.name,
          phone: form.phone || null,
          address: fullAddress,
        });
        localStorage.setItem('blinkit_customer', JSON.stringify(updatedCustomer));
      }

      localStorage.setItem('blinkit_checkout', JSON.stringify({ ...form, address: fullAddress, total }));
      navigate('/payment');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
        <form id="checkout-form" className="rounded-md bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <MdLockOutline className="text-xl text-green-600" />
            <h1 className="text-2xl font-bold text-gray-950">Checkout</h1>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input name="name" value={form.name} onChange={handleChange} required className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="Full name" />
            <input name="phone" value={form.phone} onChange={handleChange} required className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="Phone number" />
            <input name="address" value={form.address} onChange={handleChange} required className="sm:col-span-2 rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="House no, building, street" />
            <input name="city" value={form.city} onChange={handleChange} required className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="City" />
            <input name="pincode" value={form.pincode} onChange={handleChange} required className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="Pincode" />
          </div>
        </form>

        <aside className="h-fit rounded-md bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-950">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex justify-between"><span>Items</span><span>{cartItems.length}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>Rs. {deliveryFee}</span></div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-950">
              <span>Total</span><span>Rs. {total}</span>
            </div>
          </div>
          <button form="checkout-form" type="submit" disabled={isSubmitting || cartItems.length === 0} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300">
            <MdLockOutline /> {isSubmitting ? 'Saving...' : 'Continue to payment'}
          </button>
        </aside>
      </div>
    </section>
  );
}
