import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authenticateUser } from '@/services/loginService';
import { loginSchema } from '@/schemas/loginSchema';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const handleLogin = async (data) => {

    try {
      const response = await authenticateUser(data.email, data.password);
      console.log("chegou")
      console.log(response)

      localStorage.setItem('@project:user', JSON.stringify(response.user));
      localStorage.setItem('@project:token', response.token);

      console.log('autenticado');
      navigate(`/dashboard`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado';
      form.setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };

  return {
    form,
    handleLogin,
  };
}