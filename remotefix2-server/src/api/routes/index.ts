import { Router } from "express";
const router = Router();

import menuItemRoutes from "./menuItem.route";

router.use("/api/menuItems", menuItemRoutes);

export default router;
