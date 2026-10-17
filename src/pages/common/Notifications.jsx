import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Calendar, Award, ShieldAlert, Info } from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const initialNotifications = [
  {
    id: 1,
    title: 'Mid-Semester Exam Schedule Published',
    message: 'The examination schedule for Spring 2026 Semester has been finalized and published.',
    type: 'exam',
    unread: true,
    time: '10 minutes ago',
  },
  {
    id: 2,
    title: 'Evaluation Complete: Data Structures',
    message: 'Your Data Structures & Algorithms exam results have been evaluated with Grade A.',
    type: 'result',
    unread: true,
    time: '2 hours ago',
  },
  {
    id: 3,
    title: 'Proctoring System Update',
    message: 'AI Proctoring engine upgraded to v4.2. Ensure browser permissions for webcams are granted.',
    type: 'system',
    unread: false,
    time: '1 day ago',
  },
  {
    id: 4,
    title: 'Question Bank Review Pending',
    message: '5 new descriptive questions have been added for faculty moderation in Operating Systems.',
    type: 'alert',
    unread: false,
    time: '2 days ago',
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter !== 'all') return n.type === filter;
    return true;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Notifications cleared');
  };

  const markSingleRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'exam': return <Calendar className="text-blue-600" size={18} />;
      case 'result': return <Award className="text-green-600" size={18} />;
      case 'alert': return <ShieldAlert className="text-amber-600" size={18} />;
      default: return <Info className="text-indigo-600" size={18} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications & Alerts</h1>
          <p className="text-gray-500 text-sm mt-1">Stay updated with academic notices, exam announcements, and grade releases</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck size={14} /> Mark all read
          </Button>
          <Button variant="danger" size="sm" onClick={clearAll}>
            <Trash2 size={14} /> Clear all
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'exam', label: 'Exams' },
          { id: 'result', label: 'Results' },
          { id: 'system', label: 'System' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === cat.id
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell size={44} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-600 font-medium">No notifications in this category</p>
          <p className="text-xs text-gray-400 mt-1">You're all caught up with your academic updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => markSingleRead(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                item.unread
                  ? 'bg-blue-50/60 border-blue-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-gray-100 flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold truncate ${item.unread ? 'text-blue-950' : 'text-gray-800'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>
              </div>
              {item.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
