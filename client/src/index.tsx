import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // loads tailwind

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>  
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  // Only register in production 
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered with scope:', registration.scope);
        })
        .catch(err => {
          console.error('SW registration failed:', err);
        });
    });
}