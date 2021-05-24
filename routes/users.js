const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/')
  },
  filename: function (request, file, callback) {
    callback(null,Date.now() + file.originalname)
  }
});
const upload = multer({storage: storage})

router.post('/login', usersController.login)

router.post('/register', usersController.registerUser)

router.get('/genome/:username', usersController.genome)

router.get('/profilepicture/:username', usersController.profilePicture)

router.get('/checkVideo/:username', usersController.checkVideo)

router.post('/uploadVideo/:username', upload.single('video'), usersController.uploadVideo)

module.exports = router
