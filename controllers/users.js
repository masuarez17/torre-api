const database = require('../database')
const Users = database.models.users
const { hashKey } = require('../enviroment')
const bcrypt = require('bcrypt')
const axios = require('axios')

exports.registerUser = async (request, response) => {
  bcrypt.hash(request.body.password, 10, (error, hash) => {
    if (error) {
      response.status(500).json({
        error: error
      })
    } else {
      request.body.password = hash

      Users.findByPk(request.body.email)
        .then(result => {
          if (result === null) {
            Users.create(request.body)
              .then(() => {
                response.status(201).json({
                  message: 'User created successfully'
                })
              })
              .catch(error => {
                let unique = false
                error.errors.forEach(error => {
                  if (error.message === 'users.username must be unique') {
                    unique = true
                    response.status(400).json({
                      error: 'Username already exist'
                    })
                  }
                })
                if (!unique) {
                  response.status(400).json(error.errors)
                }
              })
          } else {
            response.status(400).json({
              error: 'User already exist'
            })
          }
        })
        .catch(error => {
          response.status(500).json(error.errors)
        })
    }
  })
}

exports.login = (request, response) => {
  Users.findOne({
    where: { username: request.body.username },
    attributes: ['username', 'password']
  })
    .then(results => {
      if (results === null) {
        response.status(400).json({
          error: 'Invalid username or password'
        })
        return
      }

      bcrypt.compare(request.body.password, results.password)
        .then(result => {
          if (result) {
            const user = {
              username: results.username,
            }
            response.status(200).json(user)
          } else {
            return response.status(400).json({
              error: 'Invalid username or password'
            })
          }
        })
    })
}

exports.checkVideo = (request, response) => {
  Users.findOne({
    where: { username: request.params.username },
    attributes: ['username', 'videoUrl']
  })
    .then(results => {
      if (results === null) {
        response.status(400).json({
          error: 'Invalid username'
        })
        return
      }
      if (results.videoUrl === null) {
        response.status(200).json({
          hasVideo: false
        })
      } else {
        response.status(200).json({
          hasVideo: true,
          videoUrl: results.videoUrl
        })
      }
    })
}

exports.uploadVideo = (request, response) => {
  Users.update({ videoUrl: request.file.filename }, { where: { username: request.params.username } })
    .then(() => {
      response.status(200)
    })
    .catch(error => {
      console.log(error)
      response.status(400).json({
        error: error.errors
      })
    })
}

exports.genome = (request, response) => {
  axios.get(`https://bio.torre.co/api/bios/${request.params.username}`)
    .then((result) => {
      response.status(200).json(result.data)
    })
    .catch(error => {
      response.status(400).json({
        error: error.errors
      })
    })
}

exports.profilePicture = (request, response) => {
  axios.get(`https://bio.torre.co/api/bios/${request.params.username}`)
    .then((result) => {
      response.status(200).json({
        pictureUrl: result.data.person.picture
      })
    })
    .catch(error => {
      response.status(400).json({
        error: error.errors
      })
    })
}
