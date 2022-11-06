const mongoose = require('mongoose')

const jurusanSchema = mongoose.Schema({
    tingkatan: String,
    jurusan: String,
    semester: String,
    standarKurikulum: String,
    skalaPenilaian: String,
    mataPelajaran: [{
        namaMataPelajaran: String,
        kkm: String,
        durasiJam: String,
    }],
    kelas: [{type: mongoose.Schema.Types.ObjectId, ref: 'kelas'}]
    },{
        timestamps: true
})

const KurikulumJurusan = mongoose.model('jurusan', jurusanSchema)

module.exports = { KurikulumJurusan }
