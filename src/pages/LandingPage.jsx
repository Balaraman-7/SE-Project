import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, HelpCircle, Zap, BarChart3, Shield,
  ClipboardList, ArrowRight, CheckCircle, Users, FileText, Award,
  Sparkles, Check, ChevronRight, Lock, UserCheck, ShieldCheck
} from 'lucide-react';
import { APP_FULL_NAME, UNIVERSITY_NAME } from '../utils/constants';

const features = [
  {
    icon: BookOpen,
    title: 'Online Examination Hall',
    desc: 'Conduct secure, time-bound online exams with automated countdown timers, question navigation palette, and auto-submission.',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    icon: HelpCircle,
    title: 'Comprehensive Question Bank',
    desc: 'Organize thousands of questions across subjects, question types (MCQ, True/False, Descriptive), and difficulty tiers.',
    color: 'bg-indigo-100 text-indigo-800',
  },
  {
    icon: Zap,
    title: 'Instant Automated Evaluation',
    desc: 'Objective questions evaluated in real time upon submission with zero manual grading delay and instant feedback.',
    color: 'bg-amber-100 text-amber-800',
  },
  {
    icon: ClipboardList,
    title: 'Digital Scorecard & Transcripts',
    desc: 'Generate official verifiable marksheets with detailed section breakdowns, grades, and printable transcripts.',
    color: 'bg-emerald-100 text-emerald-800',
  },
  {
    icon: BarChart3,
    title: 'In-Depth Academic Analytics',
    desc: 'Monitor institutional performance, batch score progression, passing ratios, and subject proficiency trends.',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    icon: Shield,
    title: 'AI Proctoring & Audit Logging',
    desc: 'Live webcam proctoring simulation, tab switch violation tracking, and strict academic integrity enforcement.',
    color: 'bg-rose-100 text-rose-800',
  },
];

const steps = [
  { num: '01', title: 'Create Exam', desc: 'Faculty selects questions from the bank and configures time & marking schemes.' },
  { num: '02', title: 'Schedule & Publish', desc: 'Publish exams to enrolled batches with start timers and student notifications.' },
  { num: '03', title: 'Students Attend', desc: 'Students attempt questions in a distraction-free, proctored digital examination environment.' },
  { num: '04', title: 'Evaluate & Review', desc: 'Objective questions auto-score instantly; faculty evaluates descriptive responses.' },
  { num: '05', title: 'Publish Results', desc: 'Students and admins access verifiable scorecards and performance reports.' },
];

