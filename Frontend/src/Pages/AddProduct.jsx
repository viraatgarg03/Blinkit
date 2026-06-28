import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaImage, FaPlus } from 'react-icons/fa';
import { api } from '../services/api';

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  image: '',
};

const categories = [
  'Dairy',
  'Bakery',
  'Vegetables',
  'Fruits',
  'Grains',
  'Meat',
  'Beverages',
  'Snacks',
  'Frozen Foods',
  'Personal Care',
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      await api.createProduct(productData);
      toast.success('Product added successfully');
      setFormData(initialForm);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Backend se connect nahi ho pa raha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-950">Add New Product</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">Add a new product to your inventory</p>
      </div>

      <div className="max-w-3xl">
        <form className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">Product Image URL</span>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-5 transition focus-within:border-yellow-400 hover:border-yellow-400">
                <div className="mb-4 text-center">
                  <FaImage className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-600">Paste a product image link</p>
                </div>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">Product Name *</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Fresh Milk (1L)"
                required
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">Category *</span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-gray-700">Price (Rs.) *</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  step="0.01"
                  required
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-gray-700">Stock Quantity *</span>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  required
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">Description *</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter product description..."
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />
            </label>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-6 text-sm font-black text-gray-950 transition hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-500"
              >
                <FaPlus className="h-3.5 w-3.5" />
                {loading ? 'Adding...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="h-12 rounded-lg bg-gray-100 px-6 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
