import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authenticateUser } from '@/services/loginService';
import { loginSchema } from '@/schemas/loginSchema';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '@/utils/auth';
import { AppError } from '@/utils/appError'

export function useLogin() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      rememberMe: false
    }
  });

  const handleLogin = async (data) => {

    try {
      const response = await authenticateUser(data.email, data.password);

      clearAuth(); 

      const storage = data.rememberMe ? localStorage : sessionStorage;

      storage.setItem('@project:token', response.token);
      storage.setItem('@project:user', JSON.stringify(response.user));

      console.log('autenticado');
      navigate(`/dashboard`);

    } catch (error) {
      if (error instanceof AppError) {
        if (error.field) { // Para campos específicos
          form.setError(error.field, {
            type: 'server',
            message: error.message,
          });
        } else { // Sem campos específicos
          form.setError('root', {
            type: 'server',
            message: error.message,
          });
        }
      } else { // Exceções sem tratamento
        form.setError('root', {
          type: 'server',
          message: 'Ocorreu um erro inesperado no sistema. Tente novamente mais tarde.',
        });
      }
    }
  };

  return {
    form,
    handleLogin,
  };
}