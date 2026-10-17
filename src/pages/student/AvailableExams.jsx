import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Award, AlertCircle, CheckCircle, Search, Filter, PlayCircle, Eye, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { mockExams, simulateDelay, formatDate } from '../../data/mockData';
import { formatTime, formatDuration, getStatusColor } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AvailableExams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [instructionModal, setInstructionModal] = useState({ open: false, exam: null });

  useEffect(() => {
    simulateDelay(400).then(() => {
      setExams(mockExams.filter(e => e.isPublished));
      setLoading(false);
    });
  }, []);

  const subjects = ['all', ...new Set(mockExams.map(e => e.subjectName))];

  const filteredExams = exams.filter(exam => {
    const matchesTab =
      activeTab === 'all' ? true :
      activeTab === 'upcoming' ? exam.status === 'upcoming' :
      activeTab === 'ongoing' ? exam.status === 'ongoing' :
      exam.status === 'completed';

    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || exam.subjectName === selectedSubject;

    return matchesTab && matchesSearch && matchesSubject;
  });

  const handleStartExam = (exam) => {
    setInstructionModal({ open: true, exam });
  };

  const confirmStartExam = () => {
    if (!instructionModal.exam) return;
    const examId = instructionModal.exam.id;
    setInstructionModal({ open: false, exam: null });
    toast.success('Exam portal launched. Good luck!');
    navigate(`/student/exam/${examId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Examinations</h1>
          <p className="text-gray-500 text-sm mt-1">View scheduled, active, and completed examinations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'all', label: 'All Exams' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'ongoing', label: 'Active Now' },
          { id: 'completed', label: 'Completed / Past' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-blue-800 text-blue-800 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, subject or exam code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-gray-700"
          >
            <option value="all">All Subjects</option>
            {subjects.filter(s => s !== 'all').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-16 bg-gray-100 rounded" />
              <div className="h-9 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No examinations found</h3>
          <p className="text-sm text-gray-400 mt-1">There are no exams matching your selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map(exam => (
            <div
              key={exam.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {exam.code}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(exam.status)}`}>
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </span>
                </div>

                <h3 className="font-bold text-gray-800 text-base mb-1 group-hover:text-blue-800 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-xs font-medium text-indigo-600 mb-4">{exam.subjectName}</p>

                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500"><Calendar size={13} /> Date</span>
                    <span className="font-medium text-gray-800">{formatDate(exam.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500"><Clock size={13} /> Time & Duration</span>
                    <span className="font-medium text-gray-800">{formatTime(exam.startTime)} ({formatDuration(exam.duration)})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500"><Award size={13} /> Total Marks</span>
                    <span className="font-medium text-gray-800">{exam.totalMarks} (Pass: {exam.passMarks})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500"><AlertCircle size={13} /> Questions</span>
                    <span className="font-medium text-gray-800">{exam.totalQuestions || 25} Questions</span>
                  </div>
                </div>

                {exam.negativeMarking && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 mb-2">
                    <ShieldAlert size={14} className="flex-shrink-0" />
                    <span>Negative marking: -{exam.negativeMarksValue || 0.25} per wrong answer</span>
                  </div>
                )}
              </div>

              <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                {exam.status === 'completed' ? (
                  <button
                    onClick={() => navigate('/student/results')}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye size={14} /> View Result
                  </button>
                ) : exam.status === 'ongoing' ? (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm animate-pulse"
                  >
                    <PlayCircle size={15} /> Join Live Exam
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
                  >
                    <PlayCircle size={15} /> Enter Exam Hall
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exam Instructions Modal */}
      <Modal
        isOpen={instructionModal.open}
        onClose={() => setInstructionModal({ open: false, exam: null })}
        title={`Exam Instructions: ${instructionModal.exam?.title || ''}`}
        size="lg"
      >
        {instructionModal.exam && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-1">Examination Overview</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                <p><strong>Subject:</strong> {instructionModal.exam.subjectName}</p>
                <p><strong>Code:</strong> {instructionModal.exam.code}</p>
                <p><strong>Duration:</strong> {formatDuration(instructionModal.exam.duration)}</p>
                <p><strong>Total Marks:</strong> {instructionModal.exam.totalMarks} Marks</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-gray-800">Rules & Code of Conduct:</h4>
              <ul className="space-y-2 list-disc pl-5 text-xs text-gray-600">
                <li>This is an automated proctored examination. Ensure your camera and microphone remain active throughout.</li>
                <li>Do not switch tabs, minimize the browser window, or open background applications. Any switch is logged as a violation.</li>
                <li>Each question has an allotted marks weightage indicated on the top right.</li>
                <li>You can flag questions for review and revisit them using the question navigation palette before final submission.</li>
                <li>Once you click <strong>"Final Submit"</strong>, your answers will be committed and cannot be altered.</li>
                <li>If the countdown timer reaches 00:00:00, your current answers will be automatically submitted.</li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-800">
              <ShieldAlert size={20} className="flex-shrink-0 text-amber-600" />
              <span>By clicking "Agree & Begin Exam", you agree to abide by academic integrity policies.</span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setInstructionModal({ open: false, exam: null })}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmStartExam}>
                Agree & Begin Exam <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AvailableExams;
