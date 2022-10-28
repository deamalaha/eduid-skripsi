const express = require('express')
const app = express()
const mongoose = require('mongoose')

const flash = require('connect-flash')
var methodOverride = require('method-override')
var expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')
require('./utils/db.js')

const { Admins } = require('./utils/model/admin')
const { KurikulumJurusan } = require('./utils/model/kurikulumJurusan')
const { DataKelas } = require('./utils/model/dataKelas')
const { DataMataPelajaran } = require('./utils/model/daftarMataPelajaran')
const { Siswa } = require('./utils/model/siswa')

const port = 4000
const toId = mongoose.Types.ObjectId

// setup
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({extended: true}))
app.use(flash())
app.use(methodOverride('_method'))

app.get('/login', (req, res) => {
  res.render('signup/login', {
    title: 'Login',
    layout: 'layout/modal-layout',
  })
})

app.post('/login', check('email', 'Email tidak valid').isEmail(), async (req, res) => {
  const error = validationResult(req)
  const {email, password } = req.body

  const user = await Admins.findOne({ email : email })

  if(!error.isEmpty()) {
    return res.status(400).json({ error: error.array() })
  }

  if(!user) {
    return res.status(401).json({
      status: 'FAIL',
      data: {
        name: 'UNAUTHORIZED',
        message: 'Email tidak terdaftar'
      }
    })
  }

  if (password != user.password) {
    return res.status(401).json({
      status: 'FAIL',
      data: {
        name: 'UNAUTHORIZED',
        message: 'Wrong password',
      },
    });
  }

  return res.redirect('/main/' + user._id)  
})

app.get('/signup', (req, res) => {
  res.render('signup/sign-up', {
    title: 'Daftar',
    layout: 'layout/modal-layout',
  })
})

app.get('/signup_next', (req, res) => {
  res.render('signup/sign-up_next', {
    title: 'Daftar',
    layout: 'layout/modal-layout',
  })
})

app.post('/signup', check('email', 'Email tidak valid').isEmail(), async (req, res) => {
  const { email, password, name, nip, date, jabatan, noHp } = req.body

  const existingEmail = await Admins.findOne({ email : email })

  if(existingEmail) {
    return res.status(401).json({
      status: 'FAIL',
      data: {
        name: 'UNAUTHORIZED',
        message: 'Email telah terdaftar'
      },
    })
  }

  const newAdmin = Admins.insertMany({
    name,
    date,
    nip,
    noHp,
    email,
    password,
    jabatan
  })

  return res.redirect('/main/' + newAdmin._id)
})

// dashboard
app.get('/main/:_id', async (req, res) => {
  const admin = await Admins.findById({ _id: req.params._id})
  
  res.render('dashboard/main_dashboard', {
    title: 'Halaman Utama',
    layout: 'layout/main-layout',
    admin
  })
})


app.get('/siswa/:_id', async (req, res) => {
  const admin = await Admins.findById({ _id: req.params._id}).populate({path:'kelas', populate:{path:'jurusan'}})

  res.render('dashboard/siswa_dashboard', {
    title: 'Siswa Dashboard',
    layout: 'layout/main-layout',
    admin
  })

})

app.get('/siswa/:_id/tambah_kelas', async (req, res) => {
  const jurusan = await KurikulumJurusan.find()
  const admin = await Admins.findById({ _id: req.params._id })
  
  res.render('modal/modal_tambah_kelas', {
    title: 'Siswa Dashboard - Tambah Kelas',
    layout: 'layout/modal-layout',
    admin,
    jurusan
  })
})


//tambah kelas
app.post('/siswa', body(), async (req, res) => {
  const { nama, kurikulumJurusan} = req.body
  
  const admin = await Admins.findById({ _id: req.body.adminId })
  const jurusan = await KurikulumJurusan.findOne({ _id: kurikulumJurusan})
  
  const newKelas = await DataKelas.create({
    nama,
    jurusan: kurikulumJurusan
  })

  jurusan.kelas.push(newKelas)
  jurusan.save()

  admin.kelas.push(newKelas)
  admin.save()

  return res.redirect('/siswa/' + req.body.adminId)
})

