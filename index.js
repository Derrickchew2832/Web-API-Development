require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const cors = require('cors');
const app = express();
const path = require('path');

connectDB();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
// Define routes
app.use('/api', apiRoutes);
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'public')));
// Serve main page as the default
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
