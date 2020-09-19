import models from "../models";

const Book = models.Book;

export const index = async (req, res, next) => {
  const owned_books = await Book.findAll({ where: { userId: req.user.id } });
  return res.json(owned_books);
};

export const create = async (req, res, next) => {
  return res.json({ message: "todo" });
};

export const get = async (req, res, next) => {
  return res.json({ message: "todo" });
};

export const update = async (req, res, next) => {
  return res.json({ message: "todo" });
};

export const destroy = async (req, res, next) => {
  return res.json({ message: "todo" });
};

export default { index, create, get, update, destroy };
