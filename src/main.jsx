import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <a href="#main-content" className="skip-link">Ir al contenido principal</a>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
