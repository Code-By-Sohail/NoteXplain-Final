import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Semester } from './models/Semester.js';
import { courseData } from '../src/data.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB Connected for Seeding');

        // clear existing data
        await Semester.deleteMany({});
        console.log('Cleared existing data');

        // insert new data
        await Semester.insertMany(courseData);
        console.log('Data Imported Successfully');

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
