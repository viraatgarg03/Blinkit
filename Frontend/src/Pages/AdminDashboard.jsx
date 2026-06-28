import { useEffect, useMemo, useState } from 'react';
import { FaBoxOpen, FaChartLine, FaRupeeSign, FaShoppingCart, FaUsers } from 'react-icons/fa';
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

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    Promise.allSettled([api.getProducts(), api.getOrders(), api.getCustomers()])
      .then(([productsResult, ordersResult, customersResult]) => {
        if (ignore) return;
        setProducts(productsResult.status === 'fulfilled' ? productsResult.value : []);
        setOrders(ordersResult.status === 'fulfilled' ? ordersResult.value : []);
        setCustomers(customersResult.status === 'fulfilled' ? customersResult.value : []);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((total, order) => total + getOrderTotal(order), 0);
    return [
      { title: 'Total Revenue', value: formatMoney(revenue), change: '+12.5%', icon: FaRupeeSign, color: 'bg-green-500' },
      { title: 'Total Orders', value: orders.length, change: '+8.2%', icon: FaShoppingCart, color: 'bg-blue-500' },
      { title: 'Total Products', value: products.length, change: '+5.1%', icon: FaBoxOpen, color: 'bg-violet-500' },
      { title: 'Active Users', value: customers.length, change: '+15.3%', icon: FaUsers, color: 'bg-yellow-500' },
    ];
  }, [customers.length, orders, products.length]);

  const topProducts = useMemo(() => {
    const productMap = new Map();

    orders.forEach((order) => {
      const product = order.Product;
      if (!product) return;
      const id = product.p_id ?? product.id ?? order.productId;
      const previous = productMap.get(id) || { name: product.name, sold: 0, revenue: 0 };
      previous.sold += Number(order.quantity || 0);
      previous.revenue += getOrderTotal(order);
      productMap.set(id, previous);
    });

    const ordered = Array.from(productMap.values()).sort((a, b) => b.sold - a.sold);
    return ordered.length ? ordered.slice(0, 5) : products.slice(0, 5).map((product) => ({
      name: product.name,
      sold: 0,
      revenue: 0,
    }));
  }, [orders, products]);

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-950">Dashboard</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">Welcome back! Here is your store overview</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-lg text-white ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-green-600">
                <FaChartLine className="h-3.5 w-3.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
            <p className="mt-1 text-2xl font-black text-gray-950">{loading ? '...' : stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-950">Recent Orders</h2>
          </div>
          <div className="space-y-4 p-6">
            {recentOrders.length ? recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-950">{order.Customer?.name || `Customer #${order.customerId}`}</p>
                  <p className="text-sm font-medium text-gray-500">ORD{String(order.id).padStart(3, '0')} - {order.quantity || 1} items</p>
                </div>
                <p className="font-black text-gray-950">{formatMoney(getOrderTotal(order))}</p>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                  {getOrderStatus(order)}
                </span>
              </div>
            )) : (
              <p className="rounded-lg bg-gray-50 p-4 text-sm font-semibold text-gray-500">No orders yet</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-950">Top Selling Products</h2>
          </div>
          <div className="space-y-4 p-6">
            {topProducts.map((product, index) => (
              <div key={`${product.name}-${index}`} className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-black text-yellow-700">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-950">{product.name}</p>
                  <p className="text-sm font-medium text-gray-500">{product.sold} sold</p>
                </div>
                <p className="font-black text-gray-950">{formatMoney(product.revenue)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
