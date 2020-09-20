import Joi from "joi";

const book_schema = Joi.object({
  title: Joi.string(),
  review: Joi.string(),
  rating: Joi.number().integer().min(0).max(5),
  image_url: Joi.string().uri(),
});

const on_create = Joi.object({
  title: Joi.string().required(),
});

export const book_create_schema = book_schema.concat(on_create);

export const book_update_schema = book_schema;
