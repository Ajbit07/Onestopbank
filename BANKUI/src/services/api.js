import http from '../lib/http';

// Account API Endpoints — identical to the Angular ApiService

export const checkPinCreated = () => http.get('/account/pin/check');

export const createPin = (pin, password) =>
  http.post('/account/pin/create', { pin, password });

export const updatePin = (oldPin, newPin, password) =>
  http.post('/account/pin/update', { oldPin, newPin, password });

export const withdraw = (amount, pin) =>
  http.post('/account/withdraw', { amount, pin });

export const deposit = (amount, pin) =>
  http.post('/account/deposit', { amount, pin });

export const fundTransfer = (amount, pin, targetAccountNumber) =>
  http.post('/account/fund-transfer', { amount, pin, targetAccountNumber });

export const getTransactions = () => http.get('/account/transactions');

export const getAccountDetails = () => http.get('/dashboard/account');
