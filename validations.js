import { body } from 'express-validator'

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({min: 5}),
  body('fullName').isLength({min: 3}),
  body('avatarURL').optional().isURL(),
]

export const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({min: 5}),
]

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({min: 5}).isString(),
  body('text', 'Введите текс статьи').isLength({min: 10}).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
  body('imageURL', 'Неверная ссылка на изображение').optional().isString(),
]
