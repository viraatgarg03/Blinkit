import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingBag, User, Shield } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"admin" | "user">("user");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-yellow-400 p-3 rounded-xl">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Blinkit</h1>
        <p className="text-gray-600 text-center mb-8">Groceries in minutes</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("user")}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  userType === "user"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className={`w-8 h-8 mb-2 ${userType === "user" ? "text-yellow-600" : "text-gray-400"}`} />
                <span className={`text-sm font-medium ${userType === "user" ? "text-yellow-600" : "text-gray-600"}`}>
                  User
                </span>
              </button>

              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  userType === "admin"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Shield className={`w-8 h-8 mb-2 ${userType === "admin" ? "text-yellow-600" : "text-gray-400"}`} />
                <span className={`text-sm font-medium ${userType === "admin" ? "text-yellow-600" : "text-gray-600"}`}>
                  Admin
                </span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
          >
            Login as {userType === "admin" ? "Admin" : "User"}
          </button>
        </form>
      </div>
    </div>
  );
}
