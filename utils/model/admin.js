const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
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
    }],
  }, {
    timestamps: true,
  }
)

const Admins = mongoose.model('Admin', adminSchema)

module.exports = { Admins }