const mongoose = require('mongoose')

const KurikulumJurusan = mongoose.model('jurusan', {
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
})

module.exports = { KurikulumJurusan }
