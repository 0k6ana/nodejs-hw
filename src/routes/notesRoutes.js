import express from "express";
import { celebrate } from "celebrate";

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

// GET
router.get("/notes", celebrate(getAllNotesSchema), getAllNotes);

// GET BY ID
router.get("/notes/:noteId", celebrate(noteIdSchema), getNoteById);

// CREATE
router.post("/notes", celebrate(createNoteSchema), createNote);

// UPDATE
router.patch("/notes/:noteId", celebrate(updateNoteSchema), updateNote);

// DELETE
router.delete("/notes/:noteId", celebrate(noteIdSchema), deleteNote);

export default router;
