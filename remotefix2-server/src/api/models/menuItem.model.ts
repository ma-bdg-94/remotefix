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
    isPrivate: {
      type: Boolean,
      required: true,
      default: false
    },
    icon: {
      type: String,
      required: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number
    },
    scope: [
      {
        type: String,
        required: false,
      },
    ],
    subItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem'
      }
    ]
  },
  {
    timestamps: true,
  }
);

MenuItemSchema.plugin(mongooseDelete);

const MenuItem = model<MenuItemInterface>("MenuItem", MenuItemSchema);
export default MenuItem;
