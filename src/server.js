import "dotenv/config";
import express from "express";
import cors from "cors";
import { errors } from "celebrate";

import notesRoutes from "./routes/notesRoutes.js";

import { httpLogger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { connectMongoDB } from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

const app = express();

await connectMongoDB();

// middleware
app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use(notesRoutes);

// celebrate errors
app.use(errors());

// 404
app.use(notFoundHandler);

// error
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
