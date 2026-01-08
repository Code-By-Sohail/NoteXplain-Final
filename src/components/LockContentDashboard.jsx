import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Lock, Unlock, Layers, BookOpen, FileText, FlaskConical, MonitorPlay, Search, Filter, Loader, AlertCircle } from 'lucide-react';

const LockContentDashboard = ({ courseData, setCourseData, onSave }) => {
    const [expandedNodes, setExpandedNodes] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMode, setFilterMode] = useState('all'); // 'all' | 'locked' | 'unlocked'
    const [saving, setSaving] = useState(null); // Stores the path being saved

    // Toggle node expansion
    const toggleNode = (path) => {
        setExpandedNodes(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };

    // Expand all nodes
    const expandAll = () => {
        const newExpanded = {};
        courseData.forEach((sem, semIdx) => {
            newExpanded[`sem-${semIdx}`] = true;
            sem.subjects?.forEach((sub, subIdx) => {
                newExpanded[`sem-${semIdx}-sub-${subIdx}`] = true;
                sub.chapters?.forEach((chap, chapIdx) => {
                    newExpanded[`sem-${semIdx}-sub-${subIdx}-chap-${chapIdx}`] = true;
                });
            });
        });
        setExpandedNodes(newExpanded);
    };

    // Collapse all nodes
    const collapseAll = () => {
        setExpandedNodes({});
    };

    // Handle lock toggle
    const handleLockToggle = async (type, indices, currentLocked) => {
        const path = JSON.stringify({ type, indices });
        setSaving(path);

        try {
            const newData = JSON.parse(JSON.stringify(courseData));
            let item = null;

            const { semIdx, subIdx, chapIdx, topicIdx, practicalIdx } = indices;

            if (type === 'semester') {
                item = newData[semIdx];
            } else if (type === 'subject') {
                item = newData[semIdx]?.subjects?.[subIdx];
            } else if (type === 'chapter') {
                item = newData[semIdx]?.subjects?.[subIdx]?.chapters?.[chapIdx];
            } else if (type === 'topic') {
                item = newData[semIdx]?.subjects?.[subIdx]?.chapters?.[chapIdx]?.topics?.[topicIdx];
            } else if (type === 'practical') {
                item = newData[semIdx]?.subjects?.[subIdx]?.practicals?.[practicalIdx];
            }

            if (item) {
                item.locked = !currentLocked;
                await onSave(newData);
                setCourseData(newData);
            }
        } catch (error) {
            console.error('Error toggling lock:', error);
            alert('⚠️ Error toggling lock: ' + error.message);
        } finally {
            setSaving(null);
        }
    };

    // Check if any content in tree contains search query
    const containsSearchQuery = (item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();

        // Check this item
        if ((item.title || item.id || '').toLowerCase().includes(query)) return true;

        // Check subjects
        if (item.subjects?.some(sub => {
            if ((sub.title || sub.id || '').toLowerCase().includes(query)) return true;
            // Check chapters
            if (sub.chapters?.some(chap => {
                if ((chap.title || chap.id || '').toLowerCase().includes(query)) return true;
                // Check topics
                if (chap.topics?.some(topic =>
                    (topic.title || topic.id || '').toLowerCase().includes(query)
                )) return true;
                return false;
            })) return true;
            // Check practicals under subject
            if (sub.practicals?.some(prac =>
                (prac.title || prac.id || '').toLowerCase().includes(query)
            )) return true;
            return false;
        })) return true;

        // Check chapters (if item is subject)
        if (item.chapters?.some(chap => {
            if ((chap.title || chap.id || '').toLowerCase().includes(query)) return true;
            if (chap.topics?.some(topic =>
                (topic.title || topic.id || '').toLowerCase().includes(query)
            )) return true;
            return false;
        })) return true;

        // Check practicals (if item is subject)
        if (item.practicals?.some(prac =>
            (prac.title || prac.id || '').toLowerCase().includes(query)
        )) return true;

        // Check topics (if item is chapter)
        if (item.topics?.some(topic =>
            (topic.title || topic.id || '').toLowerCase().includes(query)
        )) return true;

        return false;
    };

    // Filter content based on search and filter mode
    const filterMatch = (item, isLocked) => {
        const matchesSearch = containsSearchQuery(item);
        const matchesFilter = filterMode === 'all' ||
            (filterMode === 'locked' && isLocked) ||
            (filterMode === 'unlocked' && !isLocked);
        return matchesSearch && matchesFilter;
    };

    // Toggle Switch Component
    const ToggleSwitch = ({ isLocked, onToggle, isSaving, size = 'normal' }) => {
        const width = size === 'small' ? 'w-10' : 'w-12';
        const height = size === 'small' ? 'h-5' : 'h-6';
        const knobSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
        const translate = size === 'small' ? 'translate-x-5' : 'translate-x-6';

        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                disabled={isSaving}
                className={`relative ${width} ${height} rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#181818] ${isLocked
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 focus:ring-orange-500'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 focus:ring-emerald-500'
                    } ${isSaving ? 'opacity-50 cursor-wait' : 'hover:shadow-lg hover:scale-105'}`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 ${knobSize} bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${isLocked ? translate : 'translate-x-0'
                        }`}
                >
                    {isSaving ? (
                        <Loader className="w-3 h-3 animate-spin text-gray-600" />
                    ) : isLocked ? (
                        <Lock className="w-2.5 h-2.5 text-orange-600" />
                    ) : (
                        <Unlock className="w-2.5 h-2.5 text-emerald-600" />
                    )}
                </span>
            </button>
        );
    };

    // Tree Node Component
    const TreeNode = ({
        icon: Icon,
        iconColor,
        title,
        isLocked,
        parentLocked,
        hasChildren,
        isExpanded,
        onToggleExpand,
        onToggleLock,
        level,
        isSaving,
        childCount
    }) => {
        const effectiveLocked = isLocked || parentLocked;
        const indentClass = level === 0 ? 'ml-0' : level === 1 ? 'ml-6' : level === 2 ? 'ml-12' : level === 3 ? 'ml-16' : 'ml-20';

        return (
            <div
                className={`${indentClass} group flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-200 ${effectiveLocked
                    ? 'bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20'
                    : 'bg-emerald-500/5 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20'
                    } mb-1.5`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {hasChildren ? (
                        <button
                            onClick={onToggleExpand}
                            className="p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                    ) : (
                        <span className="w-6" />
                    )}

                    <div className={`p-1.5 rounded-lg shrink-0 ${effectiveLocked ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-medium truncate ${effectiveLocked ? 'text-orange-200' : 'text-gray-200'}`}>
                            {title}
                        </span>
                        {childCount > 0 && (
                            <span className="text-xs text-gray-500">{childCount} items</span>
                        )}
                    </div>

                    {parentLocked && !isLocked && (
                        <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full shrink-0">
                            Parent Locked
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${effectiveLocked
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                        {effectiveLocked ? '🔒 Locked' : '🔓 Unlocked'}
                    </span>

                    <ToggleSwitch
                        isLocked={isLocked}
                        onToggle={onToggleLock}
                        isSaving={isSaving}
                        size="small"
                    />
                </div>
            </div>
        );
    };

    // Render Practicals (under subject)
    const renderPracticals = (practicals, semIdx, subIdx, parentLocked) => {
        if (!practicals?.length) return null;

        return practicals.map((practical, practicalIdx) => {
            const path = JSON.stringify({ type: 'practical', indices: { semIdx, subIdx, practicalIdx } });
            const isLocked = !!practical.locked;

            if (!filterMatch(practical, isLocked || parentLocked)) return null;

            return (
                <TreeNode
                    key={`practical-${semIdx}-${subIdx}-${practicalIdx}`}
                    icon={FlaskConical}
                    iconColor="text-purple-400"
                    title={practical.title}
                    isLocked={isLocked}
                    parentLocked={parentLocked}
                    hasChildren={false}
                    isExpanded={false}
                    onToggleExpand={() => { }}
                    onToggleLock={() => handleLockToggle('practical', { semIdx, subIdx, practicalIdx }, isLocked)}
                    level={2}
                    isSaving={saving === path}
                    childCount={0}
                />
            );
        });
    };

    // Render Topics
    const renderTopics = (topics, semIdx, subIdx, chapIdx, parentLocked) => {
        if (!topics?.length) return null;

        return topics.map((topic, topicIdx) => {
            const path = JSON.stringify({ type: 'topic', indices: { semIdx, subIdx, chapIdx, topicIdx } });
            const isLocked = !!topic.locked;

            if (!filterMatch(topic, isLocked || parentLocked)) return null;

            return (
                <TreeNode
                    key={`topic-${semIdx}-${subIdx}-${chapIdx}-${topicIdx}`}
                    icon={MonitorPlay}
                    iconColor="text-cyan-400"
                    title={topic.title}
                    isLocked={isLocked}
                    parentLocked={parentLocked}
                    hasChildren={false}
                    isExpanded={false}
                    onToggleExpand={() => { }}
                    onToggleLock={() => handleLockToggle('topic', { semIdx, subIdx, chapIdx, topicIdx }, isLocked)}
                    level={3}
                    isSaving={saving === path}
                    childCount={0}
                />
            );
        });
    };

    // Render Chapters
    const renderChapters = (chapters, semIdx, subIdx, parentLocked) => {
        if (!chapters?.length) return null;

        return chapters.map((chapter, chapIdx) => {
            const nodePath = `sem-${semIdx}-sub-${subIdx}-chap-${chapIdx}`;
            const path = JSON.stringify({ type: 'chapter', indices: { semIdx, subIdx, chapIdx } });
            const isExpanded = expandedNodes[nodePath];
            const isLocked = !!chapter.locked;
            const effectiveLocked = isLocked || parentLocked;
            const topicsCount = chapter.topics?.length || 0;

            if (!filterMatch(chapter, effectiveLocked)) return null;

            return (
                <div key={`chapter-${semIdx}-${subIdx}-${chapIdx}`}>
                    <TreeNode
                        icon={FileText}
                        iconColor="text-blue-400"
                        title={chapter.title}
                        isLocked={isLocked}
                        parentLocked={parentLocked}
                        hasChildren={topicsCount > 0}
                        isExpanded={isExpanded}
                        onToggleExpand={() => toggleNode(nodePath)}
                        onToggleLock={() => handleLockToggle('chapter', { semIdx, subIdx, chapIdx }, isLocked)}
                        level={2}
                        isSaving={saving === path}
                        childCount={topicsCount}
                    />
                    {isExpanded && renderTopics(chapter.topics, semIdx, subIdx, chapIdx, effectiveLocked)}
                </div>
            );
        });
    };

    // Render Subjects
    const renderSubjects = (subjects, semIdx, parentLocked) => {
        if (!subjects?.length) return null;

        return subjects.map((subject, subIdx) => {
            const nodePath = `sem-${semIdx}-sub-${subIdx}`;
            const path = JSON.stringify({ type: 'subject', indices: { semIdx, subIdx } });
            const isExpanded = expandedNodes[nodePath];
            const isLocked = !!subject.locked;
            const effectiveLocked = isLocked || parentLocked;
            const chaptersCount = subject.chapters?.length || 0;
            const practicalsCount = subject.practicals?.length || 0;
            const totalChildren = chaptersCount + practicalsCount;

            if (!filterMatch(subject, effectiveLocked)) return null;

            return (
                <div key={`subject-${semIdx}-${subIdx}`}>
                    <TreeNode
                        icon={BookOpen}
                        iconColor="text-yellow-400"
                        title={subject.title}
                        isLocked={isLocked}
                        parentLocked={parentLocked}
                        hasChildren={totalChildren > 0}
                        isExpanded={isExpanded}
                        onToggleExpand={() => toggleNode(nodePath)}
                        onToggleLock={() => handleLockToggle('subject', { semIdx, subIdx }, isLocked)}
                        level={1}
                        isSaving={saving === path}
                        childCount={totalChildren}
                    />
                    {isExpanded && (
                        <>
                            {renderChapters(subject.chapters, semIdx, subIdx, effectiveLocked)}
                            {renderPracticals(subject.practicals, semIdx, subIdx, effectiveLocked)}
                        </>
                    )}
                </div>
            );
        });
    };

    // Render Semesters
    const renderSemesters = () => {
        return courseData.map((semester, semIdx) => {
            const nodePath = `sem-${semIdx}`;
            const path = JSON.stringify({ type: 'semester', indices: { semIdx } });
            const isExpanded = expandedNodes[nodePath];
            const isLocked = !!semester.locked;
            const subjectsCount = semester.subjects?.length || 0;

            if (!filterMatch(semester, isLocked)) return null;

            return (
                <div key={`semester-${semIdx}`} className="mb-2">
                    <TreeNode
                        icon={Layers}
                        iconColor="text-emerald-400"
                        title={semester.title}
                        isLocked={isLocked}
                        parentLocked={false}
                        hasChildren={subjectsCount > 0}
                        isExpanded={isExpanded}
                        onToggleExpand={() => toggleNode(nodePath)}
                        onToggleLock={() => handleLockToggle('semester', { semIdx }, isLocked)}
                        level={0}
                        isSaving={saving === path}
                        childCount={subjectsCount}
                    />
                    {isExpanded && renderSubjects(semester.subjects, semIdx, isLocked)}
                </div>
            );
        });
    };

    // Count locked items
    const lockedCount = useMemo(() => {
        let count = 0;
        courseData.forEach(sem => {
            if (sem.locked) count++;
            sem.subjects?.forEach(sub => {
                if (sub.locked) count++;
                sub.chapters?.forEach(chap => {
                    if (chap.locked) count++;
                    chap.topics?.forEach(topic => {
                        if (topic.locked) count++;
                    });
                });
                sub.practicals?.forEach(prac => {
                    if (prac.locked) count++;
                });
            });
        });
        return count;
    }, [courseData]);

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                        <Lock className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-orange-400">{lockedCount}</p>
                        <p className="text-sm text-orange-300/70">Locked Items</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <Unlock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-400">
                            {courseData.length} Semesters
                        </p>
                        <p className="text-sm text-emerald-300/70">Total Content</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-blue-300">Pro Tip</p>
                        <p className="text-xs text-blue-300/70">Click toggle to lock/unlock instantly</p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-[#212121] rounded-2xl border border-gray-700 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search semesters, subjects, chapters, topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#181818] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <select
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value)}
                            className="px-4 py-2.5 bg-[#181818] border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                        >
                            <option value="all">Show All</option>
                            <option value="locked">Locked Only</option>
                            <option value="unlocked">Unlocked Only</option>
                        </select>
                    </div>

                    {/* Expand/Collapse Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className="px-4 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-xl hover:bg-emerald-600/30 transition-all text-sm font-medium"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-4 py-2.5 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all text-sm font-medium"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>
            </div>

            {/* Tree View */}
            <div className="bg-[#212121] rounded-2xl border border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Content Tree</h3>
                        <p className="text-xs text-gray-500">Click on toggles to lock/unlock content. Expand to see nested items.</p>
                    </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-2 space-y-1">
                    {renderSemesters()}

                    {courseData.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No content available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LockContentDashboard;
