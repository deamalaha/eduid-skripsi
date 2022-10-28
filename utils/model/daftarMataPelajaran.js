const mongoose = require('mongoose')

const DataMataPelajaran = mongoose.model('mataPelajaran', {
    namaMataPelajaran: String,
    kkm: String,
    durasiJam: String,
})

module.exports = { DataMataPelajaran }

// const mataPelajaranSchema = mongoose.Schema({
//     namaMataPelajaran: {
//         type: String,
//         required: [true, 'Nama mata pelajaran tidak boleh kosong'],},
//     kkm: String,
//     durasiJam: String,
// }, { timestamps: true} )

// module.exports = mongoose.model('DataMataPelajaran', mataPelajaranSchema);