const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const parameters = process.argv

if (parameters.length === 4) {
  const person = new Person({
    name: parameters[2],
    number: parameters[3]
  })

  console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)

  person.save()
    .then(() => {
      console.log('person saved!')
      mongoose.connection.close()
    })

} else if (parameters.length === 2) {
  Person.find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}