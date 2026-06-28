import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaExclamationTriangle, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { api } from '../services/api';

const formatMoney = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function DeleteDialog({ product, onCancel, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FaExclamationTriangle className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-black text-gray-950">Remove Product?</h2>
        <p className="mt-2 text-sm font-medium text-gray-500">
          <span className="font-bold text-gray-700">{product.name}</span> will be removed from the inventory.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 flex-1 rounded-lg bg-gray-100 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="h-11 flex-1 rounded-lg bg-red-500 text-sm font-bold text-white transition hover:bg-red-600 disabled:bg-red-200"
          >
            {deleting ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    api.getProducts()
      .then((items) => {
        if (!ignore) setProducts(items);
      })
      .catch((error) => toast.error(error.message || 'Products fetch nahi hue'))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.category || ''}`.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    setDeleting(true);

    try {
      await api.deleteProduct(pendingDelete.p_id || pendingDelete.id);
      setProducts((current) => current.filter((product) => product.id !== pendingDelete.id));
      toast.success('Product removed from inventory');
      setPendingDelete(null);
    } catch (error) {
      toast.error(error.message || 'Product delete nahi hua');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-5 sm:p-8">
      {pendingDelete && (
        <DeleteDialog
          product={pendingDelete}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-950">Products</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/add-product"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 text-sm font-black text-gray-950 transition hover:bg-yellow-500"
        >
          <FaPlus className="h-3.5 w-3.5" />
          Add Product
        </Link>
      </div>

      <div className="mb-6 max-w-md">
        <label className="relative block">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </label>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-sm font-bold text-gray-500 shadow-sm">Loading products...</div>
      ) : filteredProducts.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
                <FaBoxOpen className="hidden h-12 w-12 text-yellow-500" />
              </div>
              <div className="p-4">
                <div className="mb-4 min-h-16">
                  <h3 className="line-clamp-2 font-black text-gray-950">{product.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{product.category || 'Uncategorized'}</p>
                </div>

                <div className="mb-4 flex items-end justify-between gap-3">
                  <p className="text-lg font-black text-gray-950">{formatMoney(product.price)}</p>
                  <p className="text-sm font-bold text-gray-500">
                    Stock:{' '}
                    <span className={Number(product.stock || 0) < 50 ? 'text-red-600' : 'text-green-600'}>
                      {product.stock ?? 0}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPendingDelete(product)}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white py-12 text-center shadow-sm">
          <FaBoxOpen className="mx-auto mb-4 h-14 w-14 text-gray-300" />
          <p className="font-bold text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
