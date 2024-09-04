import { Schema, model } from "mongoose";
import * as mongooseDelete from "mongoose-delete";
import { MenuItemInterface } from "../../utils/types/menuItem.types";

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
    icon: {
      type: String,
      required: false,
    },
    scope: [
      {
        type: String,
        required: false,
      },
    ]
  },
  {
    timestamps: true,
  }
);

MenuItemSchema.plugin(mongooseDelete);

const MenuItem = model<MenuItemInterface>("MenuItem", MenuItemSchema);
export default MenuItem;
