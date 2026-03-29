import express from 'express';
import { celebrate } from 'celebrate';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

import { Note } from '../models/note.js';

const router = express.Router();

// GET /notes
router.get(
  '/notes',
  celebrate(getAllNotesSchema),
  async (req, res, next) => {
    try {
      const { tag, search, page, perPage } = req.query;

      const skip = (page - 1) * perPage;

      const filter = {};

      if (tag) filter.tag = tag;
      if (search) filter.$text = { $search: search };

      const totalNotes = await Note.countDocuments(filter);

      const notes = await Note.find(filter)
        .skip(skip)
        .limit(perPage);

      res.json({
        page,
        perPage,
        totalNotes,
        totalPages: Math.ceil(totalNotes / perPage),
        notes,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /notes/:noteId
router.get(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  async (req, res, next) => {
    try {
      const note = await Note.findById(req.params.noteId);

      if (!note) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.json(note);
    } catch (err) {
      next(err);
    }
  }
);

// POST /notes
router.post(
  '/notes',
  celebrate(createNoteSchema),
  async (req, res, next) => {
    try {
      const note = await Note.create(req.body);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /notes/:noteId
router.patch(
  '/notes/:noteId',
  celebrate(updateNoteSchema),
  async (req, res, next) => {
    try {
      const note = await Note.findByIdAndUpdate(
        req.params.noteId,
        req.body,
        { new: true }
      );

      if (!note) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.json(note);
    } catch (err) {
      next(err);
    }
  }
);

//DELETE /notes/:noteId
router.delete(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  async (req, res, next) => {
    try {
      const note = await Note.findByIdAndDelete(req.params.noteId);

      if (!note) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
