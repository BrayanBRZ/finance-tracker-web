import { Link } from "react-router-dom";
import {
  AuthScreenLayout,
  AuthFormLayout,
  AuthFormHeader,
} from "@/components/auth/AuthLayout";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormPasswordField } from "@/components/forms/FormPasswordField";
import { PasswordStrength } from "@/components/forms/PasswordStrength";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { ErrorSpan } from "../forms/ErrorSpan";
import { FormInputField } from "../forms/FormInputField";

export function RegisterForm() {
  const {
    form: {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useRegisterForm();

  return (
    <AuthScreenLayout visualSide="left">
      <AuthFormLayout onSubmit={handleSubmit(onSubmit)}>
          <AuthFormHeader
            title="Criar conta"
            description="Já tem uma conta?"
            action={
              <Link
                to="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Efetuar login
              </Link>
            }
          />

          <FormInputField
            id="name"
            label="Nome completo"
            autoComplete="name"
            placeholder="Seu nome"
            {...register("name")}
            disabled={isSubmitting}
            error={errors.name?.message}
          />

          <FormInputField
            id="register-email"
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="nome@exemplo.com"
            {...register("email")}
            disabled={isSubmitting}
            error={errors.email?.message}
          />

          <FormPasswordField
            id="register-password"
            label="Senha"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            {...register("password")}
            disabled={isSubmitting}
            error={errors.password?.message}
            labelAddon={<PasswordStrength password={watch("password", "")} />}
          />

          <FormPasswordField
            id="confirm-password"
            label="Confirmar senha"
            autoComplete="new-password"
            placeholder="Repita a senha"
            {...register("confirmPassword")}
            disabled={isSubmitting}
            error={errors.confirmPassword?.message}
          />

          <SubmitButton
            buttonText="Cadastrar-se"
            isSubmitting={isSubmitting}
            className="mt-3 h-10 w-full"
          />

          <ErrorSpan
            error={errors.root?.server?.message}
            className="text-center"
          />
      </AuthFormLayout>
    </AuthScreenLayout>
  );
}
