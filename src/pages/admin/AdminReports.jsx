import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
  mockMonthlyExams, mockSubjectPerformance, mockPassFailData,
  mockExamPerformanceData
} from '../../data/mockData';
import { mockSubjects } from '../../data/mockData';
import { Download, FileText, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [filters, setFilters] = useState({ subject: '', dateFrom: '', dateTo: '' });

  const handleExport = (type) => {
    toast.success(`Exporting ${type} report... (Backend integration required)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Comprehensive examination analytics and reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <FileText size={15} /> Export PDF
          </button>
          <button onClick={() => handleExport('CSV')} className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
          <select value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">All Subjects</option>
            {mockSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
          <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
          <input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900" onClick={() => toast.success('Filters applied')}>
          <Filter size={15} /> Apply Filters
        </button>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly exams */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Monthly Examination Statistics</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockMonthlyExams}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="scheduled" name="Scheduled" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#1e40af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pass/Fail Pie */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Overall Pass vs Fail</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={mockPassFailData} dataKey="value" cx="50%" cy="50%" outerRadius={85} paddingAngle={4} label={({ name, value }) => `${name}: ${value}%`}>
                {mockPassFailData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Average Marks Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockExamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="avgMarks" name="Avg Marks" stroke="#1e40af" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="passRate" name="Pass Rate %" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Subject-wise Average Marks</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockSubjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="avgMarks" name="Avg Marks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-wise detail table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Subject Performance Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Avg Marks</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockSubjectPerformance.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{row.subject}</td>
                  <td className="px-4 py-3 text-gray-600">{row.students}</td>
                  <td className="px-4 py-3 text-gray-600">{row.avgMarks}/100</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-24">
                        <div className="h-2 rounded-full bg-blue-800" style={{ width: `${row.avgMarks}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{row.avgMarks}%</span>
                    </div>
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

export default AdminReports;
