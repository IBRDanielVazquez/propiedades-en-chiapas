import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
  } catch (err) {
    console.error('Fatal React Mount Error:', err);
    rootElement.innerHTML = `
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;padding:2rem;text-align:center;background:#0f172a;color:#fff;">
        <div style="font-size:3rem;margin-bottom:1rem;">🏡</div>
        <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:.5rem;">Propiedades en Chiapas</h2>
        <p style="color:#94a3b8;margin-bottom:1.5rem;max-width:400px;">Portal inmobiliario. Haz clic abajo para recargar la aplicación.</p>
        <button onclick="window.location.reload(true)" style="background:#10b981;color:#fff;border:none;border-radius:20px;padding:12px 28px;font-weight:700;cursor:pointer;">
          🔄 Recargar Portal
        </button>
      </div>
    `;
  }
}
