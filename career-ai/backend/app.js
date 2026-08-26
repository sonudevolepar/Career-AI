// backend/app.js
const express = require('express');
const cors = require('cors');

// 1. Routes ko import karein
const resumeRoutes = require('./routes/resumeRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

// 2. App initialize karein (Ye pehle aana chahiye)
const app = express();

// 3. Middleware apply karein
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Endpoints set karein (Middleware ke baad)

// update code push githup
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Career AI Backend API is running successfully' });
});

module.exports = app;