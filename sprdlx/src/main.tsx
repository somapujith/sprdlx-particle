import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { isChromeMotifPath } from './lib/chromeMotifPaths';
import './index.css';

if (isChromeMotifPath(window.location.pathname)) {
  document.documentElement.dataset.motif = 'chrome';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
