import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";
import producersRouter from "./routes/producers.ts"
import authRouter from "./routes/auth.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { pool } from "./config/database.ts";

dotenv.config();

const PgSession = connectPgSimple(session);

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: "session",
    }),
    secret: process.env.SESSION_SECRET || "pepene-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
}));

app.use("/api/auth", authRouter);
app.use("/api/producers", producersRouter);
app.use(errorHandler);

export default app;