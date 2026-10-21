import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_FULL_NAME, APP_NAME } from '../../utils/constants';
import toast from 'react-hot-toast';

const ROLES_LIST = [
  { role: 'student', label: 'Student', email: 'student@university.edu', password: 'student123' },
  { role: 'faculty', label: 'Faculty', email: 'faculty@university.edu', password: 'faculty123' },
  { role: 'admin', label: 'Admin', email: 'admin@university.edu', password: 'admin123' },
];

const STUDENT_ACCOUNTS = [
  { label: 'Arjun Patel (STU001)', email: 'student@university.edu', password: 'student123' },
  { label: 'Priya Singh (STU002)', email: 'priya.singh@university.edu', password: 'priya123' },
];

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('student');
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(STUDENT_ACCOUNTS[0].email);
  const [formData, setFormData] = useState({
    email: 'student@university.edu',
    password: 'student123',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  if (isAuthenticated && user) {
    const dashMap = { admin: '/admin/dashboard', faculty: '/faculty/dashboard', student: '/student/dashboard' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }

  const handleRoleSelect = (roleItem) => {
    setSelectedRole(roleItem.role);
    if (roleItem.role === 'student') {
      const studentAccount = STUDENT_ACCOUNTS[0];
      setSelectedStudentEmail(studentAccount.email);
      setFormData((prev) => ({
        ...prev,
        email: studentAccount.email,
        password: studentAccount.password,
      }));
      setErrors({});
      return;
    }
    setFormData((prev) => ({
      ...prev,
      email: roleItem.email,
      password: roleItem.password,
    }));
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const loggedUser = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${loggedUser.name.split(' ')[0]}!`);
      const dashMap = { admin: '/admin/dashboard', faculty: '/faculty/dashboard', student: '/student/dashboard' };
      navigate(dashMap[loggedUser.role] || '/');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    toast.success('Password reset link sent to your email!');
    setShowForgot(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{APP_NAME}</h1>
          <p className="text-slate-500 text-xs mt-1">{APP_FULL_NAME}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Sign In</h2>
            <p className="text-slate-500 text-xs mt-1">Select your account role and enter credentials to continue</p>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
            {ROLES_LIST.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => handleRoleSelect(item)}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedRole === item.role
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {selectedRole === 'student' && (
            <div className="mb-4">
              <label htmlFor="studentAccount" className="block text-xs font-semibold text-slate-700 mb-1">
                Demo student account
              </label>
              <select
                id="studentAccount"
                value={selectedStudentEmail}
                onChange={(event) => {
                  const studentAccount = STUDENT_ACCOUNTS.find(account => account.email === event.target.value);
                  if (!studentAccount) return;
                  setSelectedStudentEmail(studentAccount.email);
                  setFormData(prev => ({
                    ...prev,
                    email: studentAccount.email,
                    password: studentAccount.password,
                  }));
                  setErrors({});
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                {STUDENT_ACCOUNTS.map(account => (
                  <option key={account.email} value={account.email}>{account.label}</option>
                ))}
              </select>
            </div>
          )}

          {errors.general && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 mb-4">
              <AlertCircle size={15} />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 ${
                    errors.email ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-blue-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 ${
                    errors.password ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-800 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-blue-950 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to the portal terms and security policies.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 text-base mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">Enter your registered email to receive a password reset link.</p>
            <form onSubmit={handleForgot} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                required
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-950 transition-colors"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
