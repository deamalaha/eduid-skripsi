const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
var methodOverride = require('method-override')

var expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')
require('./utils/db.js')

const { Admins } = require('./utils/model/admin')
const { KurikulumJurusan } = require('./utils/model/kurikulumJurusan')
const { DataKelas } = require('./utils/model/dataKelas')
const { DataMataPelajaran } = require('./utils/model/daftarMataPelajaran')
const { ObjectId } = require('mongodb')

const port = 4000

// setup
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({extended: true}))
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: {maxAge:600},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
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

  return res.redirect('/main')  
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
  const error = validationResult(req)
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

  Admins.insertMany({
    name,
    date,
    nip,
    noHp,
    email,
    password,
    jabatan
  })

  return res.redirect('/main')  
})

// dashboard
app.get('/main', (req, res) => {
  res.render('dashboard/main_dashboard', {
    title: 'Halaman Utama',
    layout: 'layout/main-layout',
  })
})


app.get('/siswa', async (req, res) => {
  const dataKelas = await DataKelas.find()

  res.render('dashboard/siswa_dashboard', {
    title: 'Siswa Dashboard',
    layout: 'layout/main-layout',
    dataKelas,
  })
})

app.get('/siswa/tambah_kelas', (req, res) => {
  
  res.render('modal/modal_tambah_kelas', {
    title: 'Siswa Dashboard - Tambah Kelas',
    layout: 'layout/modal-layout',
  })
})

app.post('/siswa', body(), async (req, res) => {
  //tambah kelas
  const admin = await Admins.findById({ _id: req.params._id })
  const { jenisStudi, tingkatan, jurusan, nama, standarKurikulum } = req.body

  const newKelas = new DataKelas.create({
    jenisStudi,
    tingkatan,
    jurusan,
    nama,
    standarKurikulum
  })

  try {
    admin.kelas.push(newKelas)
    await admin.save()
  } catch (error) {
    res.status(500).send(error)
  }
 
  return res.status(200).json({
    status: 'OK',
    message: 'Kelas berhasil dibuat',
    data: newKelas,
  });

  // DataKelas.insertMany(req.body, (error, result) => {
  //   req.flash('msg', 'Kelas berhasil ditambahkan!')
  //   res.redirect('/siswa')
  // })
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

app.get('/siswa/tambah_siswa', (req, res) => {

  res.render('modal/modal_tambah_siswa', {
    title: 'modal/modal_tambah_siswa',
    layout: 'layout/modal-layout',
  })
})

app.put('/siswa/tambah_siswa', (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('modal/modal_tambah_siswa', {
      title: 'modal/modal_tambah_siswa',
      layout: 'layout/modal-layout',
      errors: errors.array(),
      dataKelas: req.body
    })
  } else {
    DataKelas.updateOne(
      { _id : mongoose.Types.ObjectId(req.params._id) }, 
      {
        $push: {
        siswa: [{
          namaSiswa: req.body.namaSiswa,
          nisn: req.body.nisn,
        }]}}
    ).then((result) => {
      req.flash('msg', 'Data jurusan berhasil diubah!')
      console.log('edit success')
      res.redirect('/kurikulum')
    })
  }
})

app.get('/siswa/:_id', async (req, res) => {

  const dataKelas = await DataKelas.findOne({ _id : req.params._id})
  
  res.render('add/tambah_siswa', {
    title: 'Siswa Dashboard - Tambah Siswa',
    layout: 'layout/main-layout',
    dataKelas
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

app.get('/kurikulum', async (req, res) => {

  const dataKurikulum = await KurikulumJurusan.find()
  
  res.render('dashboard/kurikulum_dashboard', {
    title: 'Kurikulum Dashboard',
    layout: 'layout/main-layout',
    dataKurikulum,
  })
})

app.get('/kurikulum/tambah_jurusan', (req, res) => {
  res.render('modal/modal_tambah_jurusan', {
    title: 'Kurikulum Dashboard - Tambah Jurusan',
    layout: 'layout/modal-layout',
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


app.post('/kurikulum', body(), (req, res) => {
  KurikulumJurusan.insertMany(req.body, (error, result) => {
    req.flash('msg', 'Jurusan berhasil ditambahkan!')
    res.redirect('/kurikulum')
  })
})

app.delete('/kurikulum', (req, res) => {
  KurikulumJurusan.deleteOne({ _id : req.body._id}).then((result) => {
    req.flash('msg', 'Jurusan berhasil dihapus')
    res.redirect('/kurikulum')
  })
})

app.put('/kurikulum', (req, res) => {
  // const errors = validationResult(req)
  // if (!errors.isEmpty()) {
  //   res.render('modal/modal_edit_jurusan', {
  //     title: 'Kurikulum Dashboard - Edit Jurusan',
  //     layout: 'layout/signup-layout',
  //     errors: errors.array(),
  //     dataJurusan: req.body
  //   })
  // } else {
  //   await KurikulumJurusan.findOneAndUpdate(
  //     { _id : req.params._id }, 
  //     {
  //       jenisStudi : req.body.jenisStudi,
  //       jurusan: req.body.jurusan,
  //       semester: req.body.semester,
  //       standarKurikulum: req.body.standarKurikulum,
  //       skalaPenilaian: req.body.skalaPenilaian
  //     }, {
  //       new: true
  //     }
  //   ).then((result) => {
  //     req.flash('msg', 'Data jurusan berhasil diubah!')
  //     console.log('edit success')
  //     res.redirect('/kurikulum')
  //   })
  // }

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

app.get('/kurikulum/tambah_mata_pelajaran/:_id', (req, res) => {

  res.render('modal/modal_tambah_mata_pelajaran', {
    title: 'Kurikulum Dashboard - Tambah Mata Pelajaran',
    layout: 'layout/modal-layout',
  })
})

//OLONG REVISI YA COK
app.put('/kurikulum/tambah_mata_pelajaran', body(), (req, res) => {
  KurikulumJurusan.updateOne(
    { _id : req.params._id },
    {
      $push: {
      mataPelajaran: [
      {
        namaMataPelajaran: req.body.namaMataPelajaran,
        kkm: req.body.kkm,
        durasiJam: req.body.durasiJam,
      },
    ]}
    }, 
    (error, result) => {
    console.log('embedded success')
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