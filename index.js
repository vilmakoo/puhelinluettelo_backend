const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
// app.use(morgan('tiny'))

app.use(cors())

let persons = [
    {
        id: 1,
        name: 'Matti Meikäläinen',
        number: '040-1234567'
    },
    {
        id: 2,
        name: 'Eino Ervasti',
        number: '040-5357853'
    },
    {
        id: 3,
        name: 'Hannele Heinä',
        number: '040-3585324'
    },
    {
        id: 4,
        name: 'Seija Suopursu',
        number: '040-8395839'
    },
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const personCount = persons.length
    res.send(`<p>puhelinluettelossa on ${personCount} henkilön tiedot</p>
      <p>${Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.name === '') {
        return res.status(400).json({error: 'name is missing'})
    } else if (body.number === undefined || body.number === '') {
        return res.status(400).json({error: 'number is missing'})        
    } else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'})        
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000)
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})