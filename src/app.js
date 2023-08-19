const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
require('dotenv').config()
const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

//init db
require('./dbs/init.mongo')

//init routes
app.get('/', (req, res, next) => {
    const strCompress = 'Hello trongpham.dev'
    return res.status(200).json({
        message: 'Welcome commerce server !!!',
        metadata: strCompress.repeat(100000)
    })
})

//handling error 

module.exports = app