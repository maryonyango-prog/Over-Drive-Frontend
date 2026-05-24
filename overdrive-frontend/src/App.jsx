import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './Context/AuthContext'
import { ToastProvider } from './Context/ToastContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </Router>
  )
}

export default App