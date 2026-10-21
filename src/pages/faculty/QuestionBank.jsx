import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter, Search } from 'lucide-react';
import Modal, { ConfirmDialog } from '../../components/Modal';
import Button from '../../components/Button';
import { questionService } from '../../services/questionService';
import { mockSubjects } from '../../data/mockData';
import { QUESTION_TYPE_LABELS, DIFFICULTY_LEVELS } from '../../utils/constants';
import { getStatusColor, getDifficultyColor } from '../../utils/validation';
import toast from 'react-hot-toast';

const initialForm = {
  text: '', subject: '', type: 'mcq', difficulty: 'medium', marks: 1,
  options: { A: '', B: '', C: '', D: '' }, correctAnswer: '',
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', subject: '', type: '', difficulty: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await questionService.getAll(filters);
      setQuestions(data);
    } catch (e) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuestions(); }, [filters]);

  const isObjective = ['mcq', 'true_false'].includes(form.type);
  const isMCQ = form.type === 'mcq';
  const isTrueFalse = form.type === 'true_false';
  const isCode = form.type === 'code';

  const validate = () => {
    const e = {};
    if (!form.text.trim()) e.text = 'Question text is required';
    if (!form.subject) e.subject = 'Subject is required';
    if (!isCode && !form.correctAnswer.trim()) e.correctAnswer = 'Correct answer is required';
    if (isMCQ && (!form.options.A || !form.options.B || !form.options.C || !form.options.D))
      e.options = 'All 4 options are required for MCQ';
    return e;
  };

  const openAdd = () => { setEditItem(null); setForm(initialForm); setErrors({}); setModalOpen(true); };
  const openEdit = (q) => {
    setEditItem(q);
    setForm({
      text: q.text, subject: q.subject, type: q.type, difficulty: q.difficulty,
      marks: q.marks, options: q.options || { A: '', B: '', C: '', D: '' },
      correctAnswer: q.correctAnswer || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const subjectName = mockSubjects.find(s => s.id === form.subject)?.name || '';
      const payload = { ...form, subjectName };
      if (editItem) {
        await questionService.update(editItem.id, payload);
        toast.success('Question updated');
      } else {
        await questionService.create(payload);
        toast.success('Question created');
      }
      setModalOpen(false);
      loadQuestions();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await questionService.delete(deleteTarget.id);
      toast.success('Question deleted');
      loadQuestions();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Question Bank</h1>
          <p className="text-gray-500 text-sm mt-0.5">{questions.length} questions available</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Question</Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            placeholder="Search questions..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-56"
          />
        </div>
        <select value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">All Subjects</option>
          {mockSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">All Types</option>
          {Object.entries(QUESTION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">All Difficulties</option>
          {DIFFICULTY_LEVELS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
        </select>
      </div>

      {/* Questions */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="skeleton h-4 rounded w-3/4 mb-3" />
              <div className="skeleton h-3 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-400">No questions found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">{q.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {QUESTION_TYPE_LABELS[q.type] || q.type}
                    </span>
                    <span className="text-xs text-gray-500">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">{q.text}</p>
                  {q.options && (
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {Object.entries(q.options).map(([k, v]) => (
                        <p key={k} className={`text-xs px-2 py-1 rounded ${k === q.correctAnswer ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-500'}`}>
                          {k}. {v}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-indigo-600 mt-2">{q.subjectName}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(q)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteTarget(q)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Question Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Question' : 'Add New Question'} size="lg"
        footer={<><button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700">Cancel</button><Button onClick={handleSave} loading={saving}>{editItem ? 'Save Changes' : 'Create Question'}</Button></>}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text <span className="text-red-500">*</span></label>
            <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={3} placeholder="Enter the question..." className={`w-full px-3 py-2.5 border rounded-lg text-sm resize-none ${errors.text ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
            {errors.text && <p className="text-xs text-red-500 mt-0.5">{errors.text}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.subject ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
                <option value="">Select subject</option>
                {mockSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors.subject && <p className="text-xs text-red-500 mt-0.5">{errors.subject}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, correctAnswer: '', options: { A: '', B: '', C: '', D: '' } })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                {Object.entries(QUESTION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                {DIFFICULTY_LEVELS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
              <input type="number" min={1} max={100} value={form.marks} onChange={e => setForm({ ...form, marks: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          {/* MCQ Options */}
          {isMCQ && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <div key={opt} className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-500 w-5">{opt}.</span>
                    <input value={form.options[opt] || ''} onChange={e => setForm({ ...form, options: { ...form.options, [opt]: e.target.value } })} placeholder={`Option ${opt}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                ))}
              </div>
              {errors.options && <p className="text-xs text-red-500 mt-1">{errors.options}</p>}
            </div>
          )}

          {/* Correct Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isCode ? 'Coding evaluation' : 'Correct Answer'} {!isCode && <span className="text-red-500">*</span>}
            </label>
            {isMCQ ? (
              <select value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.correctAnswer ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
                <option value="">Select correct option</option>
                {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o}>Option {o}</option>)}
              </select>
            ) : isTrueFalse ? (
              <select value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.correctAnswer ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
                <option value="">Select answer</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            ) : isCode ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                Student code answers are saved for evaluation. Automatic code execution is not configured yet.
              </p>
            ) : (
              <textarea value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })} rows={2} placeholder="Enter the correct answer or model answer..." className={`w-full px-3 py-2.5 border rounded-lg text-sm resize-none ${errors.correctAnswer ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
            )}
            {errors.correctAnswer && <p className="text-xs text-red-500 mt-0.5">{errors.correctAnswer}</p>}
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Question" message={`Delete this question? This cannot be undone.`} confirmText="Delete" loading={deleting} />
    </div>
  );
};

export default QuestionBank;
