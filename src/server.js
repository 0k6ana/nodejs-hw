import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import notesRoutes from './routes/notesRoutes.js';

import { httpLogger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();

await connectMongoDB();

// middleware
app.use(httpLogger);
app.use(cors());
app.use(express.json());

// routes
app.use(notesRoutes);

// celebrate errors
app.use(errors());

app.use(notFoundHandler);
app.use(errorHandler);

//  порт 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
