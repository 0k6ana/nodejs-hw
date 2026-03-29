import express from 'express';
import { celebrate } from 'celebrate';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = express.Router();

// GET /notes
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

// GET /notes/:noteId
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

// POST /notes
router.post('/notes', celebrate(createNoteSchema), createNote);

// PATCH /notes/:noteId
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

// DELETE /notes/:noteId
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

export default router;
