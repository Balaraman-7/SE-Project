import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Award, Target, BrainCircuit, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';

const performanceData = [
  { exam: 'Unit Test 1', score: 78, classAvg: 70 },
  { exam: 'Mid Term', score: 85, classAvg: 72 },
  { exam: 'Unit Test 2', score: 82, classAvg: 68 },
  { exam: 'Practical Exam', score: 92, classAvg: 80 },
  { exam: 'Pre-Semester', score: 88, classAvg: 75 },
  { exam: 'Final Exam', score: 94, classAvg: 79 },
];

const subjectProficiency = [
  { subject: 'Data Structures', score: 92, benchmark: 80 },
  { subject: 'Database Systems', score: 88, benchmark: 75 },
  { subject: 'Web Technologies', score: 95, benchmark: 85 },
  { subject: 'Software Engg', score: 84, benchmark: 70 },
  { subject: 'Comp Networks', score: 79, benchmark: 75 },
];

const questionTypeAccuracy = [
  { name: 'MCQ (Single Choice)', value: 92, color: '#2563eb' },
  { name: 'True / False', value: 96, color: '#16a34a' },
  { name: 'Fill In Blanks', value: 85, color: '#d97706' },
  { name: 'Subjective / Theory', value: 80, color: '#7c3aed' },
];

const StudentPerformance = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('semester');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Academic Analytics & Performance</h1>
          <p className="text-gray-500 text-sm mt-1">Deep-dive insights on your learning trajectory, strengths, and examination mastery</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
        >
          <option value="semester">Current Semester</option>
          <option value="year">Current Academic Year</option>
          <option value="all">All-Time Record</option>
        </select>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall CGPA" value="8.9 / 10" icon={Award} color="blue" subtitle="Top 5% in department" />
        <StatCard title="Class Rank" value="#3 of 64" icon={TrendingUp} color="green" subtitle="+2 ranks higher this term" />
        <StatCard title="Accuracy Rate" value="89.4%" icon={Target} color="indigo" subtitle="On objective questions" />
        <StatCard title="Exam Attendance" value="100%" icon={CheckCircle} color="orange" subtitle="12 of 12 attended" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Over Exams */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Examination Score Progression</h3>
              <p className="text-xs text-gray-400 mt-0.5">Your score (%) compared to class average</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-blue-700"><span className="w-2.5 h-2.5 rounded-full bg-blue-700" /> You</span>
              <span className="flex items-center gap-1 text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Class Avg</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="exam" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#1e40af" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" name="Your Score (%)" />
                <Area type="monotone" dataKey="classAvg" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Class Average (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Proficiency Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Subject Mastery & Benchmarks</h3>
              <p className="text-xs text-gray-400 mt-0.5">Performance index per subject area</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProficiency} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="subject" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Your Score (%)" />
                <Bar dataKey="benchmark" fill="#cbd5e1" radius={[0, 4, 4, 0]} name="Passing Benchmark (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Accuracy Breakdown & AI Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Type Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-base">Question Format Accuracy</h3>
            <p className="text-xs text-gray-400 mt-0.5">Proficiency across question formats</p>
          </div>
          <div className="h-52 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={questionTypeAccuracy}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {questionTypeAccuracy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {questionTypeAccuracy.map(item => (
              <div key={item.name} className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-3">Strengths & Improvement Areas</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-green-800 mb-1">
                  <CheckCircle size={14} className="text-green-600" />
                  Key Strengths
                </div>
                <ul className="text-xs text-green-900 space-y-1 list-disc pl-4">
                  <li>Rapid problem solving on MCQs (avg 42s/question)</li>
                  <li>Exceptional score in Database Normalization & SQL</li>
                  <li>High accuracy in Binary Trees & Algorithms</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                  <AlertCircle size={14} className="text-amber-600" />
                  Areas to Polish
                </div>
                <ul className="text-xs text-amber-900 space-y-1 list-disc pl-4">
                  <li>Elaborate with more architectural diagrams in descriptive questions</li>
                  <li>Review Computer Networks OSI layers routing protocols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-6 rounded-xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <BrainCircuit size={16} className="text-blue-300" /> AI Study Mentor Insights
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Targeted Preparation Tip</h4>
            <p className="text-blue-100 text-xs leading-relaxed mb-4">
              Your overall speed and conceptual accuracy are in the top 5th percentile. You have an upcoming <span className="font-semibold text-white">Computer Networks</span> exam in 4 days.
            </p>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-xs space-y-1 text-blue-50">
              <p>📌 <strong>Focus Topic:</strong> Subnetting & Congestion Control</p>
              <p>🎯 <strong>Suggested Target:</strong> Attempt 15 Practice MCQs from Question Bank</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/student/exams'}
            className="w-full mt-4 py-2.5 bg-white text-blue-950 font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            Practice Next Exam <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;
