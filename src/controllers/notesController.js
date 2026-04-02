import createError from 'http-errors';
import { Note } from '../models/note.js';

// GET /notes
export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;

    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const skip = (pageNum - 1) * perPageNum;


    let query = Note.find({ userId: req.user._id });

    if (tag) query = query.where('tag').equals(tag);
    if (search) query = query.find({ $text: { $search: search } });

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(query.getFilter()),
      query.skip(skip).limit(perPageNum),
    ]);

    res.json({
      page: pageNum,
      perPage: perPageNum,
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPageNum),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      userId: req.user._id,
    });
    if (!note) throw createError(404, 'Not found');
    res.json(note);
  } catch (err) {
    next(err);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user._id },
      req.body,
      { returnDocument: 'after' }
    );
    if (!note) throw createError(404, 'Not found');
    res.json(note);
  } catch (err) {
    next(err);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });
    if (!note) throw createError(404, 'Not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
