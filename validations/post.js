import { body } from "express-validator";

export const postCreateValidation = [
    body('title', 'Введіть заголовок статті').isLength({ min: 3 }).isString(),
    body('text', 'Введіть текст статті').isLength({ min: 10 }).isString(),
    body('tags', 'Невірний формат тегів (Вкажіть масив)').optional().isArray(),
    body('imageUrl', 'Невірне посилання на зображення').optional().isString()
]