import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Semester } from './models/Semester.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large JSON

// Database Connection (Optional now)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/api/semesters', async (req, res) => {
    try {
        const semesters = await Semester.find({}, 'id title description subjects.id subjects.title subjects.chapters.length');
        res.json(semesters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/semesters/:id', async (req, res) => {
    try {
        const semester = await Semester.findOne({ id: req.params.id });
        if (!semester) return res.status(404).json({ message: 'Semester not found' });
        res.json(semester);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET RAW DATA for Admin Panel
app.get('/api/course-data', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../src/data.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ message: 'Failed to read data' });
    }
});

// Manual Save Endpoint
app.post('/api/save', (req, res) => {
    try {
        const newData = req.body;
        const filePath = path.join(__dirname, '../src/data.json');

        fs.writeFileSync(filePath, JSON.stringify(newData, null, 4));
        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ message: 'Failed to save data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
