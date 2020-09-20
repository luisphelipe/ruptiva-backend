import models from "../models";
import {
  book_create_schema,
  book_update_schema,
} from "./validators/book.validator";

const Book = models.Book;

export const index = async (req, res, next) => {
  const owned_books = await Book.findAll({ where: { userId: req.user.id } });
  return res.json(owned_books);
};

export const create = async (req, res, next) => {
  const { error, value } = book_create_schema.validate(req.body);
  if (error)
    return res.status(406).json({ message: "Failed validation.", error });

  const book = await Book.create({ ...value, userId: req.user.id });

  return res.json({ message: "Book created successfully.", book });
};

export const get = async (req, res, next) => {
  const book = await Book.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!book) return res.status(404).json({ message: "Book not found." });

  return res.json(book);
};

export const update = async (req, res, next) => {
  const { error, value } = book_update_schema.validate(req.body);

  if (error)
    return res.status(406).json({ message: "Failed validation.", error });

  // This returns [NUMBER_OF_UPDATED_BOOKS, [UPDATED_BOOKS]]
  const books = await Book.update(value, {
    where: { id: req.params.id, userId: req.user.id },
    returning: true,
    raw: true,
  });

  if (!books[0]) return res.status(404).json({ message: "Book not found." });

  return res.json({ message: "Book updated successfully.", book: books[1][0] });
};

export const destroy = async (req, res, next) => {
  const book = await Book.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!book) return res.status(404).json({ message: "Book not found." });

  await book.destroy();

  return res.json({ message: "Book deleted successfully.", book });
};

export default { index, create, get, update, destroy };
