import { Request, Response } from "express";
import * as status from "http-status";
import { MenuItem } from "../models";
import { MenuItemInterface } from "../../utils/types/menuItem.types";
import { SortOrder } from "mongoose";

export default class MenuItemController {
  async createMenuItem(req: Request, res: Response): Promise<Response> {
    const { label, link, isPrivate, icon, scope } = req.body;
    try {
      /**
       * Here is missing Super Admin Authorization
       */

      let menuItemsCount: number = await MenuItem.find({
        deleted: false,
      }).countDocuments();
      let menuItem: MenuItemInterface = new MenuItem({
        label: {
          en: label?.en,
          ar: label?.ar,
        },
        link,
        isPrivate,
        icon,
        order: menuItemsCount + 1,
        archived: false,
        scope,
      });

      await menuItem.save();

      return res.status(status.CREATED).json({
        success: true,
        message: status[status.CREATED].toUpperCase(),
        status: status.CREATED,
        data: {
          description: {
            en: "Menu item added successfully!",
            ar: "تمت إضافة عنصر القائمة بنجاح!",
          },
          menuItem,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async getAllMenuItems(req: Request, res: Response): Promise<Response> {
    const sortOrder: SortOrder | any = ![
      -1,
      1,
      "asc",
      "ascending",
      "desc",
      "descending",
    ].includes(req.query.sortOrder as SortOrder)
      ? 1
      : req.query.sortOrder;

    try {
      const menuItemList: MenuItemInterface[] | [] = await MenuItem.find({
        deleted: false,
      }).sort({ order: sortOrder });

      if (menuItemList?.length < 1) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu items found in the database!",
                ar: "لم يتم العثور على أي عنصر قائمة في قاعدة البيانات!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing Super Admin Authorization
       */

      // console.log("sortOrder:", sortOrder, req.query.sortOrder, typeof sortOrder, typeof req.query.sortOrder);
      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item list retrieved successfully!",
            ar: "تم إسترداد مجموعة عناصر القائمة بنجاح!",
          },
          menuItemList,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async getAllMenuItemsByScope(req: Request, res: Response): Promise<Response> {
    const { scope } = req.body;
    const sortOrder: SortOrder | any = ![
      -1,
      1,
      "asc",
      "ascending",
      "desc",
      "descending",
    ].includes(req.query.sortOrder as SortOrder)
      ? 1
      : req.query.sortOrder;

    try {
      const menuItemList: MenuItemInterface[] | [] = await MenuItem.find({
        deleted: false,
        scope: { $all: scope },
      }).sort({ order: sortOrder });

      if (menuItemList?.length < 1) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu items found with requested scope!",
                ar: "لم يتم العثور على أي عنصر قائمة ضمن النطاق المطلوب!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing Super Admin Authorization
       */

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item list retrieved successfully!",
            ar: "تم إسترداد مجموعة عناصر القائمة بنجاح!",
          },
          menuItemList,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async getPrivateMenuItemsByScope(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { scope } = req.body;
    try {
      const menuItemList: MenuItemInterface[] | [] = await MenuItem.find({
        deleted: false,
        isPrivate: true,
        scope: { $all: scope },
      });

      if (menuItemList?.length < 1) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu items found with requested scope!",
                ar: "لم يتم العثور على أي عنصر قائمة ضمن النطاق المطلوب!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item list retrieved successfully!",
            ar: "تم إسترداد مجموعة عناصر القائمة بنجاح!",
          },
          menuItemList,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async getMenuItemById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const menuItem: MenuItemInterface | null = await MenuItem.findOne({
        deleted: false,
        _id: id,
      });

      if (!menuItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item data retrieved successfully!",
            ar: "تم إسترداد معطيات عنصر القائمة بنجاح!",
          },
          menuItem,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async updateMenuItemPrivacy(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        deleted: false,
        _id: id,
      });

      if (!menuItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      menuItem = await MenuItem.findOneAndUpdate(
        {
          deleted: false,
          _id: id,
        },
        [{ $set: { isPrivate: { $not: "$isPrivate" } } }],
        { new: true }
      );

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item data updated successfully!",
            ar: "تم تعديل معطيات عنصر القائمة بنجاح!",
          },
          menuItem,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async updateMenuItemArchivedStatus(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { id } = req.params;
    try {
      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: id,
      });

      if (!menuItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      menuItem = await MenuItem.findOneAndUpdate(
        {
          deleted: false,
          _id: id,
        },
        [{ $set: { archived: { $not: "$archived" } } }],
        { new: true }
      );

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item data updated successfully!",
            ar: "تم تعديل معطيات عنصر القائمة بنجاح!",
          },
          menuItem,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async updateMenuItemScope(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { scope } = req.body;
    try {
      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        deleted: false,
        _id: id,
      });

      if (!menuItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      menuItem = await MenuItem.findByIdAndUpdate(
        {
          deleted: false,
          _id: id,
        },
        { scope },
        { new: true }
      );

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item data updated successfully!",
            ar: "تم تعديل معطيات عنصر القائمة بنجاح!",
          },
          menuItem,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async updateMenuItem(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { label, link, icon } = req.body;

    const updateableMenuItemData: any = {};
    if (label)
      updateableMenuItemData.label = {
        en: label.en,
        ar: label.ar,
      };
    if (link) updateableMenuItemData.link = link;
    if (icon) updateableMenuItemData.icon = icon;

    try {
      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: id,
        deleted: false,
      });

      if (!menuItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      menuItem = await MenuItem.findOneAndUpdate(
        {
          deleted: false,
          _id: id,
        },
        { $set: updateableMenuItemData },
        { new: true }
      );

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item data updated successfully!",
            ar: "تم تعديل معطيات عنصر القائمة بنجاح!",
          },
          menuItem,
        },
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async softDeleteOrRetrieveMenuItem(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: id,
      });

      if (!menuItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      menuItem = await MenuItem.findOneAndUpdate(
        {
          _id: id,
        },
        [{ $set: { deleted: { $not: "$deleted" } } }],
        { new: true }
      );

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item data soft-deleted successfully!",
            ar: "تم محو عنصر القائمة بطريقة لينة بنجاح!",
          },
          menuItem,
        },
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }

  async removeMenuItem(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: id,
        deleted: true,
      });

      if (!menuItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      /**
       * Here is missing User Authorization
       */

      await MenuItem.findOneAndDelete(
        { _id: id, deleted: true }
      );

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu item removed successfully!",
            ar: "تم محو عنصر القائمة بنجاح!",
          },
        },
      });
    } catch (error) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: status[status.INTERNAL_SERVER_ERROR].toUpperCase(),
        status: status.INTERNAL_SERVER_ERROR,
        errors: [{ description: error, fields: ["server"] }],
      });
    }
  }
}
