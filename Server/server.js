const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const path = require('path');
const multer = require('multer');

const app = express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true // allow credentials
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../Livrarian Myth/uploads')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'livrarian_myth'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Middleware to check for cookie
function checkAuth(req, res, next) {
  const username = req.cookies.username;
  if (!username) {
      return res.status(401).send('Unauthorized: No cookie found');
  }
  next();
}

app.get('/login', checkAuth, (req, res) => {
  res.send('Not Loggedin');
});

//BOOKLIST
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM tbl_books', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

//search
app.get('/api/search', (req, res) => {
  const searchQuery = req.query.query;
  if (!searchQuery) {
    return res.status(400).send('Query parameter is required');
  }

  const sqlQuery = 'SELECT * FROM tbl_books WHERE book_name LIKE ? OR book_class LIKE ?';
  const values = [`%${searchQuery}%`, `%${searchQuery}%`];

  db.query(sqlQuery, values, (err, results) => {  
    if (err) throw err;
    res.json(results);
  });
});

//Selecting Book tanginaaaaaaa burat
app.get('/api/bookDetails', (req, res) => {
  const bookName = req.query.bookName;
  const sql = 'SELECT * FROM tbl_books WHERE book_name = ?';
  db.query(sql, [bookName], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Book not found');
    } else {
      res.json(results[0]);
    }
  });
});

app.post('/api/bookMark', (req, res) => {
  const {bookID, bookName, userID, username} = req.body;

  const bookMarkQuery = 'INSERT INTO tbl_book_marks (book_ID, book_name, user_ID, user_name) VALUES (?,?,?,?)';
  db.query(bookMarkQuery, [bookID, bookName, userID, username], (err, results) => {
    if (err) {
      console.error('Error adding to book marks:', err);
      res.status(500).send('Server error');
      return;
    }

    res.send('Added to Book Marks');
  })
});

app.post('/api/removeBookMark', (req, res) => {
  const {bookID, userID} = req.body;

  const removeQuery = 'DELETE FROM tbl_book_marks WHERE user_ID = ? AND book_ID = ?';
  db.query(removeQuery, [userID, bookID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      return res.status(500).send('Server Error')
    }
    if (results.length === 0) {
      return res.status(404).send('Book not found')
    } else {
      return res.json(results[0]);
    }
  });
});

app.get('/api/bookings', (req, res) => {
  const bookID = req.query.bookID;
  const userID = req.cookies.userID;

  const sqlQuery = 'SELECT * FROM tbl_book_marks WHERE user_ID = ? AND book_ID = ?';
  
  db.query(sqlQuery, [userID, bookID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('Book not found');
    } else {
      return res.json(results[0]);
    }
  });
});

app.get('/api/bookMarks', (req, res) => {
  const userID = req.cookies.userID;

  const sqlFetchBookMark = 'SELECT * FROM tbl_book_marks WHERE user_ID = ?';
  db.query(sqlFetchBookMark, [userID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('No Bookmarks');
    } else {
      return res.json(results);
    }
  });
})



app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    // Check if the username already exists
    const checkQuery = 'SELECT * FROM accounts WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
      if (err) {
        console.error('Error checking username:', err);
        res.status(500).send('Server error');
        return;
      }
  
      if (results.length > 0) {
        // Username already exists
        res.status(409).send('Username already exists');
      } else {
        // Generate a salt and hash the password
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Server error');
            return;
          }
  
          const insertQuery = 'INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)';
          db.query(insertQuery, [username, email, hash], (err, result) => {
            if (err) {
              console.error('Error inserting user into database:', err);
              res.status(500).send('Server error');
              return;
            }
  
            res.send('User registered successfully');
          });
        });
      }
    });
  });

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM accounts WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length > 0) {
      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          res.status(500).send('Server error');
          return;
        }

        if (isMatch) {
          res.cookie('username', username, { httpOnly: false, secure: false, maxAge: 3600000 }); // 1 hour
          res.cookie('userID', user.userID, { httpOnly: false, secure: false, maxAge: 3600000 }); // 1 hour

          res.send('Login successful');
        } else {
          res.status(401).send('Invalid credentials');
        }
      });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// USER
// Fetching infos
app.get('/api/account', (req, res) => {
  const userID = req.cookies.userID;  // Retrieve the userID from cookies
  if (!userID) {
      return res.status(400).send('User ID not found in cookies');
  }
  const sql = 'SELECT username, email, profile_img FROM accounts WHERE userID = ?';
  db.query(sql, [userID], (err, results) => {
      if (err) {
          res.status(500).send(err);
      } else if (results.length > 0) {
          res.json(results[0]);
      } else {
          res.status(404).send('User not found');
      }
  });
});

// Updating a Profile
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../Livrarian Myth/uploads/profiles'))
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadPic = multer({ storage: tempStorage })

app.post('/api/upload/profile', uploadPic.single('profilePic'), (req, res) => {
  const userID = req.cookies.userID;
  const { username, email, currentPic } = req.body;
  const profilePic = req.file ? `${req.file.filename}` : currentPic;

  const query = 'UPDATE accounts SET username = ?, email = ?, profile_img = ? WHERE userID = ?';

  db.query(query, [username, email, profilePic, userID], (err, result) => {
    if (err) {
      console.error('Error updating profile:', err);
      res.status(500).send('Error updating profile');
    } else {
      res.send('Profile updated successfully!');
    }
  });
});

// ADMIN SIDEEEEE
// uploading new book data
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../Livrarian Myth/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Route to handle book upload
app.post('/api/upload', upload.single('bookCover'), (req, res) => {
  const { bookName, bookDesc, bookAuthor, bookClass, bookUniqueID } = req.body;
  const bookCover = req.file ? `${req.file.filename}` : '';
  const bookDateUploaded = new Date();

  const query = 'INSERT INTO tbl_books (book_name, book_desc, bookAuthor, book_class, book_cover, book_unique_ID, book_date_uploaded) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [bookName, bookDesc, bookAuthor, bookClass, bookCover, bookUniqueID, bookDateUploaded], (err, result) => {
    if (err) {
      console.error('Error inserting book data:', err);
      res.status(500).send('Error uploading book');
    } else {
      res.send('Book uploaded successfully');
    }
  });
});


app.post('/api/logout', (req, res) => {
  res.clearCookie('username');
  res.clearCookie('userID');
  res.send('Logout successful');
});
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
