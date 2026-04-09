import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";

import { connectMongoDB } from "./db/connectMongoDB.js";

import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { httpLogger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Підключення до БД
await connectMongoDB();

// Middleware
app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Роути
app.use("/auth", authRoutes);
app.use(notesRoutes);
app.use("/users", userRoutes);

app.use(errors());

// 404
app.use(notFoundHandler);

//  глобальна помилка
app.use(errorHandler);

//  запуск сервера
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
