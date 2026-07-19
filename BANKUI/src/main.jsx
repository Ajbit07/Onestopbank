import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { LoaderProvider } from './context/LoaderContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              boxShadow:
                '0 1px 2px rgba(31,41,55,0.05), 0 10px 30px -18px rgba(31,41,55,0.25)',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#2563eb', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#ffffff' } },
          }}
        />
      </LoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
