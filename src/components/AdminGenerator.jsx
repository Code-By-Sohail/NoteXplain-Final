import React, { useState, useEffect, useRef } from 'react';
import { FileJson, Save, Loader, Layers, BookOpen, FileText, MonitorPlay, Trash2, RefreshCw, Lock, LogOut, Edit3, PlusCircle, AlertCircle, FlaskConical } from 'lucide-react';
import SelectionCard from './SelectionCard'; // Import the new component
import LockContentDashboard from './LockContentDashboard';

const ADMIN_KEY = "admin123";

const AdminGenerator = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [passwordInput, setPasswordInput] = useState("");
    const [authError, setAuthError] = useState(false);

    // Data State
    const [courseData, setCourseData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [view, setView] = useState('create'); // 'create' | 'edit' | 'delete'
    const [mode, setMode] = useState('semester'); // 'semester', 'subject', 'chapter', 'topic'
    const [saving, setSaving] = useState(false);

    // Parent Selection State (Using Indices for Uniqueness)
    const [semIndex, setSemIndex] = useState(0);
    const [subIndex, setSubIndex] = useState('');
    const [chapIndex, setChapIndex] = useState('');
    const [topicIndex, setTopicIndex] = useState('');
    const [practicalIndex, setPracticalIndex] = useState('');

    // Confirmation Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);

    // Form State (Create/Edit Mode)
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        content: ''
    });

    // Check Auth on Mount - Session-based (no persistence)
    useEffect(() => {
        if (!isAuthenticated) {
            setLoadingData(false);
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_KEY) {
            setIsAuthenticated(true);
            setAuthError(false);
            fetchData();
        } else {
            setAuthError(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPasswordInput("");
    };

    // Fetch Data
    const fetchData = async () => {
        setLoadingData(true);
        try {
            const res = await fetch(`http://localhost:5000/api/course-data?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setCourseData(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingData(false);
        }
    };

    // Trigger fetch on mount if already authenticated (Testing Mode)
    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    // Auto-fill Form Data in Edit Mode
    useEffect(() => {
        if (view === 'edit' && courseData.length > 0) {
            let item = null;
            if (mode === 'semester' && courseData[semIndex]) {
                item = courseData[semIndex];
            } else if (mode === 'subject' && courseData[semIndex]?.subjects[subIndex]) {
                item = courseData[semIndex].subjects[subIndex];
            } else if (mode === 'chapter' && courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]) {
                item = courseData[semIndex].subjects[subIndex].chapters[chapIndex];
            } else if (mode === 'topic' && courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics[topicIndex]) {
                item = courseData[semIndex].subjects[subIndex].chapters[chapIndex].topics[topicIndex];
            } else if (mode === 'practical' && courseData[semIndex]?.subjects[subIndex]?.practicals[practicalIndex]) {
                item = courseData[semIndex].subjects[subIndex].practicals[practicalIndex];
            }

            if (item) {
                setFormData({
                    id: item.id || '',
                    title: item.title || '',
                    description: item.description || '',
                    content: item.content || ''
                });
            } else {
                setFormData({ id: '', title: '', description: '', content: '' });
            }
        } else if (view === 'create') {
            setFormData({ id: '', title: '', description: '', content: '' });
        }
    }, [view, mode, semIndex, subIndex, chapIndex, topicIndex, practicalIndex, courseData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveToServer = async (newData) => {
        setSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });

            if (response.ok) {
                setCourseData(newData);
                alert('Saved successfully!');
            } else {
                const err = await response.text();
                alert('Failed to save: ' + err);
            }
        } catch (error) {
            alert('Error saving data: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const textareaRef = useRef(null);

    const insertContent = (textToInsert) => {
        const textarea = textareaRef.current;
        if (!textarea) {
            // Fallback if ref not set (shouldn't happen)
            setFormData(prev => ({ ...prev, content: prev.content + textToInsert }));
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = formData.content;
        const scrollPos = textarea.scrollTop;

        // Insert text
        const newContent = currentContent.substring(0, start) + textToInsert + currentContent.substring(end);

        // Update state
        setFormData(prev => ({ ...prev, content: newContent }));

        // Restore cursor position and focus
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + textToInsert.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.scrollTop = scrollPos;
        }, 0);
    };

    const handleSave = async () => {
        try {
            const newData = JSON.parse(JSON.stringify(courseData));
            let { id, title, description, content } = formData;

            if (!title) {
                alert("Title is required.");
                return;
            }

            // Auto-generate ID if empty/hidden
            if (!id) {
                id = title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            if (view === 'create') {
                if (mode === 'semester') {
                    newData.push({ id, title, description, subjects: [] });
                }
                else if (mode === 'subject') {
                    if (newData[semIndex]) newData[semIndex].subjects.push({ id, title, chapters: [] });
                }
                else if (mode === 'chapter') {
                    if (newData[semIndex]?.subjects[subIndex]) newData[semIndex].subjects[subIndex].chapters.push({ id, title, topics: [], practicals: [] });
                }
                else if (mode === 'topic') {
                    if (newData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]) newData[semIndex].subjects[subIndex].chapters[chapIndex].topics.push({ id, title, content });
                }
                else if (mode === 'practical') {
                    if (newData[semIndex]?.subjects[subIndex]) {
                        // Ensure practicals array exists
                        if (!newData[semIndex].subjects[subIndex].practicals) {
                            newData[semIndex].subjects[subIndex].practicals = [];
                        }
                        newData[semIndex].subjects[subIndex].practicals.push({ id, title, content });
                    }
                }
            } else if (view === 'edit') {
                if (mode === 'semester' && newData[semIndex]) {
                    newData[semIndex] = { ...newData[semIndex], id, title, description };
                }
                else if (mode === 'subject' && newData[semIndex]?.subjects[subIndex]) {
                    newData[semIndex].subjects[subIndex] = { ...newData[semIndex].subjects[subIndex], id, title };
                }
                else if (mode === 'chapter' && newData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]) {
                    newData[semIndex].subjects[subIndex].chapters[chapIndex] = { ...newData[semIndex].subjects[subIndex].chapters[chapIndex], id, title };
                }
                else if (mode === 'topic') {
                    if (newData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics[topicIndex]) {
                        newData[semIndex].subjects[subIndex].chapters[chapIndex].topics[topicIndex] = { ...newData[semIndex].subjects[subIndex].chapters[chapIndex].topics[topicIndex], id, title, content };
                    } else {

                        alert(`Error: Item not found at the selected path. Please refresh and try again.`);
                        return;
                    }
                }
                else if (mode === 'practical' && newData[semIndex]?.subjects[subIndex]?.practicals[practicalIndex]) {
                    newData[semIndex].subjects[subIndex].practicals[practicalIndex] = { ...newData[semIndex].subjects[subIndex].practicals[practicalIndex], id, title, content };
                }
            }

            await saveToServer(newData);
        } catch (e) {
            alert('Error processing request: ' + e.message);
        }
    };

    const handleDelete = async () => {
        // Validation Chain
        if (semIndex === '' || semIndex === null) {
            alert('⚠️ Please select a Semester first.');
            return;
        }

        if (['subject', 'chapter', 'topic', 'practical'].includes(mode) && (subIndex === '' || subIndex === null)) {
            alert('⚠️ Please select a Subject first.');
            return;
        }

        if (['chapter', 'topic'].includes(mode) && (chapIndex === '' || chapIndex === null)) {
            alert('⚠️ Please select a Chapter first.');
            return;
        }

        if (mode === 'topic' && (topicIndex === '' || topicIndex === null)) {
            alert('⚠️ Please select a Topic to delete.');
            return;
        }

        if (mode === 'practical' && (practicalIndex === '' || practicalIndex === null)) {
            alert('⚠️ Please select a Practical to delete.');
            return;
        }

        // Get item name for confirmation
        const itemName = mode === 'semester' ? courseData[semIndex]?.title :
            mode === 'subject' ? courseData[semIndex]?.subjects[subIndex]?.title :
                mode === 'chapter' ? courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.title :
                    mode === 'practical' ? courseData[semIndex]?.subjects[subIndex]?.practicals[practicalIndex]?.title :
                        courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics[topicIndex]?.title;

        // Show custom confirmation modal instead of window.confirm
        setConfirmCallback(() => async () => {
            setShowConfirmModal(false);

            try {
                const newData = JSON.parse(JSON.stringify(courseData));

                if (mode === 'semester' && newData[semIndex]) {
                    newData.splice(semIndex, 1);
                }
                else if (mode === 'subject' && newData[semIndex]?.subjects[subIndex]) {
                    newData[semIndex].subjects.splice(subIndex, 1);
                }
                else if (mode === 'chapter' && newData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]) {
                    newData[semIndex].subjects[subIndex].chapters.splice(chapIndex, 1);
                }
                else if (mode === 'topic' && newData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics[topicIndex]) {
                    newData[semIndex].subjects[subIndex].chapters[chapIndex].topics.splice(topicIndex, 1);
                }
                else if (mode === 'practical' && newData[semIndex]?.subjects[subIndex]?.practicals[practicalIndex]) {
                    newData[semIndex].subjects[subIndex].practicals.splice(practicalIndex, 1);
                }
                else {
                    alert("Could not find the item to delete. Please refresh and try again.");
                    return;
                }

                await saveToServer(newData);

                // Reset indices after successful deletion
                if (mode === 'semester') {
                    setSemIndex(0);
                    setSubIndex('');
                    setChapIndex('');
                    setTopicIndex('');
                    setPracticalIndex('');
                } else if (mode === 'subject') {
                    setSubIndex('');
                    setChapIndex('');
                    setTopicIndex('');
                    setPracticalIndex('');
                } else if (mode === 'chapter') {
                    setChapIndex('');
                    setTopicIndex('');
                } else if (mode === 'topic') {
                    setTopicIndex('');
                } else if (mode === 'practical') {
                    setPracticalIndex('');
                }
            } catch (e) {
                alert('Error deleting: ' + e.message);
            }
        });

        setShowConfirmModal(true);
    };

    const handleLockToggle = async () => {
        // Validation Chain
        if (semIndex === '' || semIndex === null) {
            alert('⚠️ Please select a Semester first.');
            return;
        }

        if (['subject', 'chapter', 'topic', 'practical'].includes(mode) && (subIndex === '' || subIndex === null)) {
            alert('⚠️ Please select a Subject first.');
            return;
        }

        if (['chapter', 'topic'].includes(mode) && (chapIndex === '' || chapIndex === null)) {
            alert('⚠️ Please select a Chapter first.');
            return;
        }

        if (mode === 'topic' && (topicIndex === '' || topicIndex === null)) {
            alert('⚠️ Please select a Topic to lock/unlock.');
            return;
        }

        if (mode === 'practical' && (practicalIndex === '' || practicalIndex === null)) {
            alert('⚠️ Please select a Practical to lock/unlock.');
            return;
        }

        try {
            const newData = JSON.parse(JSON.stringify(courseData));
            let item = null;

            // Get the item to toggle
            if (mode === 'semester' && newData[semIndex]) {
                item = newData[semIndex];
            }
            else if (mode === 'subject' && newData[semIndex]?.subjects[subIndex]) {
                item = newData[semIndex].subjects[subIndex];
            }
            else if (mode === 'chapter' && newData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]) {
                item = newData[semIndex].subjects[subIndex].chapters[chapIndex];
            }
            else if (mode === 'topic' && newData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics[topicIndex]) {
                item = newData[semIndex].subjects[subIndex].chapters[chapIndex].topics[topicIndex];
            }
            else if (mode === 'practical' && newData[semIndex]?.subjects[subIndex]?.practicals[practicalIndex]) {
                item = newData[semIndex].subjects[subIndex].practicals[practicalIndex];
            }
            else {
                alert("Could not find the item. Please refresh and try again.");
                return;
            }

            // Toggle locked status
            item.locked = !item.locked;
            const action = item.locked ? 'locked' : 'unlocked';

            await saveToServer(newData);
            alert(`✅ Successfully ${action} "${item.title}"!`);
        } catch (e) {
            alert('Error toggling lock: ' + e.message);
        }
    };

    // Helper safely accesses data using indices
    const getSubjects = () => courseData[semIndex]?.subjects || [];
    const getChapters = () => courseData[semIndex]?.subjects[subIndex]?.chapters || [];
    const getTopics = () => courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics || [];
    const getPracticals = () => courseData[semIndex]?.subjects[subIndex]?.practicals || [];

    // Options for Select
    const options = [
        { id: 'semester', icon: Layers, label: 'Semester' },
        { id: 'subject', icon: BookOpen, label: 'Subject' },
        { id: 'chapter', icon: FileText, label: 'Chapter' },
        { id: 'topic', icon: MonitorPlay, label: 'Topic' },
        { id: 'practical', icon: FlaskConical, label: 'Practical' },
    ];

    // View Config
    const viewConfig = {
        create: { color: 'emerald', icon: PlusCircle, label: 'Create New' },
        edit: { color: 'blue', icon: Edit3, label: 'Edit Existing' },
        delete: { color: 'red', icon: Trash2, label: 'Delete' },
        lock: { color: 'orange', icon: Lock, label: 'Lock Content' }
    };

    const currentConfig = viewConfig[view];

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-[#212121] p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-borderDark text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-500 mb-8">Enter your secure key to access content management.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Admin Key"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all text-center tracking-widest font-mono"
                        />
                        {authError && <p className="text-red-500 text-sm font-medium flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> Incorrect Key!</p>}

                        <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loadingData) return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-emerald-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#181818] p-6 md:p-12 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg">
                                <FileJson className="w-8 h-8 text-white" />
                            </div>
                            Content Manager
                        </h1>
                        <p className="text-sm text-gray-500 mt-2 ml-16 flex items-center gap-2">
                            Live Mode • <button onClick={fetchData} className="text-emerald-600 font-medium hover:underline flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Refresh Data</button>
                        </p>
                    </div>

                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>

                {/* Mode Tabs */}
                <div className="bg-white dark:bg-[#212121] p-2 rounded-2xl border border-gray-200 dark:border-borderDark flex shadow-lg mb-8 gap-2">
                    {['create', 'edit', 'delete', 'lock'].map(v => {
                        const config = viewConfig[v];
                        const Icon = config.icon;
                        const isActive = view === v;
                        const colors = {
                            emerald: '#059669',
                            blue: '#3b82f6',
                            red: '#ef4444',
                            orange: '#f97316'
                        };
                        return (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all flex items-center justify-center gap-2 ${isActive
                                    ? `bg-${config.color}-500 text-white shadow-md`
                                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                    }`}
                                style={isActive ? { backgroundColor: colors[config.color] } : {}}
                            >
                                <Icon className="w-5 h-5" />
                                {config.label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Render Lock Content Dashboard when in lock view */}
                    {view === 'lock' ? (
                        <div className="xl:col-span-3">
                            <LockContentDashboard
                                courseData={courseData}
                                setCourseData={setCourseData}
                                onSave={saveToServer}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="xl:col-span-2 space-y-6">
                                {/* STEP 1: Select Type */}
                                <div className="bg-white dark:bg-[#212121] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-borderDark">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-emerald-600/20 text-emerald-500 border border-emerald-600/30 text-xs font-bold rounded-full">STEP 1</span>
                                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Select Content Type</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {options.map(opt => (
                                            <SelectionCard
                                                key={opt.id}
                                                icon={opt.icon}
                                                title={opt.label}
                                                onClick={() => setMode(opt.id)}
                                                isActive={mode === opt.id}
                                                activeColor={currentConfig.color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* STEP 2: Details */}
                                <div className="bg-white dark:bg-[#212121] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-borderDark">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-emerald-600/20 text-emerald-500 border border-emerald-600/30 text-xs font-bold rounded-full">STEP 2</span>
                                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                            {view === 'create' ? `Add New ${mode.charAt(0).toUpperCase() + mode.slice(1)}` :
                                                view === 'edit' ? `Select & Edit ${mode.charAt(0).toUpperCase() + mode.slice(1)}` :
                                                    `Select ${mode.charAt(0).toUpperCase() + mode.slice(1)} to Delete`}
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Semester Dropdown */}
                                        {(mode !== 'semester' || view !== 'create') && courseData.length > 0 && (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">📚 Semester</label>
                                                <select
                                                    value={semIndex}
                                                    onChange={e => {
                                                        setSemIndex(Number(e.target.value));
                                                        setSubIndex('');
                                                        setChapIndex('');
                                                        setTopicIndex('');
                                                        setPracticalIndex('');
                                                    }}
                                                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#181818] dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                                >
                                                    {courseData.map((s, i) => <option key={i} value={i}>{s.title || s.id}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {/* Subject Dropdown */}
                                        {((mode === 'chapter' || mode === 'topic' || mode === 'practical' || (view !== 'create' && mode === 'subject'))) && (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">📖 Subject</label>
                                                <select
                                                    value={subIndex}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setSubIndex(val === '' ? '' : Number(val));
                                                        setChapIndex('');
                                                        setTopicIndex('');
                                                        setPracticalIndex('');
                                                    }}
                                                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#181818] dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                                >
                                                    <option value="">-- Select Subject --</option>
                                                    {getSubjects().map((s, i) => <option key={i} value={i}>{s.title || s.id}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {/* Chapter Dropdown */}
                                        {((mode === 'topic' || (view !== 'create' && mode === 'chapter'))) && (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">📄 Chapter</label>
                                                <select
                                                    value={chapIndex}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setChapIndex(val === '' ? '' : Number(val));
                                                        setTopicIndex('');
                                                    }}
                                                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#181818] dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                                >
                                                    <option value="">-- Select Chapter --</option>
                                                    {getChapters().map((c, i) => <option key={i} value={i}>{c.title || c.id}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {/* Topic Dropdown */}
                                        {(view !== 'create' && mode === 'topic') && (
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-2" style={{ color: currentConfig.color === 'red' ? '#ef4444' : '#3b82f6' }}>
                                                    🎯 Topic to {view === 'edit' ? 'Edit' : 'Delete'}
                                                </label>
                                                <select
                                                    value={topicIndex}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setTopicIndex(val === '' ? '' : Number(val));
                                                    }}
                                                    className="w-full p-3 border-2 rounded-xl bg-white dark:bg-[#181818] dark:text-white focus:ring-4 transition-all"
                                                    style={{
                                                        borderColor: currentConfig.color === 'red' ? '#fecaca' : '#bfdbfe',
                                                        focusBorderColor: currentConfig.color === 'red' ? '#ef4444' : '#3b82f6'
                                                    }}
                                                >
                                                    <option value="">-- Select Topic --</option>
                                                    {getTopics().map((t, i) => <option key={i} value={i}>{t.title || t.id}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {/* Practical Dropdown (ADDED) */}
                                        {(view !== 'create' && mode === 'practical') && (
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-2" style={{ color: currentConfig.color === 'red' ? '#ef4444' : '#3b82f6' }}>
                                                    🧪 Practical to {view === 'edit' ? 'Edit' : 'Delete'}
                                                </label>
                                                <select
                                                    value={practicalIndex}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setPracticalIndex(val === '' ? '' : Number(val));
                                                    }}
                                                    className="w-full p-3 border-2 rounded-xl bg-white dark:bg-[#181818] dark:text-white focus:ring-4 transition-all"
                                                    style={{
                                                        borderColor: currentConfig.color === 'red' ? '#fecaca' : '#bfdbfe',
                                                        focusBorderColor: currentConfig.color === 'red' ? '#ef4444' : '#3b82f6'
                                                    }}
                                                >
                                                    <option value="">-- Select Practical --</option>
                                                    {getPracticals().map((p, i) => <option key={i} value={i}>{p.title || p.id}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Form Inputs (Create & Edit) */}
                                    {view !== 'delete' && (
                                        <div className="space-y-4 pt-6 mt-6 border-t-2 border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 bg-emerald-600/20 text-emerald-500 border border-emerald-600/30 text-xs font-bold rounded-full">STEP 3</span>
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Fill Details</h3>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {/* ID Input Removed - Auto Generated */}
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">✏️ Title</label>
                                                    <input
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g. Introduction to Arrays"
                                                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-[#181818] dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">Display name shown to users</p>
                                                </div>
                                            </div>

                                            {(mode === 'semester') && (
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">📝 Description</label>
                                                    <textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        placeholder="A brief description of this semester..."
                                                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-[#181818] dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all"
                                                    />
                                                </div>
                                            )}

                                            {(mode === 'topic' || mode === 'practical') && (
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">📄 Markdown Content</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => insertContent("**Bold Text** ")}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626] transition-colors"
                                                                title="Bold Text"
                                                            >
                                                                Bold
                                                            </button>
                                                            <button
                                                                onClick={() => insertContent("\n> [!TIP]\n> **Pro Tip:** Your text here.\n")}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
                                                                title="Insert Premium Alert"
                                                            >
                                                                ✨ Pro Tip
                                                            </button>
                                                            <button
                                                                onClick={() => insertContent("\n| Feature | Static | Dynamic |\n| :--- | :--- | :--- |\n| **Definition** | Fixed | Flexible |\n| **Cost** | Low | High |\n")}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                                                                title="Insert Glass Table"
                                                            >
                                                                🪟 Glass Table
                                                            </button>
                                                            <button
                                                                onClick={() => insertContent('\n<mark>Highlight Text</mark> ')}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white border border-emerald-600 rounded-lg hover:bg-emerald-600 transition-colors"
                                                                title="Highlight Text (Theme Color)"
                                                            >
                                                                🎨 Highlight
                                                            </button>
                                                            <button
                                                                onClick={() => insertContent("\n```output\nOutput Text\n```\n")}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-gray-700 text-gray-200 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
                                                                title="Insert Output Block"
                                                            >
                                                                📟 Output
                                                            </button>
                                                            <button
                                                                onClick={() => insertContent("\n*   **Item 1:** Description.\n*   **Item 2:** Description.\n")}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-lg text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                                                                title="Insert Styled List"
                                                            >
                                                                📋 Styled List
                                                            </button>
                                                            <button
                                                                onClick={() => insertContent("\n```python\n# Your code here\nprint('Hello')\n```\n")}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#262626] transition-colors"
                                                                title="Insert Code Block"
                                                            >
                                                                💻 Code
                                                            </button>
                                                            <button
                                                                onClick={() => insertContent("\n![Image Caption](https://example.com/image.jpg)\n")}
                                                                className="px-3 py-1.5 text-xs font-semibold bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800/50 rounded-lg text-pink-700 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-colors"
                                                                title="Insert Image"
                                                            >
                                                                🖼️ Image
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        ref={textareaRef}
                                                        name="content"
                                                        value={formData.content}
                                                        onChange={handleInputChange}
                                                        rows="25"
                                                        placeholder="# Heading&#10;&#10;Your markdown content here...&#10;&#10;```language&#10;code block&#10;```"
                                                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm dark:bg-[#181818] dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium leading-relaxed"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: Action Panel */}
                            <div className="xl:col-span-1">
                                <div
                                    className="bg-white dark:bg-[#212121] p-6 rounded-2xl shadow-xl border-2 flex flex-col justify-center items-center text-center sticky top-6"
                                    style={{ borderColor: currentConfig.color === 'emerald' ? '#10b981' : currentConfig.color === 'blue' ? '#3b82f6' : '#ef4444' }}
                                >
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                                        style={{ backgroundColor: currentConfig.color === 'emerald' ? '#d1fae5' : currentConfig.color === 'blue' ? '#dbeafe' : currentConfig.color === 'orange' ? '#ffedd5' : '#fee2e2' }}
                                    >
                                        <currentConfig.icon
                                            className="w-8 h-8"
                                            style={{ color: currentConfig.color === 'emerald' ? '#10b981' : currentConfig.color === 'blue' ? '#3b82f6' : currentConfig.color === 'orange' ? '#f97316' : '#ef4444' }}
                                        />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                        {view === 'delete' ? 'Delete Mode' : view === 'edit' ? 'Update Content' : view === 'lock' ? 'Lock/Unlock Content' : 'Create New Content'}
                                    </h3>

                                    <p className="text-gray-500 mb-6 text-xs leading-relaxed max-w-[200px]">
                                        {view === 'delete'
                                            ? 'Select the item you want to remove and confirm deletion.'
                                            : view === 'edit'
                                                ? 'Modify the selected item and save your changes.'
                                                : view === 'lock'
                                                    ? 'Lock content to prevent user access or unlock to make it available.'
                                                    : 'Fill in the details above and click to save.'}
                                    </p>

                                    <button
                                        onClick={view === 'delete' ? handleDelete : view === 'lock' ? handleLockToggle : handleSave}
                                        disabled={saving}
                                        className="w-full text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                        style={{
                                            backgroundColor: currentConfig.color === 'emerald' ? '#059669' : currentConfig.color === 'blue' ? '#3b82f6' : currentConfig.color === 'orange' ? '#f97316' : '#ef4444'
                                        }}
                                    >
                                        {saving ? (
                                            <><Loader className="animate-spin w-4 h-4" /> Processing...</>
                                        ) : view === 'delete' ? (
                                            <><Trash2 className="w-4 h-4" /> Delete Forever</>
                                        ) : view === 'edit' ? (
                                            <><Save className="w-4 h-4" /> Update Changes</>
                                        ) : view === 'lock' ? (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                {(() => {
                                                    let item = null;
                                                    if (mode === 'semester') item = courseData[semIndex];
                                                    else if (mode === 'subject') item = courseData[semIndex]?.subjects[subIndex];
                                                    else if (mode === 'chapter') item = courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex];
                                                    else if (mode === 'topic') item = courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics[topicIndex];
                                                    else if (mode === 'practical') item = courseData[semIndex]?.subjects[subIndex]?.practicals[practicalIndex];
                                                    return item?.locked ? 'Unlock Content' : 'Lock Content';
                                                })()}
                                            </>
                                        ) : (
                                            <><PlusCircle className="w-4 h-4" /> Save New {mode.charAt(0).toUpperCase() + mode.slice(1)}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Custom Confirmation Modal */}
                    {showConfirmModal && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowConfirmModal(false)}>
                            <div className="bg-white dark:bg-[#212121] p-8 rounded-3xl shadow-2xl border-2 border-red-500 max-w-md w-full animate-[scale-in_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                                    Confirm Deletion
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                    Are you sure you want to permanently delete <strong className="text-red-600">"{
                                        mode === 'semester' ? courseData[semIndex]?.title :
                                            mode === 'subject' ? courseData[semIndex]?.subjects[subIndex]?.title :
                                                mode === 'chapter' ? courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.title :
                                                    mode === 'practical' ? courseData[semIndex]?.subjects[subIndex]?.practicals[practicalIndex]?.title :
                                                        courseData[semIndex]?.subjects[subIndex]?.chapters[chapIndex]?.topics[topicIndex]?.title
                                    }"</strong>?
                                    <br />
                                    <span className="text-sm font-semibold text-red-600 mt-2 block">This action cannot be undone!</span>
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmCallback}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminGenerator;
