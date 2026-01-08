
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.json');

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    let updatedCount = 0;

    data.forEach(semester => {
        semester.subjects.forEach(subject => {
            if (subject.chapters) {
                subject.chapters.forEach(chapter => {
                    if (!chapter.practicals) {
                        chapter.practicals = [];
                        updatedCount++;
                    }
                });
            }
        });
    });

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
    console.log(`Successfully updated ${updatedCount} chapters with 'practicals' array.`);
} catch (error) {
    console.error('Error migrating data:', error);
}
