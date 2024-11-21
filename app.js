const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Konfigurasi Body Parser untuk menangani form data
app.use(bodyParser.urlencoded({ extended: true }));



// Konfigurasi EJS sebagai view engine
app.set('view engine', 'ejs');

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Ganti dengan username MySQL Anda
  password: '',  // Ganti dengan password MySQL Anda
  database: 'kebun_binatang'
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to database:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Halaman utama untuk menampilkan daftar hewan
app.get('/', (req, res) => {
  db.query('SELECT * FROM animals', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.send('Error fetching data');
    }
    res.render('index', { animals: results });
  });
});

// Halaman untuk menambah hewan baru
app.get('/add-animal', (req, res) => {
  res.render('addAnimal');
});

// Menambah hewan ke database
app.post('/animals', (req, res) => {
  const { name, species, age, condition } = req.body;
  db.query('INSERT INTO animals (name, species, age, condition) VALUES (?, ?, ?, ?)', [name, species, age, condition], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.send('Error inserting data');
    }
    res.redirect('/');
  });
});

// Halaman untuk mengedit data hewan
app.get('/edit-animal/:id', (req, res) => {
  const animalId = req.params.id;
  db.query('SELECT * FROM animals WHERE id = ?', [animalId], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.send('Error fetching data');
    }
    res.render('editAnimal', { animal: results[0] });
  });
});

// Menyimpan perubahan pada data hewan
app.post('/edit-animal/:id', (req, res) => {
  const animalId = req.params.id;
  const { name, species, age, condition } = req.body;
  db.query('UPDATE animals SET name = ?, species = ?, age = ?, condition = ? WHERE id = ?', [name, species, age, condition, animalId], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.send('Error updating data');
    }
    res.redirect('/');
  });
});

// Menghapus hewan dari database
app.post('/delete-animal/:id', (req, res) => {
  const animalId = req.params.id;
  db.query('DELETE FROM animals WHERE id = ?', [animalId], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.send('Error deleting data');
    }
    res.redirect('/');
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
