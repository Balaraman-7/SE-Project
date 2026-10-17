import React, { useState, useEffect } from 'react';
import { Send, XCircle, Plus, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import Modal, { ConfirmDialog } from '../../components/Modal';
import Button from '../../components/Button';
import { getStatusColor, formatDate, formatTime, formatDuration } from '../../utils/validation';
import { EXAM_TYPE_LABELS } from '../../utils/constants';
import { examService } from '../../services/examService';
import toast from 'react-hot-toast';

const ScheduleExam = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [monitorTarget, setMonitorTarget] = useState(null);
  const [monitorSubmissions, setMonitorSubmissions] = useState([]);
  const [monitorLoading, setMonitorLoading] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      try {
        setExams(await examService.getAll());
      } catch (error) {
        toast.error(error.message || 'Failed to load examinations');
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  const tabData = {
    upcoming: exams.filter(e => e.status === 'upcoming'),
    ongoing: exams.filter(e => e.status === 'ongoing'),
    completed: exams.filter(e => e.status === 'completed'),
  };

  const handlePublish = async (exam) => {
    try {
      const publishedExam = await examService.publish(exam.id);
      setExams(prev => prev.map(e => e.id === publishedExam.id ? publishedExam : e));
      toast.success(`"${exam.title}" published to students!`);
    } catch (error) {
      toast.error(error.message || 'Failed to publish examination');
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const cancelledExam = await examService.update(cancelTarget.id, { status: 'cancelled' });
      setExams(prev => prev.map(e => e.id === cancelledExam.id ? cancelledExam : e));
      toast.success('Exam cancelled');
      setCancelTarget(null);
    } catch (error) {
      toast.error(error.message || 'Failed to cancel examination');
    } finally {
      setCancelling(false);
    }
  };

  const handleMonitor = async (exam) => {
    setMonitorTarget(exam);
    setMonitorSubmissions([]);
    setMonitorLoading(true);
    try {
      setMonitorSubmissions(await examService.getSubmissions(exam.id));
    } catch (error) {
      toast.error(error.message || 'Failed to load exam monitoring records');
    } finally {
      setMonitorLoading(false);
    }
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
          <button onClick={() => handleMonitor(row)} title="View exam monitoring" className="p-1.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-700">
            <ShieldAlert size={14} />
          </button>
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

      <Modal
        isOpen={!!monitorTarget}
        onClose={() => setMonitorTarget(null)}
        title={`Exam Monitoring: ${monitorTarget?.title || ''}`}
        size="lg"
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Submitted attempts and browser tab-switch counts. Four or more switches indicate an automatic submission.
          </p>
          {monitorLoading ? (
            <p className="py-8 text-center text-sm text-gray-500">Loading monitoring records...</p>
          ) : monitorSubmissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No student submissions recorded yet.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {monitorSubmissions.map(submission => (
                <div key={submission.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {submission.studentName || submission.studentId || 'Student'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className={`font-semibold ${submission.tabSwitches > 3 ? 'text-red-600' : 'text-gray-700'}`}>
                      Tab switches: {submission.tabSwitches}/3 allowed
                    </span>
                    {submission.autoSubmitReason === 'tab_switch_limit' && (
                      <span className="block text-red-600 font-medium">Auto-submitted after limit exceeded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
            This prototype stores monitoring records in the current browser only; it does not sync between devices.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduleExam;
