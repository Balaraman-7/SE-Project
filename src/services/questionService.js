import { mockQuestions, simulateDelay } from '../data/mockData';

const QUESTIONS_STORAGE_KEY = 'exam_questions';

const loadQuestions = () => {
  const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
  if (!storedQuestions) return [...mockQuestions];

  const parsedQuestions = JSON.parse(storedQuestions);
  if (!Array.isArray(parsedQuestions)) {
    throw new Error('Saved questions data is invalid. Clear the exam_questions browser storage and try again.');
  }
  return parsedQuestions;
};

let questions = loadQuestions();

const saveQuestions = () => {
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
};

export const questionService = {
  async getAll(filters = {}) {
    await simulateDelay(500);
    let result = [...questions];
    if (filters.subject) result = result.filter(q => q.subject === filters.subject);
    if (filters.type) result = result.filter(q => q.type === filters.type);
    if (filters.difficulty) result = result.filter(q => q.difficulty === filters.difficulty);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(q => q.text.toLowerCase().includes(s));
    }
    return result;
  },

  async getById(id) {
    await simulateDelay(300);
    const q = questions.find(q => q.id === id);
    if (!q) throw new Error('Question not found');
    return q;
  },

  async getByIds(ids) {
    await simulateDelay(300);
    return ids.map(id => questions.find(q => q.id === id)).filter(Boolean);
  },

  async create(data) {
    await simulateDelay(600);
    const nextId = Math.max(0, ...questions.map(q => Number(q.id.replace(/\D/g, '')) || 0)) + 1;
    const newQ = {
      ...data,
      id: `Q${String(nextId).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    questions.push(newQ);
    saveQuestions();
    return newQ;
  },

  async update(id, data) {
    await simulateDelay(500);
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found');
    questions[idx] = { ...questions[idx], ...data };
    saveQuestions();
    return questions[idx];
  },

  async delete(id) {
    await simulateDelay(400);
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found');
    questions.splice(idx, 1);
    saveQuestions();
    return { message: 'Question deleted successfully' };
  },
};
