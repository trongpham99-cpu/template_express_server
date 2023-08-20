const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//init db
require('./dbs/init.mongo')

//init routes
app.use('/', require('./routes/index'))

//handling error 
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error) // next(error) will pass the error to the next middleware
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal server error'
    })
})

module.exports = app