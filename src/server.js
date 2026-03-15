import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* ---------- Middleware ---------- */

// дозволяє робити запити з інших доменів
app.use(cors());

// дозволяє працювати з JSON у body
app.use(express.json());

// логування HTTP запитів
app.use(pinoHttp());


/* ---------- Routes ---------- */

// отримати всі нотатки
app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

// отримати одну нотатку
app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// тестовий маршрут помилки
app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

/* ---------- 404 Middleware ---------- */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});



/* ---------- Error middleware ---------- */

app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message,
  });
});

/* ---------- Server ---------- */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
