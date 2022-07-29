import { body } from "express-validator";

export const commentCreateValidation = [
    body('text', 'Введіть текст коментаря').isLength({ min: 1 }).isString(),
]