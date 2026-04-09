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

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  console.error("💥 Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
