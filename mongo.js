const mongoose = require('mongoose')

const url = 'mongodb://vilmakoo:puhluettelo1@ds123258.mlab.com:23258/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

parameters = process.argv

if (parameters.length === 4) {
    const person = new Person({
        name: parameters[2],
        number: parameters[3]
    })

    console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)

    person.save()
        .then(response => {
            console.log('person saved!')
            mongoose.connection.close()
        })

} else if (parameters.length == 2) {
    Person.find({})
        .then(result => {
            console.log('puhelinluettelo:')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}