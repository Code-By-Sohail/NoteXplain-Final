import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import ArticleView from './components/ArticleView';
import SemesterSelect from './components/SemesterSelect';
import SubjectSelect from './components/SubjectSelect';
import AdminGenerator from './components/AdminGenerator';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import { courseData } from './data';

// Helper component to redirect to the first topic of the selected subject
const SubjectRedirect = () => {
  const { semesterId, subjectId } = useParams();
  const semester = courseData.find(s => s.id === semesterId);
  const subject = semester?.subjects.find(s => s.id === subjectId);

  if (!subject) return <Navigate to={`/${semesterId}`} replace />;

  const firstChapter = subject.chapters[0];
  const firstTopic = firstChapter?.topics[0];

  if (firstTopic) {
    return <Navigate to={`${firstChapter.id}/${firstTopic.id}`} replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">No Content Available</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">This subject doesn't have any topics yet.</p>
    </div>
  );
};

import { ThemeProvider } from './components/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* About Us Route */}
          <Route path="/about" element={<AboutUs />} />

          {/* Privacy Policy Route */}
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Semester Selection Route (Moved from /) */}
          <Route path="/semesters" element={<SemesterSelect />} />

          {/* Admin Path - Only available in development mode */}
          {import.meta.env.DEV && (
            <Route path="/admin" element={<AdminGenerator />} />
          )}

          {/* Subject Selection Page */}
          <Route path="/:semesterId" element={<SubjectSelect />} />

          {/* Content Routes (Wrapped in Layout) */}
          <Route path="/:semesterId/:subjectId" element={<Layout />}>
            <Route index element={<SubjectRedirect />} />
            <Route path=":chapterId/:topicId" element={<ArticleView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
