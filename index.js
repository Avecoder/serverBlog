import express from 'express'


import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import handleValidationErrors from './utils/handleValidationErrors.js'

import {register, login, getMe} from './controllers/UserController.js'
import {createPost, getAll, getOne, removePost, updatePost, getLastTags} from './controllers/PostController.js'


import checkAuth from './utils/checkAuth.js'

mongoose
  .connect('mongodb+srv://avecoder:df031011@cluster0.yp4teko.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, register)
app.post('/auth/login', loginValidation, login)
app.get('/auth/me', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  return res.status(200).json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, createPost)
app.get('/posts', getAll)
app.get('/tags', getLastTags)
app.get('/posts/:id', getOne)
app.delete('/posts/:id', checkAuth, removePost)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, updatePost)


app.listen(4444, (err) => {
  if(err) {
    return console.log(err)
  }

  console.log('Server OK')
})
