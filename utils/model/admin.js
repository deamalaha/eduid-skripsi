const mongoose = require('mongoose')

const Admins = mongoose.model('Admin', {
    name: String,
    date: Date,
    nip: String,
    noHp: String,
    jabatan: String,
    email: String,
    password: String,
    jurusan:[{
      type: mongoose.Schema.Types.ObjectId, ref: 'jurusan',
    }],
    kelas: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'kelas',
    }]
})

module.exports = { Admins }