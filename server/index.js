const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routesHandler = require('./routes/handler')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const upload = require('express-fileupload')
require('dotenv').config()

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}))

app.use(cookieParser())
app.use(upload())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', routesHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})