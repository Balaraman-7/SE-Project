import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockSubjects, mockStudents } from '../../data/mockData';
import { EXAM_TYPE_LABELS, QUESTION_TYPE_LABELS, DIFFICULTY_LEVELS } from '../../utils/constants';
import { getDifficultyColor } from '../../utils/validation';
import { examService } from '../../services/examService';
import { questionService } from '../../services/questionService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = ['Basic Information', 'Select Questions', 'Schedule', 'Review & Create'];

const initialForm = {
  title: '', subject: '', type: 'midterm', duration: 90, totalMarks: 0,
  passingMarks: 0, date: '', startTime: '', endTime: '',
};

const CreateExam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [qFilter, setQFilter] = useState({ search: '', type: '', difficulty: '' });
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    questionService.getAll()
      .then(setQuestions)
      .catch(error => toast.error(error.message || 'Failed to load the question bank'));
  }, []);

  const filteredQ = questions.filter(q => {
    if (q.subject !== form.subject) return false;
    if (qFilter.type && q.type !== qFilter.type) return false;
    if (qFilter.difficulty && q.difficulty !== qFilter.difficulty) return false;
    if (qFilter.search && !q.text.toLowerCase().includes(qFilter.search.toLowerCase())) return false;
    return true;
  });

  const isSelected = (id) => selectedQuestions.some(q => q.id === id);
  const toggleQ = (q) => {
    if (isSelected(q.id)) {
      setSelectedQuestions(prev => prev.filter(s => s.id !== q.id));
    } else {
      setSelectedQuestions(prev => [...prev, q]);
    }
  };

  const totalSelectedMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.title.trim()) e.title = 'Exam title is required';
      if (!form.subject) e.subject = 'Subject is required';
      if (!form.duration || form.duration < 1) e.duration = 'Duration must be at least 1 minute';
      if (!form.passingMarks) e.passingMarks = 'Passing marks is required';
    }
    if (step === 1 && selectedQuestions.length === 0) e.questions = 'Select at least one question';
    if (step === 1 && Number(form.passingMarks) > totalSelectedMarks) {
      e.passingMarks = 'Passing marks cannot exceed the total marks of selected questions';
    }
    if (step === 2) {
      if (!form.date) e.date = 'Exam date is required';
      if (!form.startTime) e.startTime = 'Start time is required';
    }
    return e;
  };

  const nextStep = () => {
    const e = validateStep();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await examService.create({
        ...form,
        totalMarks: totalSelectedMarks,
        questions: selectedQuestions.map(q => q.id),
        totalQuestions: selectedQuestions.length,
        subjectName: mockSubjects.find(s => s.id === form.subject)?.name || '',
        faculty: user?.id || '',
        facultyName: user?.name || '',
        assignedTo: 'all',
        enrolledStudents: mockStudents.filter(student => student.status === 'active').length,
      });
      toast.success('Examination created successfully!');
      navigate('/faculty/exams');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i < step ? 'bg-green-600 text-white' : i === step ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-blue-800' : 'text-gray-500'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const Field = ({ label, error, required, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Create Examination</h1>
        <p className="text-gray-500 text-sm mt-0.5">Follow the steps to create a new examination</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <StepIndicator />

        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            <Field label="Exam Title" error={errors.title} required>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Mid-Term Examination - Data Structures" className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.title ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Subject" error={errors.subject} required>
                <select value={form.subject} onChange={e => {
                  setForm({ ...form, subject: e.target.value });
                  setSelectedQuestions([]);
                }} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.subject ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
                  <option value="">Select subject</option>
                  {mockSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Exam Type">
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                  {Object.entries(EXAM_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration (minutes)" error={errors.duration} required>
                <input type="number" min={1} value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 0 })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.duration ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
              </Field>
              <Field label="Passing Marks" error={errors.passingMarks} required>
                <input type="number" min={0} value={form.passingMarks} onChange={e => setForm({ ...form, passingMarks: parseInt(e.target.value) || 0 })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.passingMarks ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
              </Field>
            </div>
          </div>
        )}

        {/* Step 1: Select Questions */}
        {step === 1 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Select Questions</h2>
              <div className="text-sm text-gray-600">
                Selected: <span className="font-bold text-blue-800">{selectedQuestions.length}</span> questions ·
                Total Marks: <span className="font-bold text-blue-800">{totalSelectedMarks}</span>
              </div>
            </div>
            {errors.questions && <p className="text-xs text-red-500 mb-3">{errors.questions}</p>}

            {/* Q Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input placeholder="Search..." value={qFilter.search} onChange={e => setQFilter({ ...qFilter, search: e.target.value })} className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs w-44 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <span className="px-2 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                Subject: {mockSubjects.find(s => s.id === form.subject)?.name || 'Select a subject'}
              </span>
              <select value={qFilter.type} onChange={e => setQFilter({ ...qFilter, type: e.target.value })} className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="">All Types</option>
                {Object.entries(QUESTION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={qFilter.difficulty} onChange={e => setQFilter({ ...qFilter, difficulty: e.target.value })} className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="">All Levels</option>
                {DIFFICULTY_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredQ.length === 0 && (
                <p className="p-4 text-sm text-gray-500 text-center">
                  No questions found for this subject. Add questions in the Question Bank first.
                </p>
              )}
              {filteredQ.map(q => (
                <div key={q.id} onClick={() => toggleQ(q)} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected(q.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected(q.id) ? 'bg-blue-800 border-blue-800' : 'border-gray-300'}`}>
                    {isSelected(q.id) && <Check size={11} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-2">{q.text}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500">{q.subjectName}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</span>
                      <span className="text-xs text-gray-500">{QUESTION_TYPE_LABELS[q.type]}</span>
                      <span className="text-xs font-medium text-blue-700">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedQuestions.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Selected Questions ({selectedQuestions.length})</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedQuestions.map(q => (
                    <span key={q.id} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{q.id}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Schedule Examination</h2>
            <Field label="Exam Date" error={errors.date} required>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split('T')[0]} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.date ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Time" error={errors.startTime} required>
                <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.startTime ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
              </Field>
              <Field label="End Time">
                <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </Field>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Review & Create</h2>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Exam Title', value: form.title },
                  { label: 'Subject', value: mockSubjects.find(s => s.id === form.subject)?.name },
                  { label: 'Exam Type', value: EXAM_TYPE_LABELS[form.type] },
                  { label: 'Duration', value: `${form.duration} minutes` },
                  { label: 'Total Questions', value: selectedQuestions.length },
                  { label: 'Total Marks', value: totalSelectedMarks },
                  { label: 'Passing Marks', value: form.passingMarks },
                  { label: 'Assigned To', value: 'All students (visible after publishing)' },
                  { label: 'Exam Date', value: form.date },
                  { label: 'Start Time', value: form.startTime },
                  { label: 'End Time', value: form.endTime || 'Not set' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-medium text-gray-800">{value || '—'}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Selected Questions</p>
                <div className="flex flex-wrap gap-1">
                  {selectedQuestions.map(q => (
                    <span key={q.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{q.id} ({q.marks}m)</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
          <button onClick={prevStep} disabled={step === 0} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40">
            <ChevronLeft size={16} /> Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={nextStep} className="flex items-center gap-2 px-5 py-2 bg-blue-800 text-white rounded-lg text-sm hover:bg-blue-900">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              {submitting ? 'Creating...' : <><Check size={16} /> Create Examination</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
