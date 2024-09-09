import { useRoutes } from "react-router-dom";
import { createElement, lazy } from "react";

const Home = lazy(() => import("../features/public/home/Home"));
const SuperAdminDashboard = lazy(() => import("../features/super_admin/dashboard/SuperAdminDashboard"))

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: createElement(Home) },
    { path: "/super_admin/dashboard", element: createElement(SuperAdminDashboard) },
  ]);
  return routes;
};

export default AppRoutes;
