import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, Eye, Printer, Download, Search, Filter, TrendingUp, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { mockResults, mockExams, mockQuestions, simulateDelay, formatDate } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { UNIVERSITY_NAME } from '../../utils/constants';
import toast from 'react-hot-toast';

const StudentResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    simulateDelay(400).then(() => {
      const studentId = user?.id || 'STU001';
      // If student results exist in mockData or populate fallback
      const userRes = mockResults.filter(r => r.studentId === studentId || r.studentName?.toLowerCase().includes(user?.name?.toLowerCase() || ''));
      setResults(userRes.length > 0 ? userRes : mockResults.slice(0, 5));
      setLoading(false);
    });
  }, [user]);

  const filteredResults = results.filter(r => {
    const matchesSearch =
      r.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalExams = results.length;
  const passedExams = results.filter(r => r.status === 'pass').length;
  const avgPercentage = totalExams > 0
    ? (results.reduce((acc, r) => acc + r.percentage, 0) / totalExams).toFixed(1)
    : 0;
  const highestScore = totalExams > 0
    ? Math.max(...results.map(r => r.percentage))
    : 0;

  const handleViewScorecard = (result) => {
    setSelectedResult(result);
    setModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Downloading official grade card PDF...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Examination Results</h1>
          <p className="text-gray-500 text-sm mt-1">Review your evaluated scorecards, grades, and question performance breakdowns</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Evaluated</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? '—' : totalExams}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Passed Exams</p>
            <p className="text-2xl font-bold text-green-700">{loading ? '—' : `${passedExams} / ${totalExams}`}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Average Score</p>
            <p className="text-2xl font-bold text-indigo-700">{loading ? '—' : `${avgPercentage}%`}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Highest Score</p>
            <p className="text-2xl font-bold text-amber-700">{loading ? '—' : `${highestScore}%`}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by exam title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="all">All Results</option>
            <option value="pass">Passed</option>
            <option value="fail">Failed</option>
          </select>
        </div>
      </div>

      {/* Results Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading examination records...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Award size={44} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-600 font-medium">No result records found</p>
          <p className="text-xs text-gray-400 mt-1">Check back once your pending examinations are evaluated.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Examination</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-center">Marks</th>
                  <th className="px-6 py-4 text-center">Percentage</th>
                  <th className="px-6 py-4 text-center">Grade</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResults.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{r.examTitle}</td>
                    <td className="px-6 py-4 text-gray-600">{r.subject}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(r.submittedAt || '2026-03-20')}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">
                      {r.marksObtained} <span className="text-xs text-gray-400 font-normal">/ {r.totalMarks}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-800">{r.percentage}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-800 font-bold rounded-md text-xs">
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                        r.status === 'pass'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {r.status === 'pass' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewScorecard(r)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Eye size={13} /> Scorecard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Scorecard Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Official Examination Scorecard"
        size="lg"
      >
        {selectedResult && (
          <div className="space-y-6 print:space-y-4">
            {/* Header / Letterhead */}
            <div className="border-b-2 border-blue-900 pb-4 text-center relative">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">{UNIVERSITY_NAME}</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">EVALUATION GRADE REPORT</h3>
              <p className="text-xs text-gray-500">Official Student Examination Transcript</p>
            </div>

            {/* Student & Exam Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl text-xs border border-gray-200">
              <div>
                <p className="text-gray-400">Student Name</p>
                <p className="font-bold text-gray-800">{user?.name || selectedResult.studentName || 'Student Candidate'}</p>
              </div>
              <div>
                <p className="text-gray-400">Student Roll ID</p>
                <p className="font-mono font-bold text-gray-800">{user?.id || 'STU001'}</p>
              </div>
              <div>
                <p className="text-gray-400">Examination</p>
                <p className="font-bold text-gray-800">{selectedResult.examTitle}</p>
              </div>
              <div>
                <p className="text-gray-400">Subject</p>
                <p className="font-bold text-gray-800">{selectedResult.subject}</p>
              </div>
            </div>

            {/* Performance Summary Banner */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-gray-200 text-center bg-blue-50">
                <p className="text-xs text-blue-700 font-medium">Marks Obtained</p>
                <p className="text-2xl font-black text-blue-900 mt-1">
                  {selectedResult.marksObtained} <span className="text-sm font-normal text-blue-700">/ {selectedResult.totalMarks}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 text-center bg-indigo-50">
                <p className="text-xs text-indigo-700 font-medium">Percentage</p>
                <p className="text-2xl font-black text-indigo-900 mt-1">{selectedResult.percentage}%</p>
              </div>

              <div className={`p-4 rounded-xl border text-center ${
                selectedResult.status === 'pass' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-xs font-medium ${selectedResult.status === 'pass' ? 'text-green-700' : 'text-red-700'}`}>
                  Final Grade & Status
                </p>
                <p className={`text-2xl font-black mt-1 ${selectedResult.status === 'pass' ? 'text-green-800' : 'text-red-800'}`}>
                  {selectedResult.grade} ({selectedResult.status.toUpperCase()})
                </p>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Evaluation Breakdown & Remarks</h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                    <tr>
                      <th className="p-3">Section</th>
                      <th className="p-3 text-center">Questions</th>
                      <th className="p-3 text-center">Score</th>
                      <th className="p-3 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3 font-medium text-gray-800">Section A (Objective & MCQs)</td>
                      <td className="p-3 text-center text-gray-600">15 / 15</td>
                      <td className="p-3 text-center font-bold text-emerald-700">14.0 / 15</td>
                      <td className="p-3 text-right text-gray-500">Auto-evaluated</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-800">Section B (Descriptive & Analytical)</td>
                      <td className="p-3 text-center text-gray-600">3 / 3</td>
                      <td className="p-3 text-center font-bold text-blue-700">
                        {selectedResult.marksObtained > 15 ? (selectedResult.marksObtained - 14) : 0} / 15
                      </td>
                      <td className="p-3 text-right text-gray-500">Evaluated by Faculty</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-[11px] text-gray-500">
              <span>Verified by Central Examination Controller</span>
              <span className="font-mono">Verification Hash: #{selectedResult.id}-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer size={15} /> Print Scorecard
                </Button>
                <Button variant="primary" onClick={handleDownload}>
                  <Download size={15} /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentResults;
