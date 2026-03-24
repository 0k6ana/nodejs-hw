import express from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notesController.js';

const router = express.Router();

// GET /notes - всі нотатки
router.get('/', getAllNotes);

// GET /notes/:noteId - нотатка по ID
router.get('/:noteId', getNoteById);

// POST /notes - створити нотатку
router.post('/', createNote);

// PATCH /notes/:noteId - оновити нотатку
router.patch('/:noteId', updateNote);

// DELETE /notes/:noteId - видалити нотатку
router.delete('/:noteId', deleteNote);

export default router;
