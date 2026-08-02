import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'
import { DashboardPage } from './pages/Dashboard'
import { CategoriesPage } from './pages/Categories'
import { WalletSettingsPage } from './pages/WalletSettings'
import { TransactionsPage } from './pages/Transactions'
import { ForgotPasswordPage } from './pages/ForgotPassword'
import { ResetPasswordPage } from './pages/ResetPassword'
import AuthGuard from '@/components/guards/AuthGuard'
import GuestGuard from '@/components/guards/GuestGuard'
import { AppLayout } from '@/layouts/AppLayout'
import { WalletProvider } from '@/context/WalletProvider'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
          <Route path="/redefinir-senha/:token" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<AuthGuard />}>
          <Route
            element={
              <WalletProvider>
                <AppLayout />
              </WalletProvider>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/transacoes" element={<TransactionsPage />} />
            <Route path="/carteiras" element={<WalletSettingsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
