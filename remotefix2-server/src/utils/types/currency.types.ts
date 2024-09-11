import { Document, Date } from "mongoose";
import { MultiLanguageText } from "./common";

export interface CurrencyInterface extends Document {
  iso4217Code: string;
  name: MultiLanguageText;
  symbol?: string;
  deleted: boolean;
  archived: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
