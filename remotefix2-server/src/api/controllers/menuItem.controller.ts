import { Request, Response } from "express";
import * as status from "http-status";
import { MenuItem } from "../models";
import { MenuItemInterface } from "../../utils/types/menuItem.types";
import { SortOrder, Types } from "mongoose";

export default class MenuItemController {
  async createMenuItem(req: Request, res: Response): Promise<Response> {
    const { label, link, isPrivate, icon, scope } = req.body;
    try {
      /**
       * Here is missing Super Admin Authorization
       */

      if (link !== "#") {
        const existingMenuItem = await MenuItem.findOne({
          link,
          deleted: false,
        });

        if (existingMenuItem) {
          return res.status(status.CONFLICT).json({
            success: false,
            message: status[status.CONFLICT].toUpperCase(),
            status: status.CONFLICT,
            errors: [
              {
                description: {
                  en: "A menu item with this link already exists!",
                  ar: "عنصر قائمة بهذا الرابط موجود بالفعل!",
                },
                fields: ["link"],
              },
            ],
          });
        }
      }

      let menuItemsCount: number = await MenuItem.find({
        deleted: false,
        scope,
      }).countDocuments();
      let menuItem: MenuItemInterface = new MenuItem({
        label: {
          en: label?.en,
          ar: label?.ar,
        },
        link:
          scope?.includes("navigation") && !scope?.includes("sub_item")
            ? "#"
            : link,
        isPrivate,
        icon,
        order: menuItemsCount + 1,
        archived: false,
        scope,
        subItems: scope?.includes("navigation") ? [] : undefined,
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
    const scope = req.query.scope
      ? Array.isArray(req.query.scope)
        ? req.query.scope
        : (req.query.scope as string).split(",")
      : [];
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
        scope,
      })
        .sort({ order: sortOrder })
        .populate({ path: "subItems", options: { sort: { order: 1 } } })
        .exec();

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
    const scope = req.query.scope
      ? Array.isArray(req.query.scope)
        ? req.query.scope
        : (req.query.scope as string).split(",")
      : [];
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
      })
        .populate({ path: "subItems", options: { sort: { order: 1 } } })
        .exec();

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

  async softDeleteOrRetrieveMenuItem(
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

      await MenuItem.findOneAndDelete({ _id: id, deleted: true });

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

  async addSubItem(req: Request, res: Response): Promise<Response> {
    const { itemId, subItemId } = req.params;
    try {
      /**
       * Here is missing Super Admin Authorization
       */

      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: itemId,
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

      let menuSubItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: subItemId,
        scope: { $all: ["sub_item"] },
        deleted: false,
      });

      if (!menuSubItem) {
        console.log(menuSubItem);
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No sub-menu item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة فرعي ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      let subItemCount: number = 0;
      if (menuItem.subItems) {
        subItemCount = menuItem.subItems.length;
      }

      const convertedSubMenuId = new Types.ObjectId(subItemId);
      menuItem.subItems?.push(convertedSubMenuId as any);

      menuSubItem = await MenuItem.findOneAndUpdate(
        {
          _id: subItemId,
          scope: { $all: ["sub_item"] },
          deleted: false,
        },
        { order: subItemCount + 1 },
        { new: true }
      );

      await menuItem.save();

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu sub-item added successfully!",
            ar: "تمت إضافة عنصر القائمة الفرعي بنجاح!",
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

  async removeSubItem(req: Request, res: Response): Promise<Response> {
    const { itemId, subItemId } = req.params;
    try {
      /**
       * Here is missing Super Admin Authorization
       */

      let menuItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: itemId,
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

      let menuSubItem: MenuItemInterface | null = await MenuItem.findOne({
        _id: subItemId,
        scope: { $all: ["sub_item"] },
        deleted: false,
      });

      if (!menuSubItem) {
        return res.status(status.NOT_FOUND).json({
          success: false,
          message: status[status.NOT_FOUND].toUpperCase(),
          status: status.NOT_FOUND,
          errors: [
            {
              description: {
                en: "No menu sub-item with requested data found!",
                ar: "لم يتم العثور على عنصر قائمة فرعية ضمن المعطيات المطلوبة!",
              },
              fields: ["_id"],
            },
          ],
        });
      }

      const convertedSubMenuId = new Types.ObjectId(subItemId);
      const subMenuIndex = menuItem?.subItems?.indexOf(
        convertedSubMenuId as any
      );
      menuItem?.subItems?.splice(subMenuIndex!, 1);

      await menuItem.save();

      return res.status(status.OK).json({
        success: true,
        message: status[status.OK].toUpperCase(),
        status: status.OK,
        data: {
          description: {
            en: "Menu sub-item removed successfully!",
            ar: "تم حذف عنصر القائمة الفرعي بنجاح!",
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
}
