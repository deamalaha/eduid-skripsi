const mongoose = require('mongoose')

const nilaiSchema = mongoose.Schema({
    mataPelajaran: {
        type: mongoose.Schema.Types.ObjectId
    },
    siswa: {
        type: mongoose.Schema.Types.ObjectId, ref: 'siswa'
    },
    kelas: {
        type: mongoose.Schema.Types.ObjectId, ref: 'kelas'
    },
    nilai: String }, {
        timestamps: true
})

const NilaiSiswa = mongoose.model('nilai', nilaiSchema)

module.exports = { NilaiSiswa }