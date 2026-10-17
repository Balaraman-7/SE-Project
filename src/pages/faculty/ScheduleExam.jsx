import React, { useState, useEffect } from 'react';
import { Send, XCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { ConfirmDialog } from '../../components/Modal';
import Button from '../../components/Button';
import { mockExams, simulateDelay } from '../../data/mockData';
import { getStatusColor, formatDate, formatTime, formatDuration } from '../../utils/validation';
import { EXAM_TYPE_LABELS } from '../../utils/constants';
import { examService } from '../../services/examService';
import toast from 'react-hot-toast';

const ScheduleExam = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([...mockExams]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { simulateDelay(600).then(() => setLoading(false)); }, []);

  const tabData = {
    upcoming: exams.filter(e => e.status === 'upcoming'),
    ongoing: exams.filter(e => e.status === 'ongoing'),
    completed: exams.filter(e => e.status === 'completed'),
  };

  const handlePublish = async (exam) => {
    await simulateDelay(400);
    setExams(prev => prev.map(e => e.id === exam.id ? { ...e, isPublished: true } : e));
    toast.success(`"${exam.title}" published to students!`);
  };

  const handleCancel = async () => {
    setCancelling(true);
    await simulateDelay(500);
    setExams(prev => prev.map(e => e.id === cancelTarget.id ? { ...e, status: 'cancelled' } : e));
    toast.success('Exam cancelled');
    setCancelling(false);
    setCancelTarget(null);
  };

  const columns = [
    {
      header: 'Examination', render: row => (
        <div>
          <p className="font-medium text-gray-800">{row.title}</p>
          <p className="text-xs text-gray-500">{row.subjectName} · {EXAM_TYPE_LABELS[row.type]}</p>
        </div>
      )
    },
    { header: 'Date', render: row => formatDate(row.date) },
    { header: 'Start Time', render: row => formatTime(row.startTime) },
    { header: 'Duration', render: row => formatDuration(row.duration) },
    { header: 'Students', accessor: 'enrolledStudents' },
    {
      header: 'Published', render: row => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {row.isPublished ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      header: 'Status', render: row => (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(row.status)}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      header: 'Actions', render: row => (
        <div className="flex gap-1">
          {!row.isPublished && (
            <button onClick={() => handlePublish(row)} title="Publish" className="p-1.5 rounded hover:bg-green-50 text-gray-500 hover:text-green-700">
              <Send size={14} />
            </button>
          )}
          {row.status === 'upcoming' && (
            <button onClick={() => setCancelTarget(row)} title="Cancel" className="p-1.5 rounded hover:bg-orange-50 text-gray-500 hover:text-orange-600">
              <XCircle size={14} />
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule Examinations</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage and publish your examinations</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/faculty/exams/create')}>Create Exam</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {Object.entries(tabData).map(([tab, data]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{data.length}</span>
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={tabData[activeTab]}
        loading={loading}
        searchable
        searchPlaceholder="Search exams..."
        emptyMessage={`No ${activeTab} exams found`}
      />

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Examination"
        message={`Are you sure you want to cancel "${cancelTarget?.title}"? Students will be notified.`}
        confirmText="Cancel Exam"
        confirmVariant="danger"
        loading={cancelling}
      />
    </div>
  );
};

export default ScheduleExam;
