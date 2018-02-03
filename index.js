const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
// app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))


app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/info', (req, res) => {
    Person.find({})
        .then(persons => {
            const personCount = persons.length
            res.send(`<p>puhelinluettelossa on ${personCount} henkilön tiedot</p>
          <p>${Date()}</p>`)
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.name === '') {
        return res.status(400).json({ error: 'name is missing' })
    } else if (body.number === undefined || body.number === '') {
        return res.status(400).json({ error: 'number is missing' })
    }

    Person.findOne({ name: body.name }) // check that name is unique
        .then(result => {
            if (result !== null) {
                console.log('person already in database')
                res.status(400).send({ error: `contact list already contains the name ${body.name}` })
            } else {
                console.log('person is new') // name not in db => OK, continue
                const person = new Person({
                    name: body.name,
                    number: body.number
                })

                person.save()
                    .then(savedPerson => {
                        res.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        })
        .catch(error => console.log(error))
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})