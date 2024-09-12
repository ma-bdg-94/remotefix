import { Document, Date, Schema } from "mongoose";
import { MultiLanguageText } from "./common";

export interface AccountInterface extends Document {
  naming: MultiLanguageText;
  monthlyFee: number;
  currency: Schema.Types.ObjectId;
  nbWorkOrders: number[];
  nbEmployees: number[];
  deleted: boolean;
  archived: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
