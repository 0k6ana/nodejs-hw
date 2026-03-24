import "dotenv/config";
import express from "express";
import cors from "cors";

import pinoHttp from "pino-http";

import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRoutes from "./routes/notesRoutes.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */

const logger = pinoHttp();

app.use(logger);
app.use(cors());
app.use(express.json());

/* ---------- Routes ---------- */

app.use("/notes", notesRoutes);

/* ---------- 404 ---------- */

app.use(notFoundHandler);

/* ---------- Error handler ---------- */

app.use(errorHandler);

/* ---------- Start server ---------- */

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

