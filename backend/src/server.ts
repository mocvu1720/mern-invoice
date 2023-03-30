import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(morganMiddleware);

app.get("/app/v1/test", (req, res) => {
  res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running ${chalk.yellow.bold(process.env.NODE_ENV)} mode on port ${chalk.yellow.bold(PORT)}`);
  systemLogs.info(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
