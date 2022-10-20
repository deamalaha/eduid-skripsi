const mongoose = require('mongoose')

const KurikulumJurusan = mongoose.model('jurusan', {
    jenisStudi: String,
    tingkatan: String,
    jurusan: String,
    semester: String,
    standarKurikulum: String,
    skalaPenilaian: String,
})

module.exports = { KurikulumJurusan }