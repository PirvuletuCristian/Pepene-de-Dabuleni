import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import producersRouter from "./routes/producers.ts"
import { errorHandler } from "./middleware/errorHandler.ts";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/producers", producersRouter);
app.use(errorHandler);

export default app;