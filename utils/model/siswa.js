const mongoose = require('mongoose')

const siswaSchema = mongoose.Schema({
    namaSiswa: String,
    nisn: String,
    kelas: {type: mongoose.Schema.Types.ObjectId, ref: 'kelas'},
    nilai: [{type: mongoose.Schema.Types.ObjectId, ref: 'nilai'}]}, 
    {
        timestamps: true
})

const Siswa = mongoose.model('siswa', siswaSchema)

module.exports = { Siswa }