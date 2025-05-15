import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CompetitionProvider } from './contexts/CompetitionContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CompetitionProvider>
      <App />
    </CompetitionProvider>
  </StrictMode>,
)
