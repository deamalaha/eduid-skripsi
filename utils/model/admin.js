const mongoose = require('mongoose')

const Admins = mongoose.model('Admin', {
    name: String,
    date: Date,
    nip: String,
    noHp: String,
    jabatan: String,
    email: String,
    password: String,
})

module.exports = { Admins }