const stats = [
  { label: 'Enrolled Students', value: '2,400+', icon: Users },
  { label: 'Faculty Evaluators', value: '120+', icon: GraduationCap },
  { label: 'Exams Completed', value: '850+', icon: FileText },
  { label: 'Questions in Bank', value: '12,000+', icon: HelpCircle },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-900 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-blue-950 text-base leading-tight tracking-tight">ExamPortal</p>
              <p className="text-slate-500 text-xs font-medium">{UNIVERSITY_NAME}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-900 transition-colors">How It Works</a>
            <a href="#portals" className="hover:text-blue-900 transition-colors">Portals</a>
            <a href="#stats" className="hover:text-blue-900 transition-colors">Statistics</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-all shadow-sm hover:shadow"
            >
              Access Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-100/60 via-slate-50 to-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-900/10 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-blue-900/15">
            <Sparkles size={14} className="text-blue-800" />
            Next-Generation Academic Assessment System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Online Examination & <span className="text-blue-900">Evaluation System</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A secure, automated digital assessment platform that simplifies question creation, online testing, AI proctoring, and instant grade sheet publishing.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-950 transition-all shadow-md hover:shadow-lg scale-100 hover:scale-[1.02]"
            >
              Get Started Now <ArrowRight size={18} />
            </button>
            <a
              href="#portals"
              className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all shadow-xs"
            >
              Explore Demo Portals
            </a>
          </div>

          {/* Hero Visual Mockup */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">examportal.university.edu/dashboard</span>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ● Live Academic Session
              </span>
            </div>

            <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Active Candidates', val: '248', color: 'text-blue-900' },
                  { label: 'Faculty On-Duty', val: '32', color: 'text-indigo-900' },
                  { label: 'Scheduled Exams', val: '86', color: 'text-emerald-700' },
                  { label: 'Questions in Vault', val: '1,240', color: 'text-purple-900' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/70">
                    <p className={`text-xl font-extrabold ${item.color}`}>{item.val}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Examination Ledger</h4>
                  <span className="text-xs text-blue-900 font-semibold cursor-pointer hover:underline">View all</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { title: 'CS302 - Data Structures & Algorithms', time: '10:00 AM - 11:30 AM', status: 'Ongoing', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
                    { title: 'CS401 - Database Management Systems', time: '02:00 PM - 03:30 PM', status: 'Upcoming', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
                    { title: 'IT205 - Web Technologies & Security', time: 'Completed Yesterday', status: 'Evaluated', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{row.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{row.time}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${row.badge}`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Quick Portals */}
      <section id="portals" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Dedicated Role Portals</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              Customized interfaces tailored to the distinct workflows of students, educators, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all hover:border-blue-300 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <UserCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Student Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Attempt scheduled exams in a secured proctored environment, track time, and download official grade cards.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Interactive Examination Hall</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Instant Auto-Grading & Review</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Performance Analytics Radar</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 bg-white border border-slate-300 text-slate-800 font-bold text-xs rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                Login as Student <ChevronRight size={14} />
              </button>
            </div>

            {/* Faculty Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all hover:border-indigo-300 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Faculty Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Create question banks with multiple formats, author exam blueprints, and evaluate descriptive answer scripts.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-indigo-600" /> Dynamic Question Authoring</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-indigo-600" /> Multi-Step Exam Wizard</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-indigo-600" /> Manual & Auto Evaluation Suite</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 bg-white border border-slate-300 text-slate-800 font-bold text-xs rounded-xl hover:bg-indigo-700 hover:text-white hover:border-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                Login as Faculty <ChevronRight size={14} />
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all hover:border-blue-400 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Admin Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Manage academic courses, subjects, student/faculty accounts, master results ledger, and institution analytics.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-blue-800" /> User & Role Governance</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-blue-800" /> Course & Subject Management</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-blue-800" /> Institution KPI & CSV Export</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 bg-white border border-slate-300 text-slate-800 font-bold text-xs rounded-xl hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                Login as Admin <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Enterprise Grade Features</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              Designed from the ground up to uphold academic rigor, exam integrity, and seamless usability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 text-sm">A frictionless end-to-end examination lifecycle from question authoring to results.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-center relative flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-mono font-bold text-sm shadow-sm">
                    {s.num}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <section id="stats" className="py-16 bg-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="p-4">
                <div className="w-12 h-12 bg-blue-900/80 rounded-xl flex items-center justify-center mx-auto mb-3 text-blue-200">
                  <s.icon size={24} />
                </div>
                <p className="text-3xl sm:text-4xl font-black mb-1 tracking-tight text-white">{s.value}</p>
                <p className="text-blue-300 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center text-white">
                  <GraduationCap size={16} />
                </div>
                <span className="text-white font-bold text-sm">ExamPortal</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Modern academic online examination, automated assessment, and result publishing system.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[11px]">Portals</h4>
              <ul className="space-y-1.5">
                <li><a href="/login" className="hover:text-white transition-colors">Student Exam Hall</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Faculty Authoring</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Admin Governance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[11px]">System</h4>
              <ul className="space-y-1.5">
                <li><a href="#features" className="hover:text-white transition-colors">Proctoring Protocols</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Evaluation Engines</a></li>
                <li><a href="#stats" className="hover:text-white transition-colors">Institutional Scale</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[11px]">Institution</h4>
              <p className="text-slate-300">{UNIVERSITY_NAME}</p>
              <p className="text-slate-400 mt-1">support@examportal.edu</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {UNIVERSITY_NAME} — {APP_FULL_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
