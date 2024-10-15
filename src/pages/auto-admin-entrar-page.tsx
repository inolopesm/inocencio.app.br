import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { ApiError, api } from "../lib/api";
import { useAuthStore } from "../stores/auth-store";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Por favor informe seu email")
    .max(255, "Email muito longo"),
  password: z
    .string()
    .min(1, "Por favor informe sua senha")
    .max(64, "Senha muito longa"),
});

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [errors, setError] =
    useState<z.inferFlattenedErrors<typeof FormSchema>>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parseResult = FormSchema.safeParse({
      email,
      password,
    } satisfies z.infer<typeof FormSchema>);

    if (!parseResult.success) {
      setError(parseResult.error.flatten());
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/login", parseResult.data);

      const { accessToken } = z
        .object({ accessToken: z.string() })
        .parse(response.data);

      login(accessToken);
      toast.success("Acesso autorizado com sucesso. Redirecionando...");
      navigate("/auto/admin");
    } catch (error) {
      setSubmitting(false);

      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível acessar o painel");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 md:px-6">
      <div className="absolute top-2 left-4 md:left-6">
        <Link className="font-serif text-2xl" to="/auto">
          <span className="text-primary">ino</span>auto
        </Link>
      </div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <h1 className="font-semibold text-2xl">Acessar Painel</h1>
        <Label className="mt-4" htmlFor="email">
          Email
        </Label>
        <Input
          className="mt-1"
          type="text"
          id="email"
          autoCapitalize="none"
          value={email}
          onValueChange={setEmail}
          disabled={submitting}
        />
        {errors?.fieldErrors.email !== undefined && (
          <div className="mt-1 text-red-500 text-sm">
            {errors.fieldErrors.email[0]}
          </div>
        )}

        <Label className="mt-4" htmlFor="password">
          Senha
        </Label>
        <Input
          className="mt-1"
          type="password"
          id="password"
          value={password}
          onValueChange={setPassword}
          disabled={submitting}
        />
        {errors?.fieldErrors.password !== undefined && (
          <div className="mt-1 text-red-500 text-sm">
            {errors.fieldErrors.password[0]}
          </div>
        )}

        <div className="mt-2 flex justify-end">
          <Button variant="link" size="sm">
            Esqueci a senha
          </Button>
        </div>

        {errors?.formErrors !== undefined && (
          <div className="mt-6 text-center text-red-500 text-sm">
            {errors.formErrors[0]}
          </div>
        )}

        <Button type="submit" className="mt-6" disabled={submitting}>
          Entrar
        </Button>
        <div className="mt-4 flex justify-center">
          <Button variant="link">Não possuo conta</Button>
        </div>
      </form>
    </div>
  );
}
