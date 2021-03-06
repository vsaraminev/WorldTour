const mongoose = require('mongoose')
const User = require('../models/User')
const Tour = require('../models/Tour')

mongoose.Promise = global.Promise

module.exports = (settings) => {
  mongoose.connect(settings.db, {
    useCreateIndex: true,
    useNewUrlParser: true
    })
  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }
    console.log('MongoDB ready!')
    User.seedAdminUser()
    Tour.seedTours()
  })
  db.on('error', err => console.log(`Database error: ${err}`))
}
