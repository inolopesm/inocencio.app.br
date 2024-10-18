"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../../components/ui/button";
import { TextField } from "../../../../components/ui/text-field";
import { ApiError, api } from "../../../../lib/api";
import { useAuthStore } from "../../../../providers/auth-store-provider";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Por favor informe seu email")
    .max(255, "Email muito longo")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Por favor informe sua senha")
    .max(64, "Senha muito longa"),
});

const Page: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

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

    setError(undefined);
    setSubmitting(true);

    try {
      const response = await api.post("/login", parseResult.data);

      const { accessToken } = z
        .object({ accessToken: z.string() })
        .parse(response.data);

      login(accessToken);
      router.push("/auto/admin/");
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tl from-primary/10 to-white px-4 py-12 md:px-6">
      <div className="absolute top-2 left-4 md:left-6">
        <Link className="font-serif text-2xl" href="/auto">
          <span className="text-primary">ino</span>auto
        </Link>
      </div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <h1 className="font-semibold text-2xl">Acessar Painel</h1>
        <TextField
          inputMode="email"
          autoCapitalize="none"
          className="mt-6"
          value={email}
          onValueChange={setEmail}
          disabled={submitting}
          error={errors?.fieldErrors.email !== undefined}
          helperText={errors?.fieldErrors.email?.at(0)}
          label="Email"
        />
        <TextField
          className="mt-4"
          type="password"
          value={password}
          onValueChange={setPassword}
          disabled={submitting}
          error={errors?.fieldErrors.password !== undefined}
          helperText={errors?.fieldErrors.password?.at(0)}
          label="Senha"
        />
        <div className="mt-2 flex justify-end">
          <Button variant="link" size="sm" asChild>
            <a
              href="https://wa.me/5583991957887"
              rel="noreferrer noopener"
              target="_blank"
            >
              Esqueci a senha
            </a>
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
          <Button variant="link" asChild>
            <a
              href="https://wa.me/5583991957887"
              rel="noreferrer noopener"
              target="_blank"
            >
              Não possuo conta
            </a>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
