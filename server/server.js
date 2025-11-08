// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db'); // Import the connect function
const contactsRouter = require('./routes/contacts');
const destinationsRouter = require('./routes/destinations');
const vehiclesRouter = require('./routes/vehicles');
const adminRouter = require('./routes/admin');
const Admin = require('./models/Admin');

const app = express();

app.use(cors({
  origin: [
    'https://demooo12.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true,
}));
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Connect to database using your db.js setup
connectDB();

// Create default admin user
Admin.createDefaultAdmin();

// Use routes
app.use('/api/contacts', contactsRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
