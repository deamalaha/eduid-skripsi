const mongoose = require('mongoose')

const Admins = mongoose.model('Admin', {
    name: String,
    email: {
      type: String,
      required: true
    },
    password: String,
})

module.exports = { Admins }