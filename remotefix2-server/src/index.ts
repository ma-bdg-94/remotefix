import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import connectDB from "./database";
import { DEVELOPMENT, PRODUCTION, STAGE } from "./utils/constants/environments.ts";

dotenv.config({ path: "./.env" });
const app: express.Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/test", (_req: express.Request, res: express.Response) => {
  res.status(200).send("This a test!");
});

const environment: string | undefined = process.env.NODE_ENV;

const port: number =
  environment === DEVELOPMENT
    ? parseInt(process.env.APP_PORT_DEV!)
    : environment === STAGE
    ? parseInt(process.env.APP_PORT_STAGE!)
    : environment === PRODUCTION
    ? parseInt(process.env.APP_PORT_PROD!)
    : 5000;
app.listen(5000, (): void => {
  console.log(
    `\t✅ Application is successfully running on ${environment?.toUpperCase()} environment at port: ${port}!`
  );
  connectDB(process.env.NODE_ENV!);
});
