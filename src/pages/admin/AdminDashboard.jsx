import React, { useState, useEffect } from 'react';
import { Users, BookOpen, HelpCircle, ClipboardList, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  mockDashboardStats, mockExamPerformanceData, mockSubjectPerformance,
  mockPassFailData, mockMonthlyExams, mockExams, mockFaculty, formatDate, simulateDelay
} from '../../data/mockData';
import { getStatusColor, formatDuration } from '../../utils/validation';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const stats = mockDashboardStats.admin;

  useEffect(() => {
    simulateDelay(600).then(() => setLoading(false));
  }, []);

  const recentExams = mockExams.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of the examination system</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={loading ? '—' : stats.totalStudents} icon={Users} color="blue" trend="up" trendValue="+12 this month" subtitle="Registered students" />
        <StatCard title="Total Faculty" value={loading ? '—' : stats.totalFaculty} icon={BookOpen} color="indigo" trend="up" trendValue="+2 this month" subtitle="Active faculty" />
        <StatCard title="Total Exams" value={loading ? '—' : stats.totalExams} icon={ClipboardList} color="orange" trend="up" trendValue="+8 this month" subtitle="Conducted so far" />
        <StatCard title="Total Questions" value={loading ? '—' : stats.totalQuestions} icon={HelpCircle} color="green" trend="up" trendValue="+120 this month" subtitle="In question bank" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock size={18} className="text-blue-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-blue-900">{stats.upcomingExams}</p>
            <p className="text-xs text-blue-600">Upcoming Exams</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle size={18} className="text-green-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-green-900">{stats.completedExams}</p>
            <p className="text-xs text-green-600">Completed Exams</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-orange-700" />
          </div>
          <div>
            <p className="text-xl font-bold text-orange-900">{stats.passPercentage}%</p>
            <p className="text-xs text-orange-600">Overall Pass Rate</p>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Exams */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Monthly Examination Statistics</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockMonthlyExams} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="scheduled" name="Scheduled" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#1e40af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pass/Fail */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Pass vs Fail</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={mockPassFailData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                {mockPassFailData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{stats.passPercentage}%</p>
            <p className="text-xs text-gray-500">Pass Rate</p>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Student Performance Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockExamPerformanceData}>
              <defs>
                <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="avgMarks" name="Avg Marks" stroke="#1e40af" fill="url(#colorMarks)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockSubjectPerformance} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="subject" tick={{ fontSize: 11 }} width={40} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="avgMarks" name="Avg Marks" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Examinations */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Recent Examinations</h2>
          <a href="/admin/exams" className="text-sm text-blue-700 hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Examination</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentExams.map(exam => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{exam.title}</p>
                    <p className="text-xs text-gray-500">{exam.subjectName}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{exam.facultyName}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(exam.date)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDuration(exam.duration)}</td>
                  <td className="px-4 py-3 text-gray-600">{exam.enrolledStudents}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
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

export default AdminDashboard;
