import { useRoutes } from "react-router-dom";
import { createElement, lazy } from "react";

const Home = lazy(() => import("../features/home/Home"));

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: createElement(Home) },
  ]);
  return routes;
};

export default AppRoutes;
