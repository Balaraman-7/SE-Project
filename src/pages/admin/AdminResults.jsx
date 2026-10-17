import React, { useState, useEffect } from 'react';
import { Award, Download, Filter, Search, Eye, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { mockResults, mockExams, simulateDelay, formatDate } from '../../data/mockData';
import { UNIVERSITY_NAME } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterExam, setFilterExam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [scorecardOpen, setScorecardOpen] = useState(false);

  useEffect(() => {
    simulateDelay(400).then(() => {
      setResults(mockResults);
      setLoading(false);
    });
  }, []);

  const examsList = ['all', ...new Set(mockResults.map(r => r.examTitle))];

  const filtered = results.filter(r => {
    const matchesExam = filterExam === 'all' || r.examTitle === filterExam;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesExam && matchesStatus;
  });

  const totalResults = results.length;
  const passedCount = results.filter(r => r.status === 'pass').length;
  const passPercentage = totalResults > 0 ? Math.round((passedCount / totalResults) * 100) : 0;
  const avgMarks = totalResults > 0
    ? (results.reduce((acc, r) => acc + r.percentage, 0) / totalResults).toFixed(1)
    : 0;

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Student Name,Roll ID,Exam,Subject,Marks Obtained,Total Marks,Percentage,Grade,Status"]
        .concat(filtered.map(r => `"${r.studentName}","${r.studentId}","${r.examTitle}","${r.subject}",${r.marksObtained},${r.totalMarks},${r.percentage}%,"${r.grade}","${r.status}"`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Exam_Results_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Results exported as CSV successfully!');
  };

  const columns = [
    {
      header: 'Student',
      accessor: 'studentName',
      render: (r) => (
        <div>
          <p className="font-semibold text-gray-800">{r.studentName}</p>
          <p className="text-xs text-gray-400 font-mono">{r.studentId}</p>
        </div>
      ),
    },
    {
      header: 'Examination',
      accessor: 'examTitle',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-800">{r.examTitle}</p>
          <p className="text-xs text-indigo-600">{r.subject}</p>
        </div>
      ),
    },
    {
      header: 'Marks Obtained',
      accessor: 'marksObtained',
      render: (r) => (
        <span className="font-bold text-gray-800">
          {r.marksObtained} <span className="text-xs text-gray-400 font-normal">/ {r.totalMarks}</span>
        </span>
      ),
    },
    {
      header: 'Percentage',
      accessor: 'percentage',
      render: (r) => <span className="font-semibold">{r.percentage}%</span>,
    },
    {
      header: 'Grade',
      accessor: 'grade',
      render: (r) => (
        <span className="px-2 py-0.5 bg-gray-100 font-bold rounded text-xs text-gray-800">
          {r.grade}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
          r.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {r.status === 'pass' ? <CheckCircle size={11} /> : <XCircle size={11} />}
          {r.status.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Examination Results & Master Ledger</h1>
          <p className="text-gray-500 text-sm mt-1">Review, filter, inspect student grades, and export overall examination results</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download size={15} /> Export CSV Report
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Submissions Recorded</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? '—' : totalResults}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Passing Ratio</p>
            <p className="text-2xl font-bold text-green-700">{loading ? '—' : `${passPercentage}%`}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Batch Average</p>
            <p className="text-2xl font-bold text-indigo-700">{loading ? '—' : `${avgMarks}%`}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Distinctions (A/A+)</p>
            <p className="text-2xl font-bold text-amber-700">{loading ? '—' : results.filter(r => r.grade === 'A+' || r.grade === 'A').length}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-600">Filter Exam:</span>
          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            {examsList.map(e => (
              <option key={e} value={e}>{e === 'all' ? 'All Examinations' : e}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <option value="all">All Outcomes</option>
            <option value="pass">Passed Only</option>
            <option value="fail">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchPlaceholder="Search by student name, roll ID or examination..."
        actions={(row) => (
          <button
            onClick={() => {
              setSelectedResult(row);
              setScorecardOpen(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Inspect Scorecard"
          >
            <Eye size={16} />
          </button>
        )}
      />

      {/* Inspector Scorecard Modal */}
      <Modal
        isOpen={scorecardOpen}
        onClose={() => setScorecardOpen(false)}
        title="Student Transcript Inspection"
        size="md"
      >
        {selectedResult && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-bold text-blue-900">{selectedResult.studentName}</p>
              <p className="text-xs text-blue-700">Roll Number: {selectedResult.studentId}</p>
              <p className="text-xs text-blue-700 mt-1 font-semibold">{selectedResult.examTitle} ({selectedResult.subject})</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-400">Marks</p>
                <p className="text-lg font-bold text-gray-800">{selectedResult.marksObtained}/{selectedResult.totalMarks}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-400">Percentage</p>
                <p className="text-lg font-bold text-blue-800">{selectedResult.percentage}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-400">Grade</p>
                <p className="text-lg font-bold text-emerald-700">{selectedResult.grade}</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 text-gray-600">
              <p><strong>Evaluation Mode:</strong> Hybrid (Automated Objective + Faculty Verified Subjective)</p>
              <p><strong>Proctoring Audit:</strong> Verified & Clean (0 Unresolved Flags)</p>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setScorecardOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminResults;
