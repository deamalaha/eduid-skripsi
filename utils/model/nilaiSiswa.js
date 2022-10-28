const mongoose = require('mongoose')

const NilaiSiswa = mongoose.model('nilaiSiswa', {
    mataPelajaran: {
        type: Schema.Types.ObjectID, ref: 'mataPelajaran'
    },
    siswa: {
        type: Schema.Types.ObjectID, ref: 'siswa'
    },
    kelas: {
        type: Schema.Types.ObjectID, ref: 'kelas'
    },
    nilai: String,
})

module.exports = { NilaiSiswa }