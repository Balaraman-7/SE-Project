import { mockExams, simulateDelay } from '../data/mockData';
import { questionService } from './questionService';

const EXAMS_STORAGE_KEY = 'exam_assignments';
const SUBMISSIONS_STORAGE_KEY = 'exam_submissions';

const loadCollection = (storageKey, initialValue, label) => {
  const storedValue = localStorage.getItem(storageKey);
  if (!storedValue) return [...initialValue];

  const parsedValue = JSON.parse(storedValue);
  if (!Array.isArray(parsedValue)) {
    throw new Error(`Saved ${label} data is invalid. Clear the ${storageKey} browser storage and try again.`);
  }
  return parsedValue;
};

let exams = loadCollection(EXAMS_STORAGE_KEY, mockExams, 'exam');
let submissions = loadCollection(SUBMISSIONS_STORAGE_KEY, [], 'submission');

const saveExams = () => {
  localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
};

const saveSubmissions = () => {
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
};

const nextId = (items, prefix) => {
  const maxId = Math.max(0, ...items.map(item => Number(item.id.replace(/\D/g, '')) || 0));
  return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
};

export const examService = {
  async getAll(filters = {}) {
    await simulateDelay(500);
    let result = [...exams];
    if (filters.status) result = result.filter(e => e.status === filters.status);
    if (filters.subject) result = result.filter(e => e.subject === filters.subject);
    if (filters.faculty) result = result.filter(e => e.faculty === filters.faculty);
    return result;
  },

  async getById(id) {
    await simulateDelay(400);
    const exam = exams.find(e => e.id === id);
    if (!exam) throw new Error('Exam not found');
    const questionsData = await questionService.getByIds(exam.questions || []);
    return { ...exam, questionsData };
  },

  async create(data) {
    await simulateDelay(700);
    const newExam = {
      ...data,
      id: nextId(exams, 'EX'),
      status: 'upcoming',
      isPublished: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    exams.push(newExam);
    saveExams();
    return newExam;
  },

  async update(id, data) {
    await simulateDelay(500);
    const idx = exams.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    exams[idx] = { ...exams[idx], ...data };
    saveExams();
    return exams[idx];
  },

  async delete(id) {
    await simulateDelay(400);
    const idx = exams.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    exams.splice(idx, 1);
    saveExams();
    return { message: 'Exam deleted successfully' };
  },

  async publish(id) {
    await simulateDelay(400);
    const idx = exams.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    exams[idx].isPublished = true;
    saveExams();
    return exams[idx];
  },

  async submitExam(examId, submission) {
    await simulateDelay(800);
    const exam = exams.find(e => e.id === examId);
    if (!exam) throw new Error('Exam not found');
    if (!submission.studentId) throw new Error('A student account is required to submit an examination.');
    const existingSubmission = submissions.find(
      saved => saved.examId === examId && saved.studentId === submission.studentId
    );
    if (existingSubmission) throw new Error('You have already submitted this examination.');

    const savedSubmission = {
      ...submission,
      id: `SUB${Date.now()}`,
      examId,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };
    submissions.push(savedSubmission);
    saveSubmissions();
    return savedSubmission;
  },

  async getSubmissions(examId) {
    await simulateDelay(300);
    return submissions.filter(submission => submission.examId === examId);
  },

  async getStudentSubmission(examId, studentId) {
    await simulateDelay(200);
    return submissions.find(
      submission => submission.examId === examId && submission.studentId === studentId
    ) || null;
  },

  async getStudentSubmissions(studentId) {
    await simulateDelay(300);
    return submissions.filter(submission => submission.studentId === studentId);
  },

  async getAvailableForStudent(studentId) {
    await simulateDelay(500);
    return exams
      .filter(e => e.isPublished && ['upcoming', 'ongoing', 'completed'].includes(e.status))
      .map(exam => {
        const submission = submissions.find(
          saved => saved.examId === exam.id && saved.studentId === studentId
        );
        return { ...exam, hasSubmitted: !!submission, submission };
      });
  },
};
