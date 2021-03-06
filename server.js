const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 5000;

//Connect Database
connectDB();

// Initialize Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('API Running');
});

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
