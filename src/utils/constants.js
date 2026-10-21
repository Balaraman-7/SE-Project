export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  SHORT_ANSWER: 'short_answer',
  DESCRIPTIVE: 'descriptive',
};

export const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice',
  true_false: 'True / False',
  fill_blank: 'Fill in the Blank',
  short_answer: 'Short Answer',
  descriptive: 'Descriptive',
};

export const EXAM_TYPES = {
  UNIT_TEST: 'unit_test',
  MIDTERM: 'midterm',
  FINAL: 'final',
  INTERNAL: 'internal',
  PRACTICAL: 'practical',
};

export const EXAM_TYPE_LABELS = {
  unit_test: 'Unit Test',
  midterm: 'Mid-Term',
  final: 'Final Exam',
  internal: 'Internal Assessment',
  practical: 'Practical Exam',
};

export const EXAM_STATUS = {
  DRAFT: 'draft',
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Administration',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const GRADES = {
  'A+': { min: 90, color: '#16a34a' },
  'A':  { min: 80, color: '#22c55e' },
  'B+': { min: 70, color: '#3b82f6' },
  'B':  { min: 60, color: '#6366f1' },
  'C':  { min: 50, color: '#f59e0b' },
  'D':  { min: 40, color: '#f97316' },
  'F':  { min: 0,  color: '#ef4444' },
};

export const APP_NAME = 'ExamPortal';
export const APP_FULL_NAME = 'Online Examination and Evaluation System';
export const UNIVERSITY_NAME = 'Academic Examination Portal';
