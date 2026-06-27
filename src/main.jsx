import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Itha import pannunga
import { HelmetProvider } from 'react-helmet-async'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App-a HelmetProvider kulla wrap pannunga */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);