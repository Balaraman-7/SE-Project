import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock, AlertTriangle, CheckCircle, HelpCircle, Flag, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Shield, Camera, Volume2, Save, Send, ArrowLeft, RefreshCw,
  Info, Check, X, AlertCircle
} from 'lucide-react';
import { mockExams, mockQuestions, simulateDelay } from '../../data/mockData';
import { formatDuration } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const OnlineExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [visited, setVisited] = useState({ 0: true });
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [filterPalette, setFilterPalette] = useState('all');
  const [autoSaveStatus, setAutoSaveStatus] = useState('All changes saved');
  const [loading, setLoading] = useState(true);

  // Initialize Exam & Questions
  useEffect(() => {
    simulateDelay(500).then(() => {
      const foundExam = mockExams.find(e => e.id === id) || mockExams[0];
      const examQuestions = mockQuestions.filter(q => q.subjectId === foundExam.subjectId);
      const activeQuestions = examQuestions.length > 0 ? examQuestions : mockQuestions;
      
      setExam(foundExam);
      setQuestions(activeQuestions);
      setTimeLeft(foundExam.duration * 60);
      setLoading(false);
    });
  }, [id]);

  // Tab switch & proctoring detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setTabSwitches(prev => {
          const next = prev + 1;
          toast.error(`Security Alert: Tab switch detected! (Violation #${next})`, { duration: 4000 });
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted]);

  // Auto-submit countdown timer
  useEffect(() => {
    if (loading || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        if (prev === 300) {
          toast.error('5 minutes remaining! Please review your answers.', { duration: 5000 });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isSubmitted, timeLeft]);

  // Format timer into HH:MM:SS
  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectQuestion = (index) => {
    setCurrentIndex(index);
    setVisited(prev => ({ ...prev, [index]: true }));
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setAutoSaveStatus('Saving...');
    setTimeout(() => setAutoSaveStatus('All changes saved'), 600);
  };

  const handleToggleFlag = (index) => {
    setFlagged(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleClearAnswer = (questionId) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setAutoSaveStatus('Answer cleared');
    setTimeout(() => setAutoSaveStatus('All changes saved'), 600);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      handleSelectQuestion(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleSelectQuestion(currentIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentQ = questions[currentIndex];

  // Helper statuses for question palette
  const getQuestionStatus = (idx) => {
    const q = questions[idx];
    const isAnswered = q && answers[q.id] !== undefined && answers[q.id] !== '';
    const isFlag = !!flagged[idx];
    const isVis = !!visited[idx];

    if (isAnswered && isFlag) return 'answered-flagged';
    if (isAnswered) return 'answered';
    if (isFlag) return 'flagged';
    if (isVis) return 'visited';
    return 'not-visited';
  };

  // Stats calculation
  const totalCount = questions.length;
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const unattemptedCount = totalCount - answeredCount;

  const handleFinalSubmit = async (auto = false) => {
    setIsSubmitting(true);
    setShowSubmitModal(false);

    await simulateDelay(1200);

    // Calculate score for auto-evaluable questions (MCQ, True/False)
    let score = 0;
    let maxObjectiveScore = 0;

    questions.forEach(q => {
      if (q.type === 'mcq' || q.type === 'true_false') {
        maxObjectiveScore += q.marks;
        if (answers[q.id] === q.correctAnswer) {
          score += q.marks;
        } else if (answers[q.id] !== undefined && exam?.negativeMarking) {
          score = Math.max(0, score - (exam.negativeMarksValue || 0.25));
        }
      }
    });

    const resultData = {
      score,
      maxObjectiveScore,
      totalMarks: exam?.totalMarks || 100,
      answeredCount,
      unattemptedCount,
      tabSwitches,
      timeTakenSeconds: (exam?.duration * 60) - timeLeft,
      submittedAt: new Date().toLocaleTimeString(),
    };

    setSubmitResult(resultData);
    setIsSubmitted(true);
    setIsSubmitting(false);

    if (auto) {
      toast.success('Exam auto-submitted as time expired.');
    } else {
      toast.success('Examination submitted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Securing examination environment...</p>
      </div>
    );
  }

  // Submission Completed Success Screen
  if (isSubmitted && submitResult) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden text-center p-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
            <CheckCircle size={44} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Examination Submitted Successfully!</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Your responses for <span className="font-semibold text-gray-800">{exam?.title}</span> have been recorded securely in the academic portal.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-left">
            <div>
              <p className="text-xs text-gray-400">Total Questions</p>
              <p className="text-lg font-bold text-gray-800">{totalCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Answered</p>
              <p className="text-lg font-bold text-green-600">{submitResult.answeredCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Unanswered</p>
              <p className="text-lg font-bold text-red-500">{submitResult.unattemptedCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Time Taken</p>
              <p className="text-lg font-bold text-blue-800">{formatDuration(Math.ceil(submitResult.timeTakenSeconds / 60))}</p>
            </div>
          </div>

          {submitResult.tabSwitches > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs flex items-center justify-center gap-2 mb-6">
              <AlertTriangle size={16} className="text-amber-600" />
              <span>Proctoring Alert: {submitResult.tabSwitches} window/tab switch events recorded for faculty review.</span>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-8 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Preliminary Objective Score</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Auto-Evaluated</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-900">{submitResult.score}</span>
              <span className="text-sm text-gray-500">/ {submitResult.maxObjectiveScore} marks (Objective Section)</span>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              * Subjective and descriptive questions are pending faculty evaluation. Final grade card will be published soon.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2.5 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-sm"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate('/student/results')}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              View My Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 -m-6 flex flex-col">
      {/* Top Examination Navigation Bar */}
      <header className="bg-blue-950 text-white px-6 py-3 border-b border-blue-900 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-900/60 px-3 py-1.5 rounded-lg border border-blue-800">
            <Shield size={16} className="text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide text-blue-100">PROCTORED EXAM</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">{exam?.title}</h1>
            <p className="text-xs text-blue-300 mt-0.5">{exam?.subjectName} ({exam?.code})</p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-blue-300">
            <Save size={14} className="text-emerald-400" />
            <span>{autoSaveStatus}</span>
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono font-bold text-base shadow-inner ${
            timeLeft < 300
              ? 'bg-red-600 text-white animate-pulse'
              : timeLeft < 900
              ? 'bg-amber-600 text-white'
              : 'bg-blue-900 text-emerald-300 border border-blue-700'
          }`}>
            <Clock size={18} />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 bg-blue-900/80 text-blue-200 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Send size={14} /> Submit Exam
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Question Panel (Left 70-75%) */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
          {currentQ ? (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {/* Question Header Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-900 rounded-md">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Type: {currentQ.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      +{currentQ.marks} Marks
                    </span>
                    {exam?.negativeMarking && (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                        -{exam.negativeMarksValue || 0.25} Negative
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <div className="text-gray-900 text-base font-medium leading-relaxed mb-6">
                  {currentQ.questionText}
                </div>

                {/* Question Options / Inputs based on Type */}
                <div className="space-y-3">
                  {/* Single Choice MCQ */}
                  {currentQ.type === 'mcq' && (
                    <div className="space-y-2.5">
                      {currentQ.options?.map((opt, oIdx) => {
                        const isSelected = answers[currentQ.id] === opt;
                        return (
                          <label
                            key={oIdx}
                            onClick={() => handleAnswerChange(currentQ.id, opt)}
                            className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                                : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentQ.id}`}
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                            />
                            <span className="font-semibold text-xs text-gray-400 w-5">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span className="text-sm font-medium">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* True / False */}
                  {currentQ.type === 'true_false' && (
                    <div className="grid grid-cols-2 gap-4">
                      {['True', 'False'].map((tf) => {
                        const isSelected = answers[currentQ.id] === tf;
                        return (
                          <button
                            key={tf}
                            type="button"
                            onClick={() => handleAnswerChange(currentQ.id, tf)}
                            className={`py-4 px-6 rounded-xl border text-center font-bold text-base transition-all ${
                              isSelected
                                ? 'bg-blue-800 border-blue-800 text-white shadow-md'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {tf}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Fill In Blank */}
                  {currentQ.type === 'fill_blank' && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-600">Type your answer below:</label>
                      <input
                        type="text"
                        placeholder="Enter exact word or phrase..."
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent font-medium"
                      />
                    </div>
                  )}

                  {/* Subjective / Descriptive */}
                  {(currentQ.type === 'descriptive' || currentQ.type === 'subjective') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Write your detailed explanation below:</span>
                        <span>Word count: {(answers[currentQ.id] || '').split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                      <textarea
                        rows={7}
                        placeholder="Provide structured reasoning, definitions, steps, or code syntax..."
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent font-normal resize-y"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Controls */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFlag(currentIndex)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                      flagged[currentIndex]
                        ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
                        : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <Flag size={14} className={flagged[currentIndex] ? 'fill-purple-600 text-purple-600' : ''} />
                    {flagged[currentIndex] ? 'Flagged for Review' : 'Mark for Review'}
                  </button>

                  {answers[currentQ.id] !== undefined && (
                    <button
                      onClick={() => handleClearAnswer(currentQ.id)}
                      className="px-3 py-2 text-xs text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Clear Response
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-5 py-2 bg-blue-800 text-white rounded-lg text-xs font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                    >
                      Save & Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Review & Submit <Send size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Sidebar: Proctoring feed & Question Palette */}
        <div className="w-full lg:w-80 bg-white border-l border-gray-200 p-5 flex flex-col gap-5 overflow-y-auto">
          {/* Proctoring Camera Feed Mockup */}
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-800 relative">
            <div className="aspect-video bg-gray-950 flex flex-col items-center justify-center relative p-3 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center bg-gray-900/60 mb-2">
                <Camera size={24} className="text-emerald-400 animate-pulse" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                ● AI Proctor Active
              </span>
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-gray-300">
                <Volume2 size={11} className="text-emerald-400" /> Mic: Normal
              </div>
              <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-gray-300">
                {user?.name?.split(' ')[0] || 'Student'}
              </div>
            </div>
            {tabSwitches > 0 && (
              <div className="bg-red-600 text-white text-[11px] px-3 py-1 text-center font-bold">
                Tab Switches: {tabSwitches} Warning(s)
              </div>
            )}
          </div>

          {/* Question Summary Stats */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-700 mb-2.5">Progress Overview</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-600">Answered: <strong>{answeredCount}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-gray-600">Unanswered: <strong>{unattemptedCount}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-gray-600">Flagged: <strong>{flaggedCount}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-gray-600">Total: <strong>{totalCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Palette Filter */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700">Question Palette</span>
            <select
              value={filterPalette}
              onChange={(e) => setFilterPalette(e.target.value)}
              className="text-[11px] border border-gray-200 rounded px-2 py-1 bg-white"
            >
              <option value="all">All ({totalCount})</option>
              <option value="answered">Answered ({answeredCount})</option>
              <option value="unanswered">Unanswered ({unattemptedCount})</option>
              <option value="flagged">Flagged ({flaggedCount})</option>
            </select>
          </div>

          {/* Question Numbers Grid */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const status = getQuestionStatus(idx);
              const isCurrent = currentIndex === idx;

              // Filter logic
              if (filterPalette === 'answered' && status !== 'answered' && status !== 'answered-flagged') return null;
              if (filterPalette === 'unanswered' && (status === 'answered' || status === 'answered-flagged')) return null;
              if (filterPalette === 'flagged' && !status.includes('flagged')) return null;

              let btnStyle = 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
              if (status === 'answered') btnStyle = 'bg-emerald-600 text-white border-emerald-700';
              if (status === 'flagged') btnStyle = 'bg-purple-600 text-white border-purple-700';
              if (status === 'answered-flagged') btnStyle = 'bg-purple-600 text-white border-purple-700 ring-2 ring-emerald-400';
              if (status === 'visited') btnStyle = 'bg-red-500 text-white border-red-600';

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuestion(idx)}
                  className={`h-9 rounded-lg font-bold text-xs border transition-all relative flex items-center justify-center ${btnStyle} ${
                    isCurrent ? 'ring-2 ring-blue-900 ring-offset-2 scale-105' : ''
                  }`}
                >
                  {idx + 1}
                  {status === 'answered-flagged' && (
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Final Submit Prompt in Sidebar */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <Button
              variant="success"
              className="w-full justify-center"
              onClick={() => setShowSubmitModal(true)}
            >
              Finish & Submit Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Confirm Final Submission"
        size="md"
      >
        <div className="space-y-4 text-sm text-gray-700">
          <p className="text-gray-600">
            Are you sure you want to submit your examination? Once submitted, you cannot change any answers.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Questions:</span>
              <strong className="text-gray-800">{totalCount}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Questions Answered:</span>
              <strong className="text-emerald-700">{answeredCount}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Unanswered Questions:</span>
              <strong className="text-red-600">{unattemptedCount}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Marked for Review:</span>
              <strong className="text-purple-700">{flaggedCount}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time Remaining:</span>
              <strong className="text-blue-800 font-mono">{formatTimer(timeLeft)}</strong>
            </div>
          </div>

          {unattemptedCount > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
              <span>You have <strong>{unattemptedCount} unanswered</strong> questions. Are you sure you wish to submit now?</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
              Resume Exam
            </Button>
            <Button variant="success" loading={isSubmitting} onClick={() => handleFinalSubmit(false)}>
              Yes, Submit Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OnlineExam;
