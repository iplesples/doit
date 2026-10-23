import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dev from './Dev'
import App from './App'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)