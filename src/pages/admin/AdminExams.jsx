import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Send, XCircle } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { ConfirmDialog } from '../../components/Modal';
import { mockExams, simulateDelay } from '../../data/mockData';
import { getStatusColor, formatDate, formatTime, formatDuration } from '../../utils/validation';
import { EXAM_TYPE_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminExams = () => {
  const [exams, setExams] = useState([...mockExams]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { simulateDelay(600).then(() => setLoading(false)); }, []);

  const filtered = filterStatus ? exams.filter(e => e.status === filterStatus) : exams;

  const handlePublish = async (exam) => {
    await simulateDelay(400);
    setExams(prev => prev.map(e => e.id === exam.id ? { ...e, isPublished: true } : e));
    toast.success(`"${exam.title}" published successfully`);
  };

  const handleCancel = async (exam) => {
    await simulateDelay(400);
    setExams(prev => prev.map(e => e.id === exam.id ? { ...e, status: 'cancelled' } : e));
    toast.success('Exam cancelled');
  };

  const handleDelete = async () => {
    setDeleting(true);
    await simulateDelay(500);
    setExams(prev => prev.filter(e => e.id !== deleteTarget.id));
    toast.success('Exam deleted');
    setDeleting(false);
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: 'Examination', render: row => (
        <div>
          <p className="font-medium text-gray-800">{row.title}</p>
          <p className="text-xs text-gray-500">{row.subjectName} · {EXAM_TYPE_LABELS[row.type] || row.type}</p>
        </div>
      )
    },
    { header: 'Faculty', accessor: 'facultyName' },
    { header: 'Date', render: row => formatDate(row.date) },
    { header: 'Time', render: row => formatTime(row.startTime) },
    { header: 'Duration', render: row => formatDuration(row.duration) },
    { header: 'Students', accessor: 'enrolledStudents' },
    { header: 'Marks', render: row => `${row.totalMarks}` },
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
          {!row.isPublished && row.status !== 'cancelled' && (
            <button onClick={() => handlePublish(row)} className="p-1.5 rounded hover:bg-green-50 text-gray-500 hover:text-green-700" title="Publish"><Send size={14} /></button>
          )}
          {row.status === 'upcoming' && (
            <button onClick={() => handleCancel(row)} className="p-1.5 rounded hover:bg-orange-50 text-gray-500 hover:text-orange-600" title="Cancel"><XCircle size={14} /></button>
          )}
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Examinations</h1>
          <p className="text-gray-500 text-sm mt-0.5">View and manage all examinations</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming', count: exams.filter(e => e.status === 'upcoming').length, color: 'bg-blue-50 border-blue-100 text-blue-700' },
          { label: 'Ongoing', count: exams.filter(e => e.status === 'ongoing').length, color: 'bg-orange-50 border-orange-100 text-orange-700' },
          { label: 'Completed', count: exams.filter(e => e.status === 'completed').length, color: 'bg-gray-50 border-gray-200 text-gray-600' },
          { label: 'Cancelled', count: exams.filter(e => e.status === 'cancelled').length, color: 'bg-red-50 border-red-100 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchable searchPlaceholder="Search examinations..." emptyMessage="No examinations found" />

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Examination" message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`} confirmText="Delete" loading={deleting} />
    </div>
  );
};

export default AdminExams;
