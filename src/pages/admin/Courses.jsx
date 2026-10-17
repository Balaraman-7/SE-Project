import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal, { ConfirmDialog } from '../../components/Modal';
import Button from '../../components/Button';
import { mockCourses, simulateDelay } from '../../data/mockData';
import { DEPARTMENTS } from '../../utils/constants';
import toast from 'react-hot-toast';

const initialForm = { name: '', department: '', duration: '4 years', description: '' };

const Courses = () => {
  const [courses, setCourses] = useState([...mockCourses]);
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
    if (!form.name.trim()) e.name = 'Course name is required';
    if (!form.department) e.department = 'Department is required';
    return e;
  };

  const openAdd = () => { setEditItem(null); setForm(initialForm); setErrors({}); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, department: item.department, duration: item.duration, description: item.description || '' }); setErrors({}); setModalOpen(true); };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await simulateDelay(500);
    if (editItem) {
      setCourses(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c));
      toast.success('Course updated successfully');
    } else {
      setCourses(prev => [{ id: `CRS${String(prev.length + 1).padStart(3, '0')}`, ...form, totalStudents: 0 }, ...prev]);
      toast.success('Course created successfully');
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await simulateDelay(400);
    setCourses(prev => prev.filter(c => c.id !== deleteTarget.id));
    toast.success('Course deleted');
    setDeleting(false);
    setDeleteTarget(null);
  };

  const columns = [
    { header: 'Course ID', accessor: 'id', className: 'font-mono text-xs whitespace-nowrap' },
    { header: 'Course Name', render: row => <div><p className="font-medium text-gray-800">{row.name}</p><p className="text-xs text-gray-400">{row.description}</p></div> },
    { header: 'Department', accessor: 'department' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Students', render: row => <span className="font-medium">{row.totalStudents || 0}</span> },
    {
      header: 'Actions', render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700"><Edit2 size={14} /></button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      )
    },
  ];

  const Field = ({ label, children, error, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage academic courses and programs</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Course</Button>
      </div>

      <DataTable columns={columns} data={courses} loading={loading} searchable searchPlaceholder="Search courses..." emptyMessage="No courses found" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Course' : 'Add Course'}
        footer={<><button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700">Cancel</button><Button onClick={handleSave} loading={saving}>{editItem ? 'Save Changes' : 'Create Course'}</Button></>}>
        <div className="space-y-4">
          <Field label="Course Name" error={errors.name} required>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.name ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} placeholder="e.g. Computer Science & Engineering" />
          </Field>
          <Field label="Department" error={errors.department} required>
            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${errors.department ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Duration">
            <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>1 year</option><option>2 years</option><option>3 years</option><option>4 years</option><option>5 years</option>
            </select>
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Brief description of the course" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Course" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} confirmText="Delete" loading={deleting} />
    </div>
  );
};

export default Courses;
