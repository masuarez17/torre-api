const express = require('express')
const app = express()

// Middlewares
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')

app.use(express.static('public'))

app.use(compression())

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers','*');
    if(request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return response.status(200).json({});
    }
    next();
});


// Api Routes
const usersRoutes = require('./routes/users.js')

app.use('/users', usersRoutes)

// Api route not found
app.use((request, response) => {
    response.status(404).json({
        error: 'Route not found'
    })
})

module.exports = app
