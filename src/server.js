import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

const app = express();
const PORT = 3000;

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
  res.status(500).json({
    message: err.message,
  });
});

/* ---------- Server ---------- */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