app.delete('/siswa', (req, res) => {
  DataKelas.deleteOne({ _id : req.body._id}).then((result) => {
    req.flash('msg', 'Kelas berhasil dihapus')
    res.redirect('/siswa')
  })
})

app.put('/siswa', (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('modal/modal_edit_kelas', {
      title: 'Siswa Dashboard - Edit Kelas',
      layout: 'layout/signup-layout',
      errors: errors.array(),
      dataKelas: req.body
    })
  } else {
    DataKelas.updateOne(
      { _id : req.body._id }, 
      {
        $set: {
          jenisStudi : req.body.jenisStudi,
          jurusan: req.body.jurusan,
          nama: req.body.nama,
          standarKurikulum: req.body.standarKurikulum,
          tingkatan: req.body.tingkatan
        }
      }
    ).then((result) => {
      req.flash('msg', 'Data kelas berhasil diubah!')
      res.redirect('/siswa')
    })
  }
})

app.get('/siswa/:adminId/tambah_siswa/:kelasId', async (req, res) => {
  const admin = await Admins.findOne({_id: req.params.adminId})
  const dataKelas = await DataKelas.findOne({ _id: req.params.kelasId })

  res.render('modal/modal_tambah_siswa', {
    title: 'modal/modal_tambah_siswa',
    layout: 'layout/modal-layout',
    dataKelas,
    admin
  })
})

app.post('/siswa/tambah_siswa', body(), async (req, res) => {
  const dataKelas = await DataKelas.findOne({ _id: req.body.kelasId })
  const { namaSiswa, nisn } = req.body
  
  const newSiswa = await Siswa.create({
    namaSiswa,
    nisn,
    kelas: req.body.kelasId
  })

  dataKelas.siswa.push(newSiswa)
  dataKelas.save()

  return res.redirect('/siswa/' + req.body.adminId + '/' + req.body.kelasId)
})

app.get('/siswa/:adminId/:kelasId', async (req, res) => {
  const admin = await Admins.findOne({_id: req.params.adminId})
  const dataKelas = await DataKelas.findOne({ _id : req.params.kelasId}).populate('siswa jurusan')
  
  res.render('add/tambah_siswa', {
    title: 'Siswa Dashboard - Tambah Siswa',
    layout: 'layout/main-layout',
    dataKelas,
    admin
  })
})

app.get('/student_report', (req, res) => {
  res.render('dashboard/student_report', {
    title: 'Student Report',
    layout: 'layout/main-layout',
  })
})

app.get('/data_sharing', (req, res) => {
  res.render('dashboard/data-sharing_dashboard', {
    title: 'Data Sharing',
    layout: 'layout/main-layout',
  })
})

app.get('/kurikulum/:_id', async (req, res) => {
  const admin = await Admins.findOne({_id: req.params._id})
  const dataKurikulum = await KurikulumJurusan.find()
  
  res.render('dashboard/kurikulum_dashboard', {
    title: 'Kurikulum Dashboard',
    layout: 'layout/main-layout',
    dataKurikulum,
    admin
  })
})

app.get('/kurikulum/:_id/tambah_jurusan', async (req, res) => {
  const admin = await Admins.findOne({_id: req.params._id})

  res.render('modal/modal_tambah_jurusan', {
    title: 'Kurikulum Dashboard - Tambah Jurusan',
    layout: 'layout/modal-layout',
    admin
  })
})

app.get('/kurikulum/edit/:_id', async (req, res) => {
  const dataJurusan = await KurikulumJurusan.findOne({ _id : req.params._id});

  res.render('modal/modal_edit_jurusan', {
    title: 'Kurikulum Dashboard - Edit Jurusan',
    layout: 'layout/modal-layout',
    dataJurusan,
  })
})


