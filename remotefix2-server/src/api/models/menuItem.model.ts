import { Schema, model } from "mongoose";
import * as mongooseDelete from "mongoose-delete";
import { MenuItemInterface } from "../../utils/types/menuItem.types";
import {
  HORIZONTAL,
  MENU_ITEMS_POSITIONS,
} from "../../utils/constants/menuItems";

const MenuItemSchema = new Schema<MenuItemInterface>(
  {
    label: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    link: {
      type: String,
      required: true,
    },
    private: {
      type: Boolean,
      required: true,
    },
    position: {
      type: String,
      enum: MENU_ITEMS_POSITIONS,
      default: HORIZONTAL,
    },
    iconed: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: false,
    },
    scope: [
      {
        type: String,
        required: false,
      },
    ],
    hash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MenuItemSchema.plugin(mongooseDelete);

const MenuItem = model<MenuItemInterface>("MenuItem", MenuItemSchema);
export default MenuItem;
