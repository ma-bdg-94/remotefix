import { Router } from "express";
const router = Router();

import { menuItemController } from "../controllers";
import { validateMenuItemCreation, validateMenuItemId, validateMenuItemScope, validateMenuItemUpdate, validateSortingCriteria } from "../middlewares/validations/menuItem.validation";
const {
  createMenuItem,
  getAllMenuItems,
  getAllMenuItemsByScope,
  getPrivateMenuItemsByScope,
  getMenuItemById,
  updateMenuItem,
  updateMenuItemArchivedStatus,
  updateMenuItemScope,
  updateMenuItemPrivacy,
  softDeleteOrRetrieveMenuItem,
  removeMenuItem,
} = menuItemController;

router.post("/", validateMenuItemCreation, createMenuItem);

router.get("/all", validateSortingCriteria, getAllMenuItems);
router.get("/all/public/scope", [validateSortingCriteria, validateMenuItemScope], getAllMenuItemsByScope);
router.get("/all/private/scope", getPrivateMenuItemsByScope);
router.get("/single/:id", validateMenuItemId, getMenuItemById);

router.put("/:id", [validateMenuItemId, validateMenuItemUpdate], updateMenuItem);

router.patch("/archive/:id", validateMenuItemId, updateMenuItemArchivedStatus);
router.patch("/scope/:id", [validateMenuItemId, validateMenuItemScope], updateMenuItemScope);
router.patch("/privacy/:id", validateMenuItemId, updateMenuItemPrivacy);
router.patch("/soft/:id", validateMenuItemId, softDeleteOrRetrieveMenuItem);

router.delete("/:id", validateMenuItemId, removeMenuItem);

export default router;
