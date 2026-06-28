import { useState } from "react";
import { Package, MapPin, Calendar, IndianRupee } from "lucide-react";

interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Delivered" | "Processing" | "Pending" | "Cancelled";
  deliveryAddress: string;
  estimatedDelivery?: string;
}

export function UserOrders() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD001",
      date: "2026-06-23",
      items: [
        { name: "Fresh Milk (1L)", quantity: 2, price: 50 },
        { name: "Organic Eggs (6pcs)", quantity: 1, price: 60 },
        { name: "Whole Wheat Bread", quantity: 1, price: 45 },
      ],
      total: 205,
      status: "Delivered",
      deliveryAddress: "123 MG Road, Bangalore - 560001",
    },
    {
      id: "ORD002",
      date: "2026-06-22",
      items: [
        { name: "Fresh Tomatoes (1kg)", quantity: 2, price: 40 },
        { name: "Potato (1kg)", quantity: 3, price: 25 },
        { name: "Onion (1kg)", quantity: 2, price: 35 },
      ],
      total: 225,
      status: "Processing",
      deliveryAddress: "123 MG Road, Bangalore - 560001",
      estimatedDelivery: "Today, 6:00 PM",
    },
    {
      id: "ORD003",
      date: "2026-06-20",
      items: [
        { name: "Basmati Rice (5kg)", quantity: 1, price: 240 },
        { name: "Fresh Apples (1kg)", quantity: 2, price: 150 },
      ],
      total: 540,
      status: "Delivered",
      deliveryAddress: "123 MG Road, Bangalore - 560001",
    },
    {
      id: "ORD004",
      date: "2026-06-18",
      items: [
        { name: "Paneer (200g)", quantity: 2, price: 80 },
        { name: "Orange Juice (1L)", quantity: 1, price: 120 },
      ],
      total: 280,
      status: "Delivered",
      deliveryAddress: "123 MG Road, Bangalore - 560001",
    },
  ]);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No orders yet</p>
          <p className="text-gray-400 text-sm">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900 flex items-center gap-0.5">
                      <IndianRupee className="w-4 h-4" />
                      {order.total}
                    </p>
                  </div>
                </div>

                {order.estimatedDelivery && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Estimated Delivery:</span> {order.estimatedDelivery}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex gap-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  View Details
                </button>
                {order.status === "Delivered" && (
                  <button className="px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors">
                    Reorder
                  </button>
                )}
                {order.status === "Processing" && (
                  <button className="px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                    Track Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
