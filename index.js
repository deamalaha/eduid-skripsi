const express = require('express')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
var methodOverride = require('method-override')

var expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')
// const { loadKurikulum, findJurusan, addJurusan, deleteJurusan, updateJurusan } = require('./utils/controller/users.js')
require('./utils/db.js')

const {Admin} = require('./utils/model/admin')
const { KurikulumJurusan } = require('./utils/model/kurikulumJurusan')

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
    layout: 'layout/signup-layout',
  })
})

app.post('/login', check('email', 'Email tidak valid').isEmail(), (req, res) => {
  const error = validationResult(req)

  if(!error.isEmpty()) {
    return res.status(400).json({ error: error.array() })
  }
})

app.get('/signup', (req, res) => {
  res.render('signup/sign-up', {
    title: 'Daftar',
    layout: 'layout/signup-layout',
  })
})

app.get('/signup_next', (req, res) => {
  res.render('signup/sign-up_next', {
    title: 'Daftar',
    layout: 'layout/signup-layout',
  })
})

// dashboard
app.get('/main', (req, res) => {
  res.render('dashboard/main_dashboard', {
    title: 'Halaman Utama',
    layout: 'layout/main-layout',
  })
})


app.get('/siswa', (req, res) => {
  res.render('dashboard/siswa_dashboard', {
    title: 'Siswa Dashboard',
    layout: 'layout/main-layout',
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

app.post('/kurikulum', body(), (req, res) => {
  KurikulumJurusan.insertMany(req.body, (error, result) => {
    req.flash('msg', 'Jurusan berhasil ditambahkan!')
    res.redirect('/kurikulum')
  })
})

// app.get('/kurikulum/delete/:_id', async (req, res) => {

//   const dataJurusan = await KurikulumJurusan.findOne({ _id : req.params._id})
  
//   if(!dataJurusan) {
//     res.status(404)
//   } else {
//     KurikulumJurusan.deleteOne({ _id : dataJurusan._id}).then((result) => {
//       req.flash('msg', 'Jurusan berhasil dihapus')
//       res.redirect('/kurikulum')
//     })
//   }
// })

// next step: mengubah app.get untuk delete menjadi app.delete

app.delete('/kurikulum', (req, res) => {
  KurikulumJurusan.deleteOne({ _id : req.body._id}).then((result) => {
    req.flash('msg', 'Jurusan berhasil dihapus')
    res.redirect('/kurikulum')
  })
})

app.get('/kurikulum/edit/:_id', async (req, res) => {

  const dataJurusan = await KurikulumJurusan.findOne({ _id : req.params._id})

  res.render('modal/modal_edit_jurusan', {
    title: 'Kurikulum Dashboard - Edit Jurusan',
    layout: 'layout/signup-layout',
    dataJurusan
  })
})

app.get('/kurikulum/:_id', async (req, res) => {

  const dataJurusan = await KurikulumJurusan.findOne({ _id : req.params._id})
  
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

app.get('/tambah_siswa', (req, res) => {
  res.render('add/tambah_siswa', {
    title: 'Siswa Dashboard - Tambah Siswa',
    layout: 'layout/main-layout',
  })
})
 
app.listen(port, () => {
  console.log(`EduID listening on port localhost:${port}`)
})
