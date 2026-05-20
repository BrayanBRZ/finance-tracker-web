import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authenticateUser } from '@/services/loginService';
import { loginSchema } from '@/schemas/loginSchema';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const handleLogin = async (data) => {
    setAuthError('');

    try {
      const response = await authenticateUser(data.email, data.password);

      localStorage.setItem('@agile:user', JSON.stringify(response.user));
      localStorage.setItem('@sicape:token', response.token);

      console.log('autenticado');
      navigate(`/dashboard`);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Ocorreu um erro inesperado.');
      }
    } finally {
    }
  };

  return {
    form,
    authError,
    handleLogin,
  };
}