app.post('/kurikulum', body(), async (req, res) => {
  const { tingkatan, semester, standarKurikulum, skalaPenilaian } = req.body

  if(req.body.jurusan === 'MIPA') {
    const MIPAmatpel = [{
      namaMataPelajaran: 'Biologi',
      kkm: '70',
      durasiJam: '32'
    }, {
      namaMataPelajaran: 'Matematika',
      kkm: '70',
      durasiJam: '32'
    }]

    await KurikulumJurusan.create({
      tingkatan,
      semester,
      standarKurikulum,
      skalaPenilaian,
      mataPelajaran: MIPAmatpel
    })
  } else {
    const IPSmatpel = [{
      namaMataPelajaran: 'Geografi',
      kkm: '70',
      durasiJam: '32'
    }, {
      namaMataPelajaran: 'Sejarah',
      kkm: '70',
      durasiJam: '32'
    }]

    await KurikulumJurusan.create({
      tingkatan,
      semester,
      standarKurikulum,
      skalaPenilaian,
      mataPelajaran: IPSmatpel
    })
  }

  //return res.redirect('/kurikulum/' +)
})

app.delete('/kurikulum', (req, res) => {
  KurikulumJurusan.deleteOne({ _id : req.body._id}).then((result) => {
    req.flash('msg', 'Jurusan berhasil dihapus')
    res.redirect('/kurikulum')
  })
})

app.put('/kurikulum', (req, res) => {
  const { jenisStudi, tingkatan, jurusan, semester, standarKurikulum, skalaPenilaian, _id } = req.body
  
  KurikulumJurusan.findByIdAndUpdate(
    { _id: _id},
    { $set: {
      jenisStudi, tingkatan, jurusan, semester, standarKurikulum, skalaPenilaian
    }}
  ).then((result) => {
    req.flash('msg', 'Jurusan berhasil diubah')
    res.redirect('/kurikulum')
  })
})

app.get('/kurikulum/tambah_mata_pelajaran/:_id', async (req, res) => {
  const dataJurusan = await KurikulumJurusan.findOne({ _id : req.params._id});

  res.render('modal/modal_tambah_mata_pelajaran', {
    title: 'Kurikulum Dashboard - Tambah Mata Pelajaran',
    layout: 'layout/modal-layout',
    dataJurusan
  })
})

app.put('/kurikulum/tambah_mata_pelajaran', body(), (req, res) => {
  const { namaMataPelajaran, kkm, durasiJam, _id } = req.body
  KurikulumJurusan.updateOne(
    { _id : _id },
    {
      $push: {
      mataPelajaran: [
      {
        namaMataPelajaran,
        kkm,
        durasiJam,
      },
    ]}
    }, 
    (error, result) => {
    req.flash('msg', 'Mata pelajaran berhasil ditambahkan!')
    res.redirect('/kurikulum')
  })
})

app.delete('/kurikulum/tambah_mata_pelajaran', (req, res) => {
  DataMataPelajaran.deleteOne({ _id : req.body._id}).then((result) => {
    req.flash('msg', 'Mata pelajaran berhasil dihapus')
    res.redirect('/kurikulum')
  })
})

app.get('/kurikulum/:_id', async (req, res) => {

  const dataJurusan = await KurikulumJurusan.findOne({ _id : req.params._id});
  
  res.render('add/tambah_mata_pelajaran', {
    title: 'Kurikulum Dashboard - Tambah Mata Pelajaran',
    layout: 'layout/main-layout',
    dataJurusan,
  })
})


app.get('/tambah_nilai_siswa', (req, res) => {
  res.render('add/tambah_nilai_siswa', {
    title: 'Siswa Dashboard - Tambah Nilai',
    layout: 'layout/main-layout',
  })
})

app.listen(port, () => {
  console.log(`EduID listening on port localhost:${port}`)
})