
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.json');

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Inject into Semester 1 -> Subject 1 (assuming it exists, or create if needed)
    // Actually, I need to find a subject that has chapters.
    // The previous subagent might have created 'Physics' -> 'Mechanics'. 
    // Let's check if they exist.

    let semester = data.find(s => s.id === 'semester-1');
    if (semester) {
        if (!semester.subjects) semester.subjects = [];
        let subject = semester.subjects.find(s => s.title === 'Physics');
        if (!subject) {
            subject = { id: 'physics', title: 'Physics', chapters: [] };
            semester.subjects.push(subject);
        }

        let chapter = subject.chapters.find(c => c.title === 'Mechanics');
        if (!chapter) {
            chapter = { id: 'mechanics', title: 'Mechanics', topics: [], practicals: [] };
            subject.chapters.push(chapter);
        }

        if (!chapter.practicals) chapter.practicals = [];

        // Add dummy practical
        chapter.practicals.push({
            id: 'lab-1',
            title: 'Lab 1: Velocity',
            content: '# Lab 1: Measuring Velocity\n\nThis is a sample practical.'
        });

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
        console.log('Injected dummy practical into Semester 1 -> Physics -> Mechanics');
    } else {
        console.log('Semester 1 not found');
    }

} catch (error) {
    console.error('Error injecting data:', error);
}
