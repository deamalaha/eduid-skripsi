const mongoose = require('mongoose')

const DataKelas = mongoose.model('kelas', {
    nama: String,
    siswa: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'siswa'
    }],
    jurusan: {type: mongoose.Schema.Types.ObjectId, ref: 'jurusan'}
})

module.exports = { DataKelas }
