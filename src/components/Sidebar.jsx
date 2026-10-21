import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Library, FileText, HelpCircle,
  BarChart3, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, ClipboardList, Edit3, Award, UserCircle, PenTool,
  Calendar, BookMarked, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';

const adminNav = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Courses', path: '/admin/courses', icon: BookMarked },
  { label: 'Subjects', path: '/admin/subjects', icon: Library },
  { label: 'Examinations', path: '/admin/exams', icon: ClipboardList },
  { label: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
  { label: 'Results', path: '/admin/results', icon: Award },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const facultyNav = [
  { label: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
  { label: 'Question Bank', path: '/faculty/questions', icon: HelpCircle },
  { label: 'Create Exam', path: '/faculty/exams/create', icon: PenTool },
  { label: 'Schedule Exam', path: '/faculty/exams', icon: Calendar },
  { label: 'Evaluation', path: '/faculty/evaluation', icon: Edit3 },
  { label: 'Results', path: '/faculty/results', icon: Award },
  { label: 'Reports', path: '/faculty/reports', icon: BarChart3 },
  { label: 'Notifications', path: '/faculty/notifications', icon: Bell },
  { label: 'Profile', path: '/faculty/profile', icon: UserCircle },
];

const studentNav = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Examinations', path: '/student/exams', icon: BookOpen },
  { label: 'Results', path: '/student/results', icon: Award },
  { label: 'Performance', path: '/student/performance', icon: TrendingUp },
  { label: 'Notifications', path: '/student/notifications', icon: Bell },
  { label: 'Profile', path: '/student/profile', icon: UserCircle },
];

const navMap = { admin: adminNav, faculty: facultyNav, student: studentNav };

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navMap[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = { admin: 'Administrator', faculty: 'Faculty', student: 'Student' };
  const roleColor = { admin: 'bg-blue-700', faculty: 'bg-indigo-600', student: 'bg-green-600' };

  return (
    <div className={`fixed left-0 top-0 h-full bg-blue-900 text-white z-30 transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-800">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap size={18} className="text-blue-900" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm leading-tight">{APP_NAME}</p>
            <p className="text-blue-300 text-xs">Exam Portal</p>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${roleColor[user?.role] || 'bg-blue-700'}`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-blue-300">{roleLabel[user?.role]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-red-600 hover:text-white transition-all duration-150"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-900 border border-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors shadow-md"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  );
};

export default Sidebar;
