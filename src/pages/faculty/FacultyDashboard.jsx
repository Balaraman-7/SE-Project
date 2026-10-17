import React, { useState, useEffect } from 'react';
import { HelpCircle, BookOpen, ClipboardCheck, Edit3, TrendingUp } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { mockDashboardStats, mockExams, mockExamPerformanceData, simulateDelay, formatDate } from '../../data/mockData';
import { getStatusColor, formatDuration, formatTime } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const stats = mockDashboardStats.faculty;
  const myExams = mockExams.filter(e => e.faculty === user?.id);

  useEffect(() => { simulateDelay(600).then(() => setLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Questions" value={loading ? '—' : stats.totalQuestions} icon={HelpCircle} color="blue" subtitle="In question bank" />
        <StatCard title="Active Exams" value={loading ? '—' : stats.activeExams} icon={BookOpen} color="indigo" subtitle="Currently running" />
        <StatCard title="Completed Exams" value={loading ? '—' : stats.completedExams} icon={ClipboardCheck} color="green" subtitle="All time" />
        <StatCard title="Pending Evaluations" value={loading ? '—' : stats.pendingEvaluations} icon={Edit3} color="orange" subtitle="Descriptive answers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Exam Performance Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockExamPerformanceData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="avgMarks" name="Avg Marks" stroke="#4f46e5" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Pass Rate Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockExamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="passRate" name="Pass Rate %" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Add Question', path: '/faculty/questions', color: 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100' },
          { label: 'Create Exam', path: '/faculty/exams/create', color: 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100' },
          { label: 'Evaluate', path: '/faculty/evaluation', color: 'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100' },
          { label: 'View Results', path: '/faculty/results', color: 'bg-green-50 border-green-100 text-green-700 hover:bg-green-100' },
        ].map(a => (
          <button key={a.label} onClick={() => navigate(a.path)} className={`rounded-xl border p-4 text-sm font-medium transition-colors ${a.color}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Recent exams table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">My Recent Exams</h2>
          <button onClick={() => navigate('/faculty/exams')} className="text-sm text-blue-700 hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Exam Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(myExams.length > 0 ? myExams : mockExams).slice(0, 5).map(exam => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{exam.title}</p>
                    <p className="text-xs text-gray-500">{formatDuration(exam.duration)} · {exam.totalMarks} marks</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{exam.subjectName}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(exam.date)}</td>
                  <td className="px-4 py-3 text-gray-600">{exam.enrolledStudents}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(exam.status)}`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {exam.status === 'completed' && (
                      <button onClick={() => navigate('/faculty/evaluation')} className="text-xs text-blue-700 hover:underline">Evaluate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
