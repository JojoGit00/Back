//Imports
const mongoose = require('mongoose')
const uniqueValidator =  require('mongoose-unique-validator')


//Schema de données MongoDb pour les users
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

//Implémentation du plugin 'uniqueValidor' de mongoose pour vérifier l'unicité des adresses mails et signaler les erreurs
userSchema.plugin(uniqueValidator)


//Exports
module.exports = mongoose.model('User', userSchema)