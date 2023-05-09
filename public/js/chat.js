const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
 
//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        message : message.text,
        createdAt : moment(message.createdAt).format('dddd HH:mm') 
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationTemplate,{url})
    $messages.insertAdjacentHTML('beforeend',html)
 
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error) {
            return console.log(error);
        }
        console.log('Message delivered !');
    })
})

$locationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        alert('The browser does not support geolocation !')
    }
    
    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat : position.coords.latitude,
            long : position.coords.longitude
        }, () => { 
            $locationButton.removeAttribute('disabled')

            console.log('Location shared !');
        })
    })    
})