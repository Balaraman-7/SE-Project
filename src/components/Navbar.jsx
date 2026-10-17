import React, { useState } from 'react';
import { Bell, Search, ChevronDown, Menu, X, LogOut, UserCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockNotifications } from '../data/mockData';

const Navbar = ({ onMenuToggle, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const profilePath = `/${user?.role}/profile`;
  const roleLabel = { admin: 'Administrator', faculty: 'Faculty', student: 'Student' };

  return (
    <header className="fixed top-0 right-0 left-0 z-20 bg-white border-b border-gray-200 shadow-sm h-16"
      style={{ left: sidebarCollapsed ? '64px' : '256px', transition: 'left 0.3s' }}>
      <div className="flex items-center justify-between h-full px-5 gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-64 bg-gray-50"
          />
        </div>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                  <span className="text-xs text-blue-700 cursor-pointer hover:underline" onClick={() => navigate(`/${user?.role}/notifications`)}>
                    View all
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {mockNotifications.slice(0, 4).map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-blue-50' : ''}`}>
                      <p className="text-sm font-medium text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700"
            >
              <div className="w-7 h-7 bg-blue-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:block">{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-blue-700 mt-0.5">{roleLabel[user?.role]}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { navigate(profilePath); setShowProfile(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <UserCircle size={16} /> Profile
                  </button>
                  {user?.role === 'admin' && (
                    <button onClick={() => { navigate('/admin/settings'); setShowProfile(false); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings size={16} /> Settings
                    </button>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {(showNotifications || showProfile) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotifications(false); setShowProfile(false); }} />
      )}
    </header>
  );
};

export default Navbar;
