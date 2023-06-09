const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const path = require('path')
const http = require('http')

const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New webSocket connection');

    socket.emit('message', generateMessage('Welcome !'))
    socket.broadcast.emit('message', generateMessage('A new User has joined !'))

    socket.on('sendMessage', (message, callback) => { 
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not authorized !')
        }
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${location.lat},${location.long}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left !'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port : ${port} !`);
})