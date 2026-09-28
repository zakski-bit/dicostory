import CONFIG from '../config';
import ENDPOINTS from './api';

class AuthModel {
  static getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  }

  static setToken(token) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
  }

  static getUser() {
    try {
      const userStr = localStorage.getItem(CONFIG.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static setUser(user) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated() {
    const token = this.getToken();
    return Boolean(token && token.trim().length > 0);
  }

  static logout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  }

  static async register({ name, email, password }) {
    if (!name || name.trim().length === 0) {
      throw new Error('Nama lengkap tidak boleh kosong.');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Alamat email tidak valid.');
    }
    if (!password || password.length < 8) {
      throw new Error('Kata sandi harus terdiri dari minimal 8 karakter.');
    }

    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Pendaftaran gagal. Silakan coba kembali.');
    }

    return data;
  }

  static async login({ email, password }) {
    if (!email || !email.includes('@')) {
      throw new Error('Masukkan alamat email yang valid.');
    }
    if (!password || password.length < 8) {
      throw new Error('Kata sandi harus terdiri dari minimal 8 karakter.');
    }

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
    }

    if (data.loginResult && data.loginResult.token) {
      this.setToken(data.loginResult.token);
      this.setUser({
        userId: data.loginResult.userId,
        name: data.loginResult.name,
      });
    }

    return data;
  }
}

export default AuthModel;
