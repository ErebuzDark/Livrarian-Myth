const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

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

app.get('/api/bookMarkCounts', (req, res) => {
  const bookName = req.query.bookName;
  const sql = 'SELECT COUNT(*) AS count FROM tbl_book_marks WHERE book_name = ?';
  db.query(sql, [bookName], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Book not found');
    }

    const count = results[0].count;
    res.json({ count }); 

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

//CHanging Password
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'rongentica05@gmail.com',
    pass: 'pilw fwck ezwm bxri'
  },
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

app.post('/send-verification-code', async (req, res) => {
  const { to } = req.body;
  const code = generateVerificationCode();

  const mailOptions = {
    from: 'rongentica05@gmail.com',
    to: to,
    subject: 'Your Verification Code',
    text: `Your verification code is ${code}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          max-width: 100px;
        }
        .content {
          text-align: center;
        }
        .content h1 {
          color: #333333;
        }
        .content p {
          color: #666666;
        }
        .code {
          display: inline-block;
          font-size: 24px;
          font-weight: bold;
          background-color: #333333;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
        <img src="https://github.com/ErebuzDark/Livrarian-Myth/blob/main/Livrarian%20Myth/src/assets/header-assets/logo.png?raw=true" alt="logo">
          <h1>LIVRARIAN MYTH</h1>
        </div>
        <div class="content">
          <h1>This is your Change Password verification code</h1>
          <p>Please use the following code to verify your account:</p>
          <div class="code">${code}</div>
          <p>NOTE: If this is not you, just ignore the message.</p>
        </div>
        
      </div>
    </body>
    </html>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully', code: code });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});


app.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword, verificationCode, sentCode } = req.body;

  if (verificationCode !== sentCode) {
    return res.status(401).json({message : 'Invalid verification code'});
  }

  db.query('SELECT * FROM accounts WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(402).send('User not found');
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(403).send('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    db.query('UPDATE accounts SET password = ? WHERE email = ?', [hashedNewPassword, email], (err, results) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(200).json({ message: 'Password changed successfully' });
    });
  });
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

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
