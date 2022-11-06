const mongoose = require('mongoose')

const kelasSchema = mongoose.Schema({
    nama: String,
    siswa: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'siswa'
    }],
    jurusan: {type: mongoose.Schema.Types.ObjectId, ref: 'jurusan'}
    }, {
        timestamps: true,
    }
)

const DataKelas = mongoose.model('kelas', kelasSchema)

module.exports = { DataKelas }
