import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_FULL_NAME, UNIVERSITY_NAME } from '../../utils/constants';
import toast from 'react-hot-toast';

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@university.edu', password: 'admin123', color: 'bg-blue-100 text-blue-800' },
  { role: 'Faculty', email: 'faculty@university.edu', password: 'faculty123', color: 'bg-indigo-100 text-indigo-800' },
  { role: 'Student', email: 'student@university.edu', password: 'student123', color: 'bg-green-100 text-green-800' },
];

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  if (isAuthenticated && user) {
    const dashMap = { admin: '/admin/dashboard', faculty: '/faculty/dashboard', student: '/student/dashboard' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }

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

  const fillDemo = (cred) => {
    setFormData({ ...formData, email: cred.email, password: cred.password });
    setErrors({});
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    toast.success('Password reset link sent to your email!');
    setShowForgot(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-blue-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <GraduationCap size={40} className="text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">{APP_FULL_NAME}</h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm mb-8">
            Simplify examination creation, online assessment, automated evaluation, and comprehensive result management.
          </p>
          <div className="space-y-3">
            {['Secure Online Examinations', 'Auto-Evaluated Results', 'Real-time Analytics', 'Multi-Role Access Control'].map(f => (
              <div key={f} className="flex items-center gap-3 text-left">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="absolute bottom-6 text-blue-300 text-xs">{UNIVERSITY_NAME}</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-blue-900 text-lg">ExamPortal</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-500 text-sm mt-1">Enter your credentials to access the portal.</p>
            </div>

            {/* Demo credentials */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2 font-medium">Quick Login (Demo)</p>
              <div className="flex gap-2 flex-wrap">
                {DEMO_CREDENTIALS.map(c => (
                  <button
                    key={c.role}
                    onClick={() => fillDemo(c)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${c.color} hover:opacity-90 transition-opacity`}
                  >
                    {c.role}
                  </button>
                ))}
              </div>
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                <AlertCircle size={16} />
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@university.edu"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                  <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-blue-700 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
                  onChange={e => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-600 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">Remember me for 30 days</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              By signing in, you agree to the university's academic integrity policies.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your registered email to receive a password reset link.</p>
            <form onSubmit={handleForgot}>
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="your.email@university.edu"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForgot(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-900">
                  Send Reset Link
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
