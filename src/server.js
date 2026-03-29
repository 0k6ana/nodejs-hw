import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import notesRoutes from './routes/notesRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(notesRoutes);

// celebrate errors
app.use(errors());

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

//  500
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
