import { createBrowserRouter } from "react-router";
import { LoginPage } from "../pages/LoginPage";
import { AdminLayout } from "../pages/AdminLayout";
import { UserLayout } from "../pages/UserLayout";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AdminProducts } from "../pages/AdminProducts";
import { AdminAddProduct } from "../pages/AdminAddProduct";
import { AdminOrders } from "../pages/AdminOrders";
import { UserDashboard } from "../pages/UserDashboard";
import { UserProducts } from "../pages/UserProducts";
import { UserOrders } from "../pages/UserOrders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: AdminProducts },
      { path: "add-product", Component: AdminAddProduct },
      { path: "orders", Component: AdminOrders },
    ],
  },
  {
    path: "/user",
    Component: UserLayout,
    children: [
      { index: true, Component: UserDashboard },
      { path: "products", Component: UserProducts },
      { path: "orders", Component: UserOrders },
    ],
  },
]);
