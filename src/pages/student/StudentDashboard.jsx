import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, TrendingUp, Award, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import { mockDashboardStats, mockExams, mockResults, simulateDelay, formatDate } from '../../data/mockData';
import { formatTime, formatDuration, getStatusColor } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const stats = mockDashboardStats.student;

  useEffect(() => { simulateDelay(600).then(() => setLoading(false)); }, []);

  const upcomingExams = mockExams.filter(e => e.isPublished && e.status === 'upcoming').slice(0, 3);
  const myResults = mockResults.filter(r => r.studentId === (user?.id || 'STU001'));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}! Here's your academic overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Upcoming Exams" value={loading ? '—' : stats.upcomingExams} icon={Calendar} color="blue" subtitle="Scheduled for you" />
        <StatCard title="Completed Exams" value={loading ? '—' : stats.completedExams} icon={CheckCircle} color="green" subtitle="Attended so far" />
        <StatCard title="Average Score" value={loading ? '—' : `${stats.averageScore}%`} icon={TrendingUp} color="indigo" subtitle="Overall average" />
        <StatCard title="Overall Grade" value={loading ? '—' : stats.overallGrade} icon={Award} color="orange" subtitle="Based on performance" />
      </div>

      {/* Upcoming Exams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Examinations</h2>
          <button onClick={() => navigate('/student/exams')} className="text-sm text-blue-700 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingExams.map(exam => (
            <div key={exam.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={18} className="text-blue-800" />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(exam.status)}`}>
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">{exam.title}</h3>
              <p className="text-xs text-indigo-600 mb-3">{exam.subjectName}</p>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} /> {formatDate(exam.date)}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} /> {formatTime(exam.startTime)} · {formatDuration(exam.duration)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{exam.totalMarks} marks total</span>
                <button
                  onClick={() => navigate(`/student/exam/${exam.id}`)}
                  className="text-xs px-3 py-1.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Start Exam
                </button>
              </div>
            </div>
          ))}
          {upcomingExams.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <BookOpen size={36} className="mx-auto mb-3 opacity-50" />
              <p>No upcoming examinations scheduled.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Results */}
      {myResults.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Results</h2>
            <button onClick={() => navigate('/student/results')} className="text-sm text-blue-700 hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {myResults.slice(0, 3).map(result => (
              <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                  result.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {result.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{result.examTitle}</p>
                  <p className="text-xs text-gray-500">{result.subject}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-800">{result.marksObtained}/{result.totalMarks}</p>
                  <p className="text-xs text-gray-500">{result.percentage}%</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${result.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
