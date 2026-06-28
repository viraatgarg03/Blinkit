import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaPlus,
  FaShoppingBag,
  FaShoppingCart,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
} from 'react-icons/fa';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { path: '/admin/products', label: 'Products', icon: FaBoxOpen },
  { path: '/admin/add-product', label: 'Add Product', icon: FaPlus },
  { path: '/admin/orders', label: 'Orders', icon: FaShoppingCart },
  { path: '/admin/users', label: 'Users', icon: FaUsers },
];


export default function AdminLayout({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('blinkit_customer');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 lg:flex">
      <aside className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-white">
            <FaShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black">Blinkit</h1>
            <p className="text-xs font-semibold text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:block lg:space-y-2 lg:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? 'bg-yellow-400 text-gray-950'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-gray-100 p-4 lg:block">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            <FaSignOutAlt className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
