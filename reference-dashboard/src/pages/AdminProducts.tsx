import { useState } from "react";
import { Search, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Fresh Milk (1L)", category: "Dairy", price: 50, stock: 120, image: "🥛" },
  { id: "2", name: "Organic Eggs (6pcs)", category: "Dairy", price: 60, stock: 85, image: "🥚" },
  { id: "3", name: "Whole Wheat Bread", category: "Bakery", price: 45, stock: 60, image: "🍞" },
  { id: "4", name: "Fresh Tomatoes (1kg)", category: "Vegetables", price: 40, stock: 200, image: "🍅" },
  { id: "5", name: "Basmati Rice (5kg)", category: "Grains", price: 240, stock: 45, image: "🌾" },
  { id: "6", name: "Fresh Apples (1kg)", category: "Fruits", price: 150, stock: 75, image: "🍎" },
  { id: "7", name: "Bananas (6pcs)", category: "Fruits", price: 30, stock: 150, image: "🍌" },
  { id: "8", name: "Potato (1kg)", category: "Vegetables", price: 25, stock: 180, image: "🥔" },
  { id: "9", name: "Onion (1kg)", category: "Vegetables", price: 35, stock: 160, image: "🧅" },
  { id: "10", name: "Paneer (200g)", category: "Dairy", price: 80, stock: 50, image: "🧈" },
  { id: "11", name: "Chicken Breast (500g)", category: "Meat", price: 180, stock: 40, image: "🍗" },
  { id: "12", name: "Orange Juice (1L)", category: "Beverages", price: 120, stock: 55, image: "🧃" },
];

interface DeleteDialogProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ product, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Remove Product?</h2>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium text-gray-700">{product.name}</span> will be permanently
              removed from the inventory. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full pt-1">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
    toast.success(`"${pendingDelete.name}" removed from inventory`);
    setPendingDelete(null);
  };

  return (
    <div className="p-8">
      {pendingDelete && (
        <DeleteDialog
          product={pendingDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500 mt-1">Manage your product inventory</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 h-40 flex items-center justify-center text-6xl">
              {product.image}
            </div>
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                  <p className="text-sm text-gray-500">
                    Stock:{" "}
                    <span
                      className={
                        product.stock < 50 ? "text-red-600 font-medium" : "text-green-600 font-medium"
                      }
                    >
                      {product.stock}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => setPendingDelete(product)}
                  className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Remove product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
