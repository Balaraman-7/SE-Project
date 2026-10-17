import { mockResults, simulateDelay, getGrade } from '../data/mockData';

let results = [...mockResults];

export const resultService = {
  async getAll(filters = {}) {
    await simulateDelay(500);
    let r = [...results];
    if (filters.studentId) r = r.filter(res => res.studentId === filters.studentId);
    if (filters.examId) r = r.filter(res => res.examId === filters.examId);
    return r;
  },

  async getById(id) {
    await simulateDelay(300);
    const result = results.find(r => r.id === id);
    if (!result) throw new Error('Result not found');
    return result;
  },

  async getStudentResults(studentId) {
    await simulateDelay(500);
    return results.filter(r => r.studentId === studentId);
  },

  async saveEvaluation(resultId, evaluations) {
    await simulateDelay(600);
    const idx = results.findIndex(r => r.id === resultId);
    if (idx === -1) throw new Error('Result not found');
    const totalObjMarks = results[idx].answers.reduce((sum, a) => {
      const ev = evaluations[a.questionId];
      return sum + (ev !== undefined ? ev.marks : (a.marksObtained || 0));
    }, 0);
    results[idx] = {
      ...results[idx],
      marksObtained: totalObjMarks,
      percentage: Math.round((totalObjMarks / results[idx].totalMarks) * 100),
      grade: getGrade(Math.round((totalObjMarks / results[idx].totalMarks) * 100)),
      evaluatedAt: new Date().toISOString(),
    };
    return results[idx];
  },

  async getPendingEvaluations(facultyId) {
    await simulateDelay(500);
    return results.filter(r => !r.evaluatedAt);
  },
};
