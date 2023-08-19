const app = require('./src/app')
const { disconnect } = require('./src/helpers/check.connect')

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exits Server Express`))
    // notify here ...
})