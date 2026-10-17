import { mockQuestions, simulateDelay } from '../data/mockData';

let questions = [...mockQuestions];

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

  async create(data) {
    await simulateDelay(600);
    const newQ = {
      ...data,
      id: `Q${String(questions.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    questions.push(newQ);
    return newQ;
  },

  async update(id, data) {
    await simulateDelay(500);
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found');
    questions[idx] = { ...questions[idx], ...data };
    return questions[idx];
  },

  async delete(id) {
    await simulateDelay(400);
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found');
    questions.splice(idx, 1);
    return { message: 'Question deleted successfully' };
  },
};
