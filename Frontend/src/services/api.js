const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error(`Backend is not reachable at ${API_BASE_URL}. Please start the backend server.`);
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Request failed');
  }

  return data;
}

export function normalizeProduct(product) {
  const id = product.p_id ?? product.id;
  const price = Number(product.price ?? product.amount ?? 0);

  return {
    ...product,
    id,
    p_id: product.p_id ?? id,
    amount: price,
    price,
    quantity: product.stock ? `${product.stock} in stock` : 'Available',
    details: product.description,
    rating: product.rating || 4.5,
    image:
      product.image ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  };
}

export const api = {
  getProducts: async () => {
    const products = await request('/api/products');
    return products.map(normalizeProduct);
  },

  getProduct: async (id) => normalizeProduct(await request(`/api/products/${id}`)),

  createProduct: async (payload) => normalizeProduct(await request('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })),

  updateProduct: async (id, payload) => normalizeProduct(await request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })),

  deleteProduct: (id) =>
    request(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  getOrders: () => request('/api/orders'),

  getCustomers: () => request('/api/customers'),

  loginCustomer: (payload) =>
    request('/api/customers/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  registerCustomer: (payload) =>
    request('/api/customers/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCustomer: (id, payload) =>
    request(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  createOrder: (payload) =>
    request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  createPayment: (payload) =>
    request('/api/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  createRazorpayOrder: (payload) =>
    request('/api/payments/razorpay/order', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyRazorpayPayment: (payload) =>
    request('/api/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
