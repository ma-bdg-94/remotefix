import "dotenv/config";
import { connect, set } from "mongoose";
import { DEVELOPMENT, PRODUCTION, STAGE } from "./utils/constants/environments";

/* tslint:disable:no-console */
const connectDB = async (environment: string): Promise<void> => {
  try {
    switch (environment) {
      case PRODUCTION:
        await connect(process.env.MONGO_URI_PROD!);
        console.info("\t✅ Successfully connected to production database!");
        break;
      case STAGE:
        await connect(process.env.MONGO_URI_STAGE!);
        console.info("\t✅ Successfully connected to stage database!");
        break;
      case DEVELOPMENT:
        await connect(process.env.MONGO_URI_DEV!);
        console.info("\t✅ Successfully connected to development database!");
        break;
      default:
        await connect(process.env.MONGO_URI_DEV!);
        console.info("\t✅ Successfully connected to development database!");
    }
  } catch (er: any) {
    console.log(er.message);
    process.exit(1);
  }
};

set("strictQuery", true);

export default connectDB
