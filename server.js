const express = require('express');
const app = express();
const db = require('./db'); // Import the database connection  
require('dotenv').config(); // Load environment variables from .env file
const passport = require('./auth'); // Import passport configuration

const personRoutes = require('./routes/personRoutes'); // Import person routes
const menuRoutes = require('./routes/menuRoutes'); // Import menu routes 

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Middleware to parse JSON bodies 
const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000 

app.use(passport.initialize()); // Initialize passport middleware
const localMdidleware = passport.authenticate('local', { session: false }); // Use local strategy for authentication

app.get('/', function (req, res) {
  res.send('Welcome to the Restaurant API');
});

app.use('/person',personRoutes); // Use person routes under /api 
app.use('/menu', menuRoutes); // Use menu routes under /menu

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});