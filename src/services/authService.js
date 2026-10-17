import { mockUsers, simulateDelay } from '../data/mockData';

export const authService = {
  async login(email, password) {
    await simulateDelay(800);
    const user = Object.values(mockUsers).find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...userWithoutPassword } = user;
    const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));
    return { user: userWithoutPassword, token };
  },

  async logout() {
    await simulateDelay(200);
    localStorage.removeItem('exam_token');
    localStorage.removeItem('exam_user');
  },

  async forgotPassword(email) {
    await simulateDelay(600);
    const user = Object.values(mockUsers).find((u) => u.email === email);
    if (!user) throw new Error('No account found with this email address');
    return { message: 'Password reset link sent to your email' };
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('exam_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('exam_token');
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  },
};
