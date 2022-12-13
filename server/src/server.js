/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const colors = require('colors')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const mainRouter = require('./routes/mainRouter')
const port = process.env.PORT || 8001
const http = require('http').createServer(app)
const socketIo = require('socket.io')
const socketRouter = require('./routes/socketRouter')

mongoose.connect(process.env.MONGO_KEY)
.then(() => {
  console.log('Connected to MongoDB'.bgBrightGreen.italic)
}).catch((error) => {
  console.log(`Error: ${error}`.bgBrightRed.italic)
})

const io = socketIo(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE'
}))
app.use(express.json())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})
)

http.listen(port, () => console.log(`Server runs on port ${port}`.bgBrightWhite.italic))

app.use('/', mainRouter)
app.set('socketio', io)
socketRouter(io)
