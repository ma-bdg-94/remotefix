import { Document, Date, Schema, Types } from "mongoose";
import { MultiLanguageText } from "./common";

export interface MenuItemInterface extends Document {
  label: MultiLanguageText;
  link: string;
  isPrivate: boolean;
  icon?: string;
  scope: string[];
  deleted: boolean;
  archived: boolean;
  order: number;
  subItems?: Schema.Types.ObjectId[] | Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
