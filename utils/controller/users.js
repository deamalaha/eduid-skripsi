const fs = require('fs')
const validator = require('validator')

// make data folder
const dirPath = './dummy'
if (!fs.existsSync(dirPath)) [
    fs.mkdirSync(dirPath)
]

const dataPath = './dummy/users.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// load kurikulum
const loadKurikulum = () => {
    const fileBuffer = fs.readFileSync('dummy/kurikulum.json', 'utf-8')
    const kurikulum = JSON.parse(fileBuffer)
    return kurikulum
}

// find based on id
const findJurusan = (id_jurusan) => {
    const dataKurikulum = loadKurikulum()
    const jurusan = dataKurikulum.find(
        (jurusan) => jurusan.id_jurusan === id_jurusan
    )
    return jurusan
}

const overwriteFileJSON = (jurusan) => {
    fs.writeFileSync('dummy/kurikulum.json', JSON.stringify(jurusan))
}

const addJurusan = (jurusan) => {
    const arrayJurusan = loadKurikulum()
    arrayJurusan.push(jurusan)
    overwriteFileJSON(arrayJurusan)
}

const deleteJurusan = (id_jurusan) => {
    const dataKurikulum = loadKurikulum()
    const filteredData = dataKurikulum.filter((jurusan) => jurusan.id_jurusan !== id_jurusan)

    overwriteFileJSON(filteredData)
}

const updateJurusan = (id_jurusanBaru) => {
    const dataJurusan = loadKurikulum()
    const filteredData = dataKurikulum.filter((jurusan) => jurusan.id_jurusan !== id_jurusanBaru)

    console.log(filteredData)
}

module.exports = { loadKurikulum, findJurusan, addJurusan, deleteJurusan,updateJurusan }