const mongoose = require('mongoose')

const nilaiSchema = mongoose.Schema({
    mataPelajaran: {
        type: Schema.Types.ObjectID, ref: 'mataPelajaran'
    },
    siswa: {
        type: Schema.Types.ObjectID, ref: 'siswa'
    },
    kelas: {
        type: Schema.Types.ObjectID, ref: 'kelas'
    },
    nilai: String}, {
        timestamps: true
})

const NilaiSiswa = mongoose.model('nilaiSiswa', nilaiSchema)

module.exports = { NilaiSiswa }