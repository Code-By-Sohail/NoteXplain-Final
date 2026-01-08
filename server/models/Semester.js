import mongoose from 'mongoose';

const TopicSchema = new mongoose.Schema({
    id: String,
    title: String,
    content: String
});

const ChapterSchema = new mongoose.Schema({
    id: String,
    title: String,
    topics: [TopicSchema]
});

const SubjectSchema = new mongoose.Schema({
    id: String,
    title: String,
    chapters: [ChapterSchema]
});

const SemesterSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    description: String,
    subjects: [SubjectSchema]
});

export const Semester = mongoose.model('Semester', SemesterSchema);
