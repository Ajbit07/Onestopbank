import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { environment } from '../environment';

export function getToken() {
  return localStorage.getItem(environment.tokenName);
}

export function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded && decoded.exp && decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function isLoggedIn() {
  const token = getToken();
  return !!token && isTokenValid(token);
}

export function getAccountNumberFromToken() {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.sub;
    } catch {
      return null;
    }
  }
  return null;
}

/** Extract a human-readable message from an axios error (mirrors Angular's `error.error`). */
export function errorMessage(error, fallback = 'Something went wrong') {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (error?.message) return error.message;
  return fallback;
}

const http = axios.create({
  baseURL: environment.apiUrl,
});

// Endpoints that must never carry an Authorization header
const PUBLIC_PATHS = [
  '/users/register',
  '/users/login',
  '/users/generate-otp',
  '/users/verify-otp',
  '/auth/password-reset',
];

// Request interceptor — mirrors the Angular AuthInterceptor
http.interceptors.request.use((config) => {
  if (PUBLIC_PATHS.some((p) => config.url?.startsWith(p))) {
    return config;
  }
  const token = getToken();
  if (token) {
    if (isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Token expired/invalid: clear and redirect to login
      localStorage.clear();
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login';
    }
  }
  return config;
});

// Response interceptor — handle 401 like the Angular app
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      toast.error('Unauthorized access. Please log in again.');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default http;
