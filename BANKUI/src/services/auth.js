import http from '../lib/http';

// Auth/User API Endpoints — identical to the Angular AuthService

export const registerUser = (data) => http.post('/users/register', data);

export const getUserDetails = () => http.get('/dashboard/user');

export const updateUserProfile = (payload) =>
  http.post('/users/update', payload);

export const generateOTP = (identifier) =>
  http.post('/users/generate-otp', { identifier });

export const verifyOTP = (otpVerificationRequest) =>
  http.post('/users/verify-otp', otpVerificationRequest);

export const login = (identifier, password) =>
  http.post('/users/login', { identifier, password });

export const logOutUser = () => http.get('/users/logout');

// Password reset
export const sendOtpForPasswordReset = (identifier) =>
  http.post('/auth/password-reset/send-otp', { identifier });

export const verifyOtpForPasswordReset = (identifier, otp) =>
  http.post('/auth/password-reset/verify-otp', { identifier, otp });

export const resetPassword = (identifier, resetToken, newPassword) =>
  http.post('/auth/password-reset', { identifier, resetToken, newPassword });
