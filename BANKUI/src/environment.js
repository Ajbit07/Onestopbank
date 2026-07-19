export const environment = {
  production: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8180/api',
  tokenName: 'authToken',
  origin: window.location.origin,
};
