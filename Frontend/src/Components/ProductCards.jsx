import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { api } from '../services/api';

export default function ProductCards() {
  const { addToCart, removeFromCart, getProductQuantity } = useCart();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    api
      .getProducts()
      .then((backendProducts) => {
        if (!isMounted) return;
        setItems(backendProducts);
        setStatus('ready');
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white px-6 py-14">
      <div className="mx-auto max-w-6xl">
        {status === 'loading' && <p className="mb-6 text-center text-sm font-semibold text-gray-500">Loading products...</p>}
        {status === 'error' && <p className="mb-6 text-center text-sm font-semibold text-red-700">Backend products could not be loaded.</p>}
        {status === 'ready' && items.length === 0 && (
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-bold text-gray-950">No products in database</h3>
            <p className="mt-2 text-sm text-gray-600">Add products through the backend API and they will appear here.</p>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((card) => {
            const cartQuantity = getProductQuantity(card.id);

            return (
              <div key={card.id} className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Link to={`/products/${card.id}`}>
                  <img className="h-52 w-full object-cover" src={card.image} alt={card.name} />
                </Link>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
                    <span className="rounded-md bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">{card.quantity}</span>
                  </div>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-gray-600">{card.description}</p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-xl font-bold text-gray-900">Rs. {card.amount}</p>
                    {cartQuantity > 0 ? (
                      <div className="flex h-10 items-center overflow-hidden rounded-md border border-gray-300">
                        <button
                          className="h-full w-9 text-lg font-bold text-gray-900 transition hover:bg-gray-100"
                          type="button"
                          onClick={() => removeFromCart(card.id)}
                        >
                          -
                        </button>
                        <span className="min-w-10 px-2 text-center text-sm font-bold text-gray-900">{cartQuantity}</span>
                        <button
                          className="h-full w-9 text-lg font-bold text-gray-900 transition hover:bg-gray-100"
                          type="button"
                          onClick={() => addToCart(card)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="h-10 rounded-md bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700"
                        type="button"
                        onClick={() => addToCart(card)}
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
