import { mockExams, simulateDelay, getGrade } from '../data/mockData';
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
  if (storageKey !== EXAMS_STORAGE_KEY) return parsedValue;

  const storedIds = new Set(parsedValue.map(item => item.id));
  const sampleExams = mockExams.filter(
    exam => exam.id.startsWith('DEMO-') && !storedIds.has(exam.id)
  );
  const mergedExams = [...parsedValue, ...sampleExams];
  if (sampleExams.length) {
    localStorage.setItem(storageKey, JSON.stringify(mergedExams));
  }
  return mergedExams;
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

const isManualQuestion = question => ['code', 'descriptive', 'short_answer', 'fill_blank'].includes(question.type);

const normalizeSubmissionScore = (submission, exam, questionsData) => {
  const totalMarks = Number(exam.totalMarks) || 0;
  const rawQuestionMarks = questionsData.reduce((sum, question) => sum + (Number(question.marks) || 0), 0);
  const scoreScale = rawQuestionMarks > 0 ? totalMarks / rawQuestionMarks : 1;
  const rawManualScore = Object.values(submission.evaluations || {})
    .reduce((sum, evaluation) => sum + (Number(evaluation.marks) || 0), 0);
  const storedScore = Number(submission.score) || 0;
  const rawObjectiveScore = Number.isFinite(submission.rawObjectiveScore)
    ? submission.rawObjectiveScore
    : Math.max(0, storedScore - (submission.evaluatedAt ? rawManualScore : 0));
  const rawMaxObjectiveScore = Number.isFinite(submission.rawMaxObjectiveScore)
    ? submission.rawMaxObjectiveScore
    : Number(submission.maxObjectiveScore) || 0;
  const score = Math.round(Math.min(totalMarks, (rawObjectiveScore + rawManualScore) * scoreScale) * 100) / 100;
  const maxObjectiveScore = Math.min(totalMarks, rawMaxObjectiveScore * scoreScale);
  const normalized = {
    ...submission,
    rawObjectiveScore,
    rawMaxObjectiveScore,
    scoreScale,
    score,
    maxObjectiveScore,
  };

  if (submission.evaluatedAt) {
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const passingMarks = exam.passingMarks ?? exam.passMarks ?? Math.ceil(totalMarks * 0.4);
    return {
      ...normalized,
      percentage,
      grade: getGrade(percentage),
      resultStatus: score >= passingMarks ? 'pass' : 'fail',
    };
  }

  return normalized;
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

    const questionsData = await questionService.getByIds(exam.questions || []);
    const scoredSubmission = normalizeSubmissionScore({
      ...submission,
      rawObjectiveScore: Number(submission.score) || 0,
      rawMaxObjectiveScore: Number(submission.maxObjectiveScore) || 0,
    }, exam, questionsData);
    const savedSubmission = {
      ...scoredSubmission,
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

  async getPendingEvaluations(facultyId) {
    await simulateDelay(400);
    const pending = [];

    for (const submission of submissions) {
      if (submission.evaluatedAt) continue;
      const exam = exams.find(item => item.id === submission.examId);
      if (!exam || (facultyId && exam.faculty !== facultyId)) continue;

      const questionsData = await questionService.getByIds(exam.questions || []);
      const manualQuestions = questionsData.filter(isManualQuestion);
      if (!manualQuestions.length) continue;

      const answers = questionsData.map(question => {
        const answer = submission.answers?.[question.id] ?? '';
        const isCorrect = ['mcq', 'true_false'].includes(question.type)
          ? answer === question.correctAnswer
          : null;
        return {
          questionId: question.id,
          question,
          answer,
          language: submission.codeLanguages?.[question.id] || '',
          isCorrect,
          marksObtained: isCorrect ? question.marks : 0,
          facultyComment: submission.evaluations?.[question.id]?.comment || '',
        };
      });

      pending.push({
        ...submission,
        examTitle: exam.title,
        subject: exam.subjectName,
        totalMarks: exam.totalMarks,
        questionsData,
        answers,
        evaluations: submission.evaluations || {},
      });
    }

    return pending;
  },

  async saveEvaluation(submissionId, evaluations, publish = false) {
    await simulateDelay(400);
    const submissionIndex = submissions.findIndex(item => item.id === submissionId);
    if (submissionIndex === -1) throw new Error('Exam submission not found');

    const submission = submissions[submissionIndex];
    const exam = exams.find(item => item.id === submission.examId);
    if (!exam) throw new Error('Exam not found');
    const questionsData = await questionService.getByIds(exam.questions || []);
    const scoredSubmission = normalizeSubmissionScore(submission, exam, questionsData);
    const manualQuestions = questionsData.filter(isManualQuestion);

    const normalizedEvaluations = { ...(scoredSubmission.evaluations || {}) };
    for (const question of manualQuestions) {
      const evaluation = evaluations[question.id];
      if (!evaluation || evaluation.marks === '' || evaluation.marks === undefined) {
        if (publish) throw new Error('Assign marks to every written and coding answer before submitting the evaluation.');
        delete normalizedEvaluations[question.id];
        continue;
      }
      const marks = Number(evaluation.marks);
      if (!Number.isFinite(marks) || marks < 0 || marks > question.marks) {
        throw new Error(`Marks for ${question.id} must be between 0 and ${question.marks}.`);
      }
      normalizedEvaluations[question.id] = {
        marks,
        comment: String(evaluation.comment || ''),
      };
    }

    let updatedSubmission = {
      ...scoredSubmission,
      evaluations: normalizedEvaluations,
      evaluationSavedAt: new Date().toISOString(),
    };

    if (publish) {
      const manualScore = manualQuestions.reduce(
        (sum, question) => sum + normalizedEvaluations[question.id].marks,
        0
      );
      const totalMarks = exam.totalMarks || 0;
      const marksObtained = Math.round(Math.min(
        totalMarks,
        (scoredSubmission.rawObjectiveScore + manualScore) * scoredSubmission.scoreScale
      ) * 100) / 100;
      const percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;
      const passingMarks = exam.passingMarks ?? exam.passMarks ?? Math.ceil(totalMarks * 0.4);

      updatedSubmission = {
        ...updatedSubmission,
        score: marksObtained,
        percentage,
        grade: getGrade(percentage),
        resultStatus: marksObtained >= passingMarks ? 'pass' : 'fail',
        evaluatedAt: new Date().toISOString(),
      };
    }

    submissions[submissionIndex] = updatedSubmission;
    saveSubmissions();
    return updatedSubmission;
  },

  async getStudentSubmission(examId, studentId) {
    await simulateDelay(200);
    const submission = submissions.find(
      submission => submission.examId === examId && submission.studentId === studentId
    ) || null;
    if (!submission) return null;
    const exam = exams.find(item => item.id === examId);
    if (!exam) throw new Error('Exam not found');
    const questionsData = await questionService.getByIds(exam.questions || []);
    const normalized = normalizeSubmissionScore(submission, exam, questionsData);
    submissions = submissions.map(item => item.id === submission.id ? normalized : item);
    saveSubmissions();
    return normalized;
  },

  async getStudentSubmissions(studentId) {
    await simulateDelay(300);
    const studentSubmissions = submissions.filter(submission => submission.studentId === studentId);
    const normalizedSubmissions = await Promise.all(studentSubmissions.map(async submission => {
      const exam = exams.find(item => item.id === submission.examId);
      if (!exam) return submission;
      const questionsData = await questionService.getByIds(exam.questions || []);
      return normalizeSubmissionScore(submission, exam, questionsData);
    }));
    const normalizedById = new Map(normalizedSubmissions.map(submission => [submission.id, submission]));
    submissions = submissions.map(submission => normalizedById.get(submission.id) || submission);
    saveSubmissions();
    return normalizedSubmissions;
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
