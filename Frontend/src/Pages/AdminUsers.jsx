import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaMoneyBill, FaSearch } from 'react-icons/fa';
import { api } from '../services/api';

const formatMoney = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getOrderTotal = (order) => {
  const paymentAmount = Number(order.Payment?.amount || 0);
  const productAmount = Number(order.Product?.price || 0) * Number(order.quantity || 0);
  return paymentAmount || productAmount;
};

const getOrderStatus = (order) => {
  const status = order.Payment?.paymentStatus;
  if (status === 'success') return 'Delivered';
  if (status === 'failed') return 'Cancelled';
  if (status === 'pending') return 'Processing';
  return 'Pending';
};

const getPaymentMethodLabel = (order) => {
  const method = order.Payment?.paymentMethod;
  if (!method) return 'Not paid';
  if (method === 'cash') return 'Cash on Delivery';
  if (method === 'razorpay') return 'Razorpay';
  return method;
};

export default function AdminUsers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    Promise.allSettled([api.getCustomers(), api.getOrders()])
      .then(([customersResult, ordersResult]) => {
        if (ignore) return;
        setCustomers(customersResult.status === 'fulfilled' ? customersResult.value : []);
        setOrders(ordersResult.status === 'fulfilled' ? ordersResult.value : []);
      })
      .catch((error) => toast.error(error.message || 'Failed to load users/orders'))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const customerOrdersMap = useMemo(() => {
    const map = new Map();
    for (const c of customers) {
      map.set(c.id, []);
    }

    for (const order of orders) {
      const customerId = order.customerId ?? order.Customer?.id;
      if (!customerId) continue;
      if (!map.has(customerId)) map.set(customerId, []);
      map.get(customerId).push(order);
    }

    for (const [, items] of map) {
      items.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return map;
  }, [customers, orders]);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return customers;

    return customers.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }, [customers, searchQuery]);

  if (loading) {
    return (
      <div className="p-5 sm:p-8">
        <p className="text-sm font-bold text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-950">Users</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">Customer names and their orders</p>
      </div>

      <div className="mb-6 max-w-md">
        <label className="relative block">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search users by name, email, or phone..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </label>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-12 text-center shadow-sm">
          <FaBoxOpen className="mx-auto mb-4 h-14 w-14 text-gray-300" />
          <p className="font-bold text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCustomers.map((customer) => {
            const userOrders = customerOrdersMap.get(customer.id) || [];

            return (
              <section key={customer.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-gray-950">{customer.name}</p>
                    <p className="mt-1 truncate text-sm font-medium text-gray-500">{customer.email || 'No email'} • {customer.phone || 'No phone'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                      {userOrders.length} orders
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {userOrders.length === 0 ? (
                    <p className="text-sm font-semibold text-gray-500">No orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {userOrders.map((order) => (
                        <div key={order.id} className="flex flex-col gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-gray-950">ORD{String(order.id).padStart(3, '0')}</p>
                            <p className="mt-1 truncate text-sm font-medium text-gray-500">
                              {order.Product?.name || `Product #${order.productId}`}
                              {` • Qty: ${order.quantity || 1}`}
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                              <FaMoneyBill className="h-3.5 w-3.5" />
                              {formatMoney(getOrderTotal(order))}
                            </span>
                            <p className="mt-2 text-sm font-bold text-gray-950">{getOrderStatus(order)} • {getPaymentMethodLabel(order)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

