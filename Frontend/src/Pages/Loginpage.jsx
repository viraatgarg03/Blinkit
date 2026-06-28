import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { api } from '../services/api';

export default function Loginpage( { setIsLoggedIn } ) {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || '/';
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
      setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          const payload = {
            email: form.email,
            password: form.password,
          };

          if (mode === 'register') {
            const customer = await api.registerCustomer({
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone || null,
              address: form.address || null,
            });

            localStorage.setItem('blinkit_customer', JSON.stringify(customer));
            toast.success('Account created!');
          } else {
            const { customer } = await api.loginCustomer(payload);
            localStorage.setItem('blinkit_customer', JSON.stringify(customer));
            toast.success('Login successful!');
          }

          setIsLoggedIn(true);
          navigate(redirectPath, { replace: true });
        } catch (error) {
          toast.error(error.message);
        } finally {
          setIsSubmitting(false);
        }
      }
  return (
    <div className="bg-gray-50 px-4 py-12">
     <form className="mx-auto max-w-md rounded-lg
      bg-white p-8 shadow-md" onSubmit={handleLogin}>
        <h1 className="mb-6 text-2xl font-bold text-gray-950">{mode === 'login' ? 'Login' : 'Create account'}</h1>
        {mode === 'register' && (
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Full name"
            required
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        )}
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          required
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          required
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"  
        />
        {mode === 'register' && (
          <>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Phone number"
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              type="text"
              placeholder="Delivery address"
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
        <button
          type="button"
          className="mt-4 w-full text-sm font-semibold text-green-700"
          onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? 'Create a new account' : 'Already have an account? Login'}
        </button>
      </form>
    </div>
  )
}
