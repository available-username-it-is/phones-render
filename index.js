const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('short'))
app.use(express.static('dist'))

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})

app.get('/info', (request, response) => {
  const requestArrivalTime = new Date()
  const contactsAmount = contacts.length
  response.send(`<p>Phonebook has info for ${contactsAmount} people</p>
                <p>${requestArrivalTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  const contact = contacts.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  contacts = contacts.filter(contact => contact.id !== id)
  response.send("Successful deletion!")
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 1000000)
  let newContact = request.body

  if (!(newContact.name && newContact.number)) {
    return response.status(400).json({
        error: "Contact data is missing"
    })
  }

  if (contacts.find(contact => contact.name === newContact.name)) {
    return response.status(400).json({
        error: "Contact with that name already exist"
    })
  }
  newContact["id"] = id
  contacts = contacts.concat(newContact)
  response.send(newContact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})