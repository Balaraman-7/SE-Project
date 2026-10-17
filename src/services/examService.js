import { mockExams, mockQuestions, simulateDelay } from '../data/mockData';

let exams = [...mockExams];

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
    const questions = exam.questions
      .map(qId => mockQuestions.find(q => q.id === qId))
      .filter(Boolean);
    return { ...exam, questionsData: questions };
  },

  async create(data) {
    await simulateDelay(700);
    const newExam = {
      ...data,
      id: `EX${String(exams.length + 1).padStart(3, '0')}`,
      status: 'upcoming',
      isPublished: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    exams.push(newExam);
    return newExam;
  },

  async update(id, data) {
    await simulateDelay(500);
    const idx = exams.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    exams[idx] = { ...exams[idx], ...data };
    return exams[idx];
  },

  async delete(id) {
    await simulateDelay(400);
    const idx = exams.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    exams.splice(idx, 1);
    return { message: 'Exam deleted successfully' };
  },

  async publish(id) {
    await simulateDelay(400);
    const idx = exams.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Exam not found');
    exams[idx].isPublished = true;
    return exams[idx];
  },

  async submitExam(examId, answers) {
    await simulateDelay(800);
    return {
      examId,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      message: 'Exam submitted successfully',
    };
  },

  async getAvailableForStudent(studentId) {
    await simulateDelay(500);
    return exams.filter(e => e.isPublished && ['upcoming', 'ongoing'].includes(e.status));
  },
};
