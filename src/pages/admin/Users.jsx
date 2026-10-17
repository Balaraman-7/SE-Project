import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, UserCheck, UserX, Filter } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal, { ConfirmDialog } from '../../components/Modal';
import Button from '../../components/Button';
import { mockStudents, mockFaculty, mockAdmins, simulateDelay } from '../../data/mockData';
import { getStatusColor } from '../../utils/validation';
import { DEPARTMENTS } from '../../utils/constants';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'student', label: 'Students' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'admin', label: 'Administrators' },
];

const initialForm = { name: '', email: '', password: '', role: 'student', department: '', status: 'active' };

const Users = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [users, setUsers] = useState({ student: [...mockStudents], faculty: [...mockFaculty], admin: [...mockAdmins] });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    simulateDelay(600).then(() => setLoading(false));
  }, []);

  const currentData = users[activeTab] || [];

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!editUser && !form.password) errs.password = 'Password is required';
    if (!form.department) errs.department = 'Department is required';
    return errs;
  };

  const openAdd = () => {
    setEditUser(null);
    setForm({ ...initialForm, role: activeTab });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, department: user.department, status: user.status });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    await simulateDelay(600);
    if (editUser) {
      setUsers(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(u => u.id === editUser.id ? { ...u, ...form } : u),
      }));
      toast.success('User updated successfully');
    } else {
      const newUser = {
        ...form,
        id: `${activeTab.substring(0, 3).toUpperCase()}${String(currentData.length + 1).padStart(3, '0')}`,
      };
      setUsers(prev => ({ ...prev, [activeTab]: [newUser, ...prev[activeTab]] }));
      toast.success('User created successfully');
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await simulateDelay(500);
    setUsers(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(u => u.id !== deleteTarget.id) }));
    toast.success('User deleted successfully');
    setDeleting(false);
    setDeleteTarget(null);
  };

  const toggleStatus = async (user) => {
    await simulateDelay(300);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(u => u.id === user.id ? { ...u, status: newStatus } : u),
    }));
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const columns = [
    { header: 'User ID', accessor: 'id', className: 'whitespace-nowrap font-mono text-xs' },
    {
      header: 'Name', render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-sm flex-shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Department', accessor: 'department' },
    {
      header: 'Role', render: (row) => (
        <span className="capitalize text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">{row.role}</span>
      )
    },
    {
      header: 'Status', render: (row) => (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(row.status)}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      header: 'Actions', render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700" title="Edit">
            <Edit2 size={14} />
          </button>
          <button onClick={() => toggleStatus(row)} className={`p-1.5 rounded hover:bg-gray-100 ${row.status === 'active' ? 'text-orange-500' : 'text-green-600'}`} title={row.status === 'active' ? 'Deactivate' : 'Activate'}>
            {row.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
          </button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage students, faculty, and administrators</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add User</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
              {users[tab.id]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={currentData}
        loading={loading}
        searchable
        searchPlaceholder="Search users..."
        emptyMessage={`No ${activeTab}s found`}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editUser ? 'Edit User' : 'Add New User'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <Button onClick={handleSave} loading={saving}>{editUser ? 'Save Changes' : 'Create User'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${formErrors.name ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} placeholder="Enter full name" />
            {formErrors.name && <p className="text-xs text-red-500 mt-0.5">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${formErrors.email ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} placeholder="email@university.edu" />
            {formErrors.email && <p className="text-xs text-red-500 mt-0.5">{formErrors.email}</p>}
          </div>
          {!editUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${formErrors.password ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`} placeholder="Min. 6 characters" />
              {formErrors.password && <p className="text-xs text-red-500 mt-0.5">{formErrors.password}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className={`w-full px-3 py-2.5 border rounded-lg text-sm ${formErrors.department ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-600`}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {formErrors.department && <p className="text-xs text-red-500 mt-0.5">{formErrors.department}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Users;
