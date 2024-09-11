import { Schema, model } from "mongoose";
import * as mongooseDelete from "mongoose-delete";
import { CurrencyInterface } from "../../utils/types/currency.types";

const CurrencySchema = new Schema<CurrencyInterface>(
  {
    name: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    iso4217Code: {
      type: String,
      required: true,
    },
    numCode: {
      type: Number,
      required: true,
    },
    symbol: {
      type: String,
      required: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

CurrencySchema.plugin(mongooseDelete);

const Currency = model<CurrencyInterface>("Currency", CurrencySchema);
export default Currency;
