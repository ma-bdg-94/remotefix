import { Schema, model } from "mongoose";
import * as mongooseDelete from "mongoose-delete";
import { AccountInterface } from "../../utils/types/account.types";

const AccountSchema = new Schema<AccountInterface>(
  {
    naming: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    monthlyFee: {
      type: Number,
      required: true,
    },
    nbWorkOrders: [
      {
        type: Number,
        required: true,
      },
    ],
    nbEmployees: [
      {
        type: Number,
        required: true,
      },
    ],
    currency: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Currency",
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

AccountSchema.plugin(mongooseDelete);

const Account = model<AccountInterface>("Account", AccountSchema);
export default Account;
