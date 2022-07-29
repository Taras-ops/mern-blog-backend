import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'


import {registerValidation, loginValidation, postCreateValidation, commentCreateValidation} from './validations/index.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController, CommentController} from './controllers/index.js'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB is OK')
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()
const PORT = 5000

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

app.use(express.json()) // Читає json
app.use('/uploads', express.static('uploads'))
app.use(cors())

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.get('/posts/:id/relatedPosts', PostController.relatedPosts)
app.get('/tags/:tag', PostController.getByTag)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.put('/posts/:id/like', checkAuth, PostController.likeToggle)

app.get('/posts/:id/comments', CommentController.getAll)
app.post('/posts/:id/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create)
app.delete('/posts/:postId/comments/:commentId', checkAuth, CommentController.remove)
app.patch('/posts/:postId/comments/:commentId', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.update)

app.listen(process.env.PORT || PORT, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log(`Server listening on port ${PORT}`)
})
