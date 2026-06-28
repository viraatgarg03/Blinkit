import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaEye, FaSearch } from 'react-icons/fa';
import { api } from '../services/api';

const statusOptions = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

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

const getStatusClass = (status) => {
  if (status === 'Delivered') return 'bg-green-100 text-green-700';
  if (status === 'Processing') return 'bg-blue-100 text-blue-700';
  if (status === 'Cancelled') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-700';
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    api.getOrders()
      .then((items) => {
        if (!ignore) setOrders(items);
      })
      .catch((error) => toast.error(error.message || 'Orders fetch nahi hue'))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return orders.filter((order) => {
      const orderId = `ORD${String(order.id).padStart(3, '0')}`.toLowerCase();
      const customer = (order.Customer?.name || '').toLowerCase();
      const product = (order.Product?.name || '').toLowerCase();
      const status = getOrderStatus(order);
      const matchesSearch = !query || orderId.includes(query) || customer.includes(query) || product.includes(query);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="p-5 sm:p-8">
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button type="button" aria-label="Close order details" className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <section className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-black text-gray-950">Order Details</h2>
            <div className="mt-5 space-y-3 text-sm">
              <p><span className="font-bold text-gray-500">Order ID:</span> ORD{String(selectedOrder.id).padStart(3, '0')}</p>
              <p><span className="font-bold text-gray-500">Customer:</span> {selectedOrder.Customer?.name || 'Customer'}</p>
              <p><span className="font-bold text-gray-500">Product:</span> {selectedOrder.Product?.name || 'Product'}</p>
              <p><span className="font-bold text-gray-500">Quantity:</span> {selectedOrder.quantity || 1}</p>
              <p><span className="font-bold text-gray-500">Payment:</span> {selectedOrder.Payment?.paymentMethod || 'Not paid'}</p>
              <p><span className="font-bold text-gray-500">Total:</span> {formatMoney(getOrderTotal(selectedOrder))}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="mt-6 h-11 w-full rounded-lg bg-yellow-400 text-sm font-black text-gray-950 transition hover:bg-yellow-500"
            >
              Close
            </button>
          </section>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-950">Orders</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">Manage customer orders</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <label className="relative block max-w-md flex-1">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by order, customer or product..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
          ))}
        </select>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Product', 'Items', 'Total', 'Status', 'Actions'].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-left text-sm font-black text-gray-950">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-sm font-bold text-gray-500">Loading orders...</td>
                </tr>
              ) : filteredOrders.map((order) => {
                const status = getOrderStatus(order);
                return (
                  <tr key={order.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-black text-gray-950">ORD{String(order.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-950">{order.Customer?.name || `Customer #${order.customerId}`}</p>
                      <p className="text-sm font-medium text-gray-500">{order.Customer?.address || order.Customer?.email || 'No address'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">{order.Product?.name || `Product #${order.productId}`}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">{order.quantity || 1}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-950">{formatMoney(getOrderTotal(order))}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(status)}`}>{status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-gray-100 px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                      >
                        <FaEye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {!loading && filteredOrders.length === 0 && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white py-12 text-center shadow-sm">
          <FaBoxOpen className="mx-auto mb-4 h-14 w-14 text-gray-300" />
          <p className="font-bold text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
}
