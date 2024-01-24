const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

// Configure security middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(helmet()); // Set security headers

// Define routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
//app.use('/chat', chatRoutes);
// Add routes for other entities (doctors, appointments, files) as needed

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
