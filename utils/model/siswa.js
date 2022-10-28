const mongoose = require('mongoose')

const Siswa = mongoose.model('siswa', {
    namaSiswa: String,
    nisn: String,
    kelas: {type: mongoose.Schema.Types.ObjectId, ref: 'kelas'},
    nilai: [{type: mongoose.Schema.Types.ObjectId, ref: 'nilai'}]
})

module.exports = { Siswa }