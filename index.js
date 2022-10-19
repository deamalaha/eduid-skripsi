const express = require('express')
const app = express()
var expressLayouts = require('express-ejs-layouts')
const port = 4000

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(expressLayouts)

app.get('/main', (req, res) => {
  res.render('dashboard/main_dashboard', {
    title: 'Halaman Utama',
    layout: 'layout/main-layout',
  })
})

app.get('/kurikulum', (req, res) => {
  res.render('dashboard/kurikulum_dashboard', {
    title: 'Kurikulum Dashboard',
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

app.listen(port, () => {
  console.log(`EduID listening on port localhost:${port}`)
})