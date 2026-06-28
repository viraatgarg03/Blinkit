import { Package, ShoppingCart, Users, TrendingUp, IndianRupee } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,24,580",
      change: "+12.5%",
      icon: IndianRupee,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "2,456",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: "342",
      change: "+5.1%",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Active Users",
      value: "1,893",
      change: "+15.3%",
      icon: Users,
      color: "bg-yellow-500",
    },
  ];

  const recentOrders = [
    { id: "ORD001", customer: "Rahul Sharma", items: 5, total: 850, status: "Delivered" },
    { id: "ORD002", customer: "Priya Patel", items: 3, total: 450, status: "Processing" },
    { id: "ORD003", customer: "Amit Kumar", items: 8, total: 1200, status: "Pending" },
    { id: "ORD004", customer: "Sneha Reddy", items: 4, total: 680, status: "Delivered" },
    { id: "ORD005", customer: "Vikram Singh", items: 6, total: 920, status: "Processing" },
  ];

  const topProducts = [
    { name: "Fresh Milk (1L)", sold: 245, revenue: 12250 },
    { name: "Organic Eggs (6pcs)", sold: 189, revenue: 11340 },
    { name: "Whole Wheat Bread", sold: 156, revenue: 7020 },
    { name: "Fresh Tomatoes (1kg)", sold: 134, revenue: 5360 },
    { name: "Basmati Rice (5kg)", sold: 98, revenue: 23520 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">
                      {order.id} • {order.items} items
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold text-gray-900">₹{order.total}</p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sold} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
