import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle } from 'lucide-react';
import { QUESTION_TYPE_LABELS } from '../../utils/constants';
import { examService } from '../../services/examService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Evaluation = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingResults, setPendingResults] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [marks, setMarks] = useState({});
  const [comments, setComments] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    examService.getPendingEvaluations(user?.id)
      .then(results => {
        if (cancelled) return;
        setPendingResults(results);
        const firstResult = results[0];
        if (firstResult) {
          const initialMarks = {};
          const initialComments = {};
          firstResult.answers.forEach(answer => {
            const evaluation = firstResult.evaluations[answer.questionId];
            if (evaluation) initialMarks[answer.questionId] = evaluation.marks;
            initialComments[answer.questionId] = evaluation?.comment || '';
          });
          setMarks(initialMarks);
          setComments(initialComments);
        }
      })
      .catch(error => {
        if (!cancelled) toast.error(error.message || 'Failed to load submitted answers for evaluation');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  const currentResult = pendingResults[currentIdx];

  const isDescriptive = (type) => ['code', 'descriptive', 'short_answer', 'fill_blank'].includes(type);

  const handleSave = async () => {
    setSaving(true);
    try {
      const evaluations = Object.fromEntries(
        Object.keys(marks).map(questionId => [
          questionId,
          { marks: marks[questionId], comment: comments[questionId] || '' },
        ])
      );
      await examService.saveEvaluation(currentResult.id, evaluations);
      toast.success('Evaluation saved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save evaluation');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    const manualQuestions = currentResult.answers.filter(answer => isDescriptive(answer.question.type));
    if (manualQuestions.some(answer => marks[answer.questionId] === undefined || marks[answer.questionId] === '')) {
      toast.error('Assign marks to every written and coding answer before submitting.');
      return;
    }

    setSaving(true);
    try {
      const evaluations = Object.fromEntries(
        manualQuestions.map(answer => [
          answer.questionId,
          { marks: marks[answer.questionId], comment: comments[answer.questionId] || '' },
        ])
      );
      await examService.saveEvaluation(currentResult.id, evaluations, true);
      toast.success('Evaluation submitted and result published!');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || 'Failed to submit evaluation');
    } finally {
      setSaving(false);
    }
  };

  const navigateStudent = (dir) => {
    const newIdx = currentIdx + dir;
    if (newIdx >= 0 && newIdx < pendingResults.length) {
      setCurrentIdx(newIdx);
      const result = pendingResults[newIdx];
      const initMarks = {};
      const initComments = {};
      result.answers.forEach(a => {
        const evaluation = result.evaluations[a.questionId];
        if (evaluation) initMarks[a.questionId] = evaluation.marks;
        initComments[a.questionId] = evaluation?.comment || '';
      });
      setMarks(initMarks);
      setComments(initComments);
      setSubmitted(false);
    }
  };

  const totalDescriptiveMarks = currentResult?.answers
    .filter(a => isDescriptive(a.question.type))
    .reduce((sum, a) => sum + a.question.marks, 0) || 0;

  const givenDescriptiveMarks = Object.entries(marks)
    .filter(([qId]) => currentResult?.answers.some(answer => answer.questionId === qId && isDescriptive(answer.question.type)))
    .reduce((sum, [, m]) => sum + (parseFloat(m) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pendingResults.length === 0) {
    return (
      <div className="text-center py-20">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">No pending evaluations</h2>
        <p className="text-gray-500 mt-2">Student written and coding answers will appear here after they submit an exam.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Evaluation</h1>
          <p className="text-gray-500 text-sm">Evaluate student answers and assign marks</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Submission {currentIdx + 1} of {pendingResults.length}
          </span>
          <div className="flex gap-1">
            <button onClick={() => navigateStudent(-1)} disabled={currentIdx === 0} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => navigateStudent(1)} disabled={currentIdx === pendingResults.length - 1} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Info */}
      {currentResult && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Student Name', value: currentResult.studentName },
              { label: 'Student ID', value: currentResult.studentId },
              { label: 'Exam Name', value: currentResult.examTitle },
              { label: 'Subject', value: currentResult.subject },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-blue-900 font-semibold">Written & Coding Evaluation Progress</span>
              <span className="font-bold text-blue-900">{givenDescriptiveMarks} / {totalDescriptiveMarks} marks assigned</span>
            </div>
            <div className="w-full bg-blue-200/80 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-900 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, totalDescriptiveMarks > 0 ? (givenDescriptiveMarks / totalDescriptiveMarks) * 100 : 0))}%`,
                }}
              />
            </div>
          </div>

          {/* Answers */}
          <div className="space-y-5">
            {currentResult.answers.map((answer, idx) => {
              const question = answer.question;
              const isDesc = isDescriptive(question.type);
              const isObj = ['mcq', 'true_false'].includes(question.type);
              const submittedAnswer = answer.answer === '' || answer.answer === undefined
                ? '(No answer provided)'
                : answer.answer;

              return (
                <div key={answer.questionId} className={`rounded-xl border p-4 ${isDesc ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-500">Q{idx + 1}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                        {QUESTION_TYPE_LABELS[question.type]}
                      </span>
                      {isDesc && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-200 text-orange-700">Manual Evaluation</span>}
                      {isObj && <span className="text-xs px-2 py-0.5 rounded-full bg-green-200 text-green-700">Auto-Evaluated</span>}
                    </div>
                    <span className="text-sm font-medium text-gray-600">Max: {question.marks} marks</span>
                  </div>

                  <p className="text-sm font-medium text-gray-800 mb-3">{question.text}</p>

                  <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Student's Answer:</p>
                    {question.type === 'code' && answer.answer ? (
                      <>
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Language: {(answer.language || 'Not selected').toUpperCase()}
                        </p>
                        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-950 p-3 font-mono text-xs text-green-100">{answer.answer}</pre>
                      </>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm text-gray-800">{submittedAnswer}</p>
                    )}
                  </div>

                  {isObj && (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${answer.isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                        {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                      <span className="text-sm text-gray-600">— Auto marks: {answer.marksObtained}/{question.marks}</span>
                    </div>
                  )}

                  {isDesc && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Marks Obtained (out of {question.marks})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={question.marks}
                          value={marks[answer.questionId] !== undefined ? marks[answer.questionId] : ''}
                          onChange={e => {
                            const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                            setMarks(prev => ({
                              ...prev,
                              [answer.questionId]: val === '' || isNaN(val) ? '' : Math.min(question.marks, Math.max(0, val))
                            }));
                          }}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          disabled={submitted}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Faculty Comment</label>
                        <textarea
                          value={comments[answer.questionId] || ''}
                          onChange={e => setComments(prev => ({ ...prev, [answer.questionId]: e.target.value }))}
                          rows={2}
                          placeholder="Optional feedback for the student..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                          disabled={submitted}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          {!submitted ? (
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                <Save size={15} /> {saving ? 'Saving...' : 'Save Evaluation'}
              </button>
              <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60">
                <CheckCircle size={15} /> Submit Evaluation
              </button>
              {currentIdx < pendingResults.length - 1 && (
                <button onClick={() => navigateStudent(1)} className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900 ml-auto">
                  Next Submission <ChevronRight size={15} />
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 pt-5 border-t border-gray-200 flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={18} />
                <span className="font-medium">Evaluation submitted!</span>
              </div>
              {currentIdx < pendingResults.length - 1 && (
                <button onClick={() => navigateStudent(1)} className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900 ml-auto">
                  Next Submission <ChevronRight size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Evaluation;
