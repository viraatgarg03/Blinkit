import { useState } from "react";
import { Search, Eye, Package } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  address: string;
}

export function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [orders] = useState<Order[]>([
    {
      id: "ORD001",
      customer: "Rahul Sharma",
      date: "2026-06-23",
      items: 5,
      total: 850,
      status: "Delivered",
      address: "123 MG Road, Bangalore",
    },
    {
      id: "ORD002",
      customer: "Priya Patel",
      date: "2026-06-23",
      items: 3,
      total: 450,
      status: "Processing",
      address: "456 Park Street, Mumbai",
    },
    {
      id: "ORD003",
      customer: "Amit Kumar",
      date: "2026-06-22",
      items: 8,
      total: 1200,
      status: "Pending",
      address: "789 Lake View, Delhi",
    },
    {
      id: "ORD004",
      customer: "Sneha Reddy",
      date: "2026-06-22",
      items: 4,
      total: 680,
      status: "Delivered",
      address: "321 Ring Road, Hyderabad",
    },
    {
      id: "ORD005",
      customer: "Vikram Singh",
      date: "2026-06-21",
      items: 6,
      total: 920,
      status: "Processing",
      address: "654 Main Street, Pune",
    },
    {
      id: "ORD006",
      customer: "Ananya Iyer",
      date: "2026-06-21",
      items: 2,
      total: 280,
      status: "Cancelled",
      address: "987 Beach Road, Chennai",
    },
    {
      id: "ORD007",
      customer: "Rohan Malhotra",
      date: "2026-06-20",
      items: 7,
      total: 1050,
      status: "Delivered",
      address: "147 Valley Road, Jaipur",
    },
    {
      id: "ORD008",
      customer: "Kavita Nair",
      date: "2026-06-20",
      items: 5,
      total: 750,
      status: "Pending",
      address: "258 Hill Station, Kochi",
    },
  ]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
}
