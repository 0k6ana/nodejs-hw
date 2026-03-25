// src/controllers/notesController.js
import Note from '../models/note.js';
import createHttpError from 'http-errors';

// GET /notes
export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const noteData = req.body;
    const newNote = await Note.create(noteData);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updateData = req.body;

    const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, { returnDocument: 'after' });
    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }
    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};
