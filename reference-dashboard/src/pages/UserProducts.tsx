import { useState } from "react";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  discount?: number;
}

export function UserProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const categories = ["All", "Dairy", "Vegetables", "Fruits", "Bakery", "Grains", "Meat", "Beverages", "Snacks"];

  const products: Product[] = [
    { id: "1", name: "Fresh Milk (1L)", category: "Dairy", price: 50, stock: 120, image: "🥛", discount: 10 },
    { id: "2", name: "Organic Eggs (6pcs)", category: "Dairy", price: 60, stock: 85, image: "🥚" },
    { id: "3", name: "Whole Wheat Bread", category: "Bakery", price: 45, stock: 60, image: "🍞", discount: 15 },
    { id: "4", name: "Fresh Tomatoes (1kg)", category: "Vegetables", price: 40, stock: 200, image: "🍅" },
    { id: "5", name: "Basmati Rice (5kg)", category: "Grains", price: 240, stock: 45, image: "🌾" },
    { id: "6", name: "Fresh Apples (1kg)", category: "Fruits", price: 150, stock: 75, image: "🍎", discount: 20 },
    { id: "7", name: "Bananas (6pcs)", category: "Fruits", price: 30, stock: 150, image: "🍌" },
    { id: "8", name: "Potato (1kg)", category: "Vegetables", price: 25, stock: 180, image: "🥔" },
    { id: "9", name: "Onion (1kg)", category: "Vegetables", price: 35, stock: 160, image: "🧅" },
    { id: "10", name: "Paneer (200g)", category: "Dairy", price: 80, stock: 50, image: "🧈" },
    { id: "11", name: "Chicken Breast (500g)", category: "Meat", price: 180, stock: 40, image: "🍗" },
    { id: "12", name: "Orange Juice (1L)", category: "Beverages", price: 120, stock: 55, image: "🧃", discount: 5 },
    { id: "13", name: "Carrot (1kg)", category: "Vegetables", price: 35, stock: 90, image: "🥕" },
    { id: "14", name: "Grapes (500g)", category: "Fruits", price: 80, stock: 60, image: "🍇" },
    { id: "15", name: "Butter (100g)", category: "Dairy", price: 55, stock: 70, image: "🧈" },
    { id: "16", name: "Chips Pack", category: "Snacks", price: 20, stock: 200, image: "🍟" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string, productName: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    toast.success(`${productName} added to cart!`);
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 mt-1">Browse our fresh collection</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 h-40 flex items-center justify-center text-6xl">
              {product.image}
              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</p>
              <p className="text-xs text-gray-500 mb-2">{product.category}</p>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">₹{product.price}</p>
                  {product.discount && (
                    <p className="text-xs text-gray-400 line-through">
                      ₹{Math.round(product.price / (1 - product.discount / 100))}
                    </p>
                  )}
                </div>
                {product.stock < 50 && (
                  <span className="text-xs text-red-600 font-medium">Low Stock</span>
                )}
              </div>

              <button
                onClick={() => addToCart(product.id, product.name)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 rounded-lg transition-colors text-sm"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
