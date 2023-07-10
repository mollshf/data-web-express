const express = require('express');
const morgan = require('morgan');
const mahasiswa = require('./dataMhs');
const { loadData, findData, addData, cekDuplikat, deleteData } = require('./utils/control-system');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(flash());



// Halaman Home
app.get('/', (req, res) => {
    res.render('index', {
      title: 'Halaman Home'
    })
})

// Halaman About
app.get('/about', (req, res) => {
  res.render('about', {
    title: `Halaman About`,
  })
})

// Halaman Contact
app.get('/contact', (req, res) => {
  const datas = loadData();
    res.render('contact', {
      title: 'Halaman Contact',
      datas,
      msg: req.flash('msg')
    })
})

// Halaman Form Menambah Data
app.get('/contact/add', (req, res) => {
  res.render('add-data', {
    title: 'Form Tambah Data'
  })
})

// Proses Ubah Data
app.post('/contact', 
// validator Middleware
[
  body('nama').custom((value) => {
    const duplikat = cekDuplikat(value)
    if (duplikat) {
      throw new Error('nama kontak sudah terdaftar')
    }
    return true;
  }),
  check('email', 'E-mail tidak valid').isEmail(),
  check('noHP', 'No HP tidak valid').isMobilePhone('id-ID')
], 
// logika penanganan post
(req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render('add-data', {
      title: 'Tambah Data',
      errors: errors.array()
    })
    return;
  } 
  addData(req.body)
  req.flash('msg', 'Data berhasil di tambahkan')
  res.redirect('/contact')
})

// Proses hapus data
app.get('/contact/delete/:nama', (req, res) => {
  const data = findData(req.params.nama);
  
  if (!data) {
    res.status(404);
    res.render('404')

  } else {
    deleteData(req.params.nama)
    req.flash('msg', 'Data berhasil di hapus')
    res.redirect('/contact')
  }
})


// Halaman View Detail Data
app.get('/contact/:nama', (req, res) => {
    const data = findData(req.params.nama);
    console.log(data)
    res.render('view-data', {
      title: 'Halaman Detail',
      data
    })
})


app.use((req, res) => {
    res.status(404)
  res.render('404')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
