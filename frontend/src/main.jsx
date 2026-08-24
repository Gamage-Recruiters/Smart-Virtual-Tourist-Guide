import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.onerror = function(message, source, lineno, colno, error) {
  alert('Global Error: ' + message + '\n' + (error ? error.stack : ''));
};
window.addEventListener('unhandledrejection', function(event) {
  alert('Unhandled Promise Rejection: ' + event.reason);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
