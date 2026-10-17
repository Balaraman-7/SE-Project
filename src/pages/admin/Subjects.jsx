import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal, { ConfirmDialog } from '../../components/Modal';
import Button from '../../components/Button';
import { mockSubjects, mockCourses, mockFaculty, simulateDelay } from '../../data/mockData';
import { SEMESTERS } from '../../utils/constants';
import toast from 'react-hot-toast';

const initialForm = { name: '', courseId: '', semester: '', facultyId: '', credits: 3 };

const Subjects = () => {
  const [subjects, setSubjects] = useState([...mockSubjects]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { simulateDelay(500).then(() => setLoading(false)); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Subject name is required';
    if (!form.courseId) e.courseId = 'Course is required';
    if (!form.semester) e.semester = 'Semester is required';
    return e;
  };

  const openAdd = () => { setEditItem(null); setForm(initialForm); setErrors({}); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, courseId: item.courseId, semester: item.semester, facultyId: item.facultyId || '', credits: item.credits || 3 }); setErrors({}); setModalOpen(true); };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await simulateDelay(500);
    const course = mockCourses.find(c => c.id === form.courseId);
    const faculty = mockFaculty.find(f => f.id === form.facultyId);
    if (editItem) {
      setSubjects(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form, course: course?.name || '', faculty: faculty?.name || '' } : s));
      toast.success('Subject updated');
    } else {
      setSubjects(prev => [{
        id: `S${String(prev.length + 1).padStart(3, '0')}`,
        ...form,
        course: course?.name || '',
        faculty: faculty?.name || '',
      }, ...prev]);
      toast.success('Subject created');
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await simulateDelay(400);
    setSubjects(prev => prev.filter(s => s.id !== deleteTarget.id));
    toast.success('Subject deleted');
    setDeleting(false);
    setDeleteTarget(null);
  };

  const columns = [
    { header: 'Subject ID', accessor: 'id', className: 'font-mono text-xs whitespace-nowrap' },
    { header: 'Subject Name', render: row => <p className="font-medium text-gray-800">{row.name}</p> },
    { header: 'Course', accessor: 'course' },
    { header: 'Semester', render: row => <span className="font-medium">Sem {row.semester}</span> },
    { header: 'Faculty', accessor: 'faculty' },
    { header: 'Credits', accessor: 'credits' },
    {
      header: 'Actions', render: row => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700"><Edit2 size={14} /></button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage subjects and assign faculty</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Subject</Button>
      </div>

      <DataTable columns={columns} data={subjects} loading={loading} searchable searchPlaceholder="Search subjects..." emptyMessage="No subjects found" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Subject' : 'Add Subject'}
        footer={<><button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700">Cancel</button><Button onClick={handleSave} loading={saving}>{editItem ? 'Save Changes' : 'Create Subject'}</Button></>}>
        <div className="space-y-4">
          {[
            { label: 'Subject Name', key: 'name', type: 'text', placeholder: 'e.g. Data Structures & Algorithms', required: true },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
              <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors[f.key] ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} />
              {errors[f.key] && <p className="text-xs text-red-500 mt-0.5">{errors[f.key]}</p>}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course <span className="text-red-500">*</span></label>
              <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.courseId ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
                <option value="">Select course</option>
                {mockCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.courseId && <p className="text-xs text-red-500 mt-0.5">{errors.courseId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester <span className="text-red-500">*</span></label>
              <select value={form.semester} onChange={e => setForm({ ...form, semester: parseInt(e.target.value) })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.semester ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
                <option value="">Select semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              {errors.semester && <p className="text-xs text-red-500 mt-0.5">{errors.semester}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Faculty</label>
              <select value={form.facultyId} onChange={e => setForm({ ...form, facultyId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="">Not assigned</option>
                {mockFaculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
              <select value={form.credits} onChange={e => setForm({ ...form, credits: parseInt(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Credit{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Subject" message={`Delete "${deleteTarget?.name}"?`} confirmText="Delete" loading={deleting} />
    </div>
  );
};

export default Subjects;
