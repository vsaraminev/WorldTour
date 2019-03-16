const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  email: {type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE, unique: true},
  username: {type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE, unique: true},
  salt: mongoose.Schema.Types.String,
  password: mongoose.Schema.Types.String,
  firstName: {type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE},
  lastName: {type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE},
  avatar: {type: mongoose.Schema.Types.String, default: 'https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg'},
  roles: [{type: mongoose.Schema.Types.String, default: 'User'}],
  tours: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tour'}],
})

userSchema.method({
  authenticate: function (password) {
    return encryption.generateHashedPassword(this.salt, password) === this.password
  }
})

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length > 0) return

    let salt = encryption.generateSalt()
    let password = encryption.generateHashedPassword(salt, '123')

    User.create({
      email: 'admin@admin.com',
      username: 'Admin',
      firstName: 'Admin',
      lastName: 'Admin',
      salt: salt,
      password: password,
      avatar: 'http://proconsultancies.org/wimages/icon-user-default.png',
      roles: ['Admin', 'User']
    })
  })
}
