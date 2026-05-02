import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './store/store'
import { AuthProvider } from './features/auth/AuthContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0f0f16',
                color: '#e8e8f0',
                border: '1px solid rgba(120,120,180,0.22)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
              },
              success: { iconTheme: { primary: '#2dd4a0', secondary: '#0f0f16' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#0f0f16' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
