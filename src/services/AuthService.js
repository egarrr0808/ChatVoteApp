import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Update this to your server URL

class AuthService {
  constructor() {
    this.token = null;
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Request interceptor to add token to headers
    axios.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async register(username, email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        username,
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed',
      };
    }
  }

  async login(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        username,
        password,
      });

      if (response.data.token) {
        await this.setToken(response.data.token);
        await this.setUserData(response.data);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Login failed',
      };
    }
  }

  async logout() {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      this.token = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  }

  async getToken() {
    if (!this.token) {
      try {
        this.token = await AsyncStorage.getItem('authToken');
      } catch (error) {
        console.error('Error getting token:', error);
      }
    }
    return this.token;
  }

  async setToken(token) {
    try {
      this.token = token;
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async setUserData(userData) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  }

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  async getProfile() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to get profile',
      };
    }
  }
}

export default new AuthService();

