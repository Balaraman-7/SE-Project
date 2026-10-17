import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Eye, Database, Lock, Save, RefreshCw } from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    examReminders: true,
    browserProctoringStrict: true,
    autoSaveIntervalSec: 15,
    soundNotifications: true,
    twoFactorAuth: false,
    theme: 'light',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('System preferences saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">System Preferences & Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure examination integrity, notification channels, and portal behavior</p>
      </div>

      <div className="space-y-5">
        {/* Examination & Proctoring Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-4">
            <Shield className="text-blue-800" size={20} />
            <h3 className="font-bold text-gray-800 text-base">Examination & Proctoring Controls</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Strict AI Proctoring & Tab Switch Detection</p>
                <p className="text-xs text-gray-500">Automatically flag window blur, browser minimize, and external monitor connections.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.browserProctoringStrict}
                onChange={() => handleToggle('browserProctoringStrict')}
                className="w-5 h-5 text-blue-800 rounded focus:ring-blue-800 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-800">Answer Response Auto-Save Interval</p>
                <p className="text-xs text-gray-500">Frequency of background cloud syncing during active exams.</p>
              </div>
              <select
                value={settings.autoSaveIntervalSec}
                onChange={(e) => setSettings({ ...settings, autoSaveIntervalSec: Number(e.target.value) })}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
              >
                <option value={10}>Every 10 Seconds</option>
                <option value={15}>Every 15 Seconds (Recommended)</option>
                <option value={30}>Every 30 Seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-4">
            <Bell className="text-blue-800" size={20} />
            <h3 className="font-bold text-gray-800 text-base">Notification Channels</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Email Alerts on Result Publication</p>
                <p className="text-xs text-gray-500">Receive an email notification as soon as faculty completes descriptive evaluation.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={() => handleToggle('emailAlerts')}
                className="w-5 h-5 text-blue-800 rounded focus:ring-blue-800 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-800">Exam Reminder Broadcasts</p>
                <p className="text-xs text-gray-500">24 hours & 1 hour prior to scheduled examination time.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.examReminders}
                onChange={() => handleToggle('examReminders')}
                className="w-5 h-5 text-blue-800 rounded focus:ring-blue-800 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            <Save size={15} /> Save All Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
