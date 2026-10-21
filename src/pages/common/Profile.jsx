import React, { useState } from 'react';
import { User, Mail, Shield, Phone, MapPin, Building, Lock, CheckCircle, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('general');
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@university.edu',
    phone: user?.phone || '+91 9876543210',
    department: user?.role === 'student' ? 'Computer Science & Engineering' : user?.role === 'faculty' ? 'Information Technology' : 'Academic Administration',
    role: user?.role || 'admin',
    enrollmentId: user?.id || (user?.role === 'student' ? 'STU-2024-8842' : user?.role === 'faculty' ? 'FAC-8021' : 'ADM-001'),
    bio: 'Dedicated to academic excellence and continuous learning.',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Profile information updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Account & Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your identity, personal info, and security credentials</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-md flex-shrink-0">
          {profileData.name.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">{profileData.name}</h2>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-800">
              {profileData.role}
            </span>
          </div>
          <p className="text-xs text-gray-500">{profileData.department}</p>
          <p className="text-xs font-mono text-gray-400">ID: {profileData.enrollmentId}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-5 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
            activeTab === 'general'
              ? 'border-blue-800 text-blue-800 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          General Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-5 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
            activeTab === 'security'
              ? 'border-blue-800 text-blue-800 font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Security & Password
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'general' ? (
        <form onSubmit={handleProfileSave} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-gray-800 text-base">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              icon={Mail}
              disabled
            />
            <Input
              label="Phone Number"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              icon={Phone}
            />
            <Input
              label="Department / Faculty"
              value={profileData.department}
              onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
              icon={Building}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Academic Bio</label>
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" variant="primary">
              <Save size={15} /> Save Profile Changes
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-gray-800 text-base">Change Access Credentials</h3>
          <div className="max-w-md space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              icon={Lock}
              required
            />
            <Input
              type="password"
              label="New Password"
              placeholder="At least 6 characters"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              icon={Lock}
              required
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Re-type new password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              icon={Lock}
              required
            />
          </div>

          <div className="flex justify-start pt-4 border-t border-gray-100">
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
