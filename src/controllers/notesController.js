import { Note } from '../models/note.js';

// GET /notes
export const getAllNotes = async (req, res, next) => {
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
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
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
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
