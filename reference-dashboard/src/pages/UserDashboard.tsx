import { useState } from "react";
import { Search, TrendingUp, Clock, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  discount?: number;
}

export function UserDashboard() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const categories = [
    { name: "Dairy", icon: "🥛" },
    { name: "Vegetables", icon: "🥕" },
    { name: "Fruits", icon: "🍎" },
    { name: "Bakery", icon: "🍞" },
    { name: "Beverages", icon: "🥤" },
    { name: "Snacks", icon: "🍿" },
  ];

  const trendingProducts: Product[] = [
    { id: "1", name: "Fresh Milk", category: "Dairy", price: 50, image: "🥛", discount: 10 },
    { id: "2", name: "Organic Eggs", category: "Dairy", price: 60, image: "🥚" },
    { id: "3", name: "Wheat Bread", category: "Bakery", price: 45, image: "🍞", discount: 15 },
    { id: "4", name: "Fresh Tomatoes", category: "Vegetables", price: 40, image: "🍅" },
    { id: "5", name: "Basmati Rice", category: "Grains", price: 240, image: "🌾" },
    { id: "6", name: "Fresh Apples", category: "Fruits", price: 150, image: "🍎", discount: 20 },
  ];

  const quickNeedsProducts: Product[] = [
    { id: "7", name: "Bananas", category: "Fruits", price: 30, image: "🍌" },
    { id: "8", name: "Potato", category: "Vegetables", price: 25, image: "🥔" },
    { id: "9", name: "Onion", category: "Vegetables", price: 35, image: "🧅" },
    { id: "10", name: "Paneer", category: "Dairy", price: 80, image: "🧈" },
  ];

  const addToCart = (productId: string, productName: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    toast.success(`${productName} added to cart!`);
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 mb-8 text-gray-900">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          India's last minute app
        </h1>
        <p className="text-lg mb-6">Groceries delivered in minutes</p>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-lg"
          />
        </div>
      </div>

      {/* Cart Summary */}
      {getCartCount() > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">
              {getCartCount()} item{getCartCount() > 1 ? "s" : ""} in cart
            </p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            View Cart
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <p className="text-sm font-medium text-gray-900">{category.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 h-32 flex items-center justify-center text-5xl">
                {product.image}
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 mb-1 truncate">{product.name}</p>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">₹{product.price}</p>
                    {product.discount && (
                      <p className="text-xs text-gray-400 line-through">
                        ₹{Math.round(product.price / (1 - product.discount / 100))}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product.id, product.name)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Needs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Quick Needs</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickNeedsProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 h-32 flex items-center justify-center text-5xl">
                {product.image}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 mb-1">{product.name}</p>
                <p className="font-bold text-gray-900 mb-2">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product.id, product.name)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
