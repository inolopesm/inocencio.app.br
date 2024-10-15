import { User } from "@phosphor-icons/react/dist/ssr";
import * as Popover from "@radix-ui/react-popover";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuthStore } from "../stores/auth-store";

export default function Component() {
  const user = useAuthStore((state) => state.accessToken.decoded);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auto/admin/entrar");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex min-h-14 w-full max-w-7xl items-center px-4 md:px-6">
        <Link className="font-serif" to="/auto/admin">
          <span className="text-2xl">
            <span className="text-primary">ino</span>auto
          </span>{" "}
          <span className="text-gray-600">admin</span>
        </Link>
        <Popover.Root>
          <Popover.Trigger className="ml-auto inline-flex size-8 items-center justify-center rounded-[50%] bg-gray-200">
            <User className="size-4" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="mt-1 rounded-md border border-gray-300 bg-white p-2">
              <p className="flex h-10 items-center px-2 text-sm">{user.name}</p>
              <div className="grid">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </header>
      <main className="mx-auto w-full max-w-7xl grow px-4 py-12 md:px-6">
        <h1 className="font-semibold text-2xl">Dashboard</h1>
        <section className="mt-12 flex justify-evenly gap-x-4 overflow-x-auto">
          <div className="size-48 shrink-0 rounded bg-gray-300" />
          <div className="size-48 shrink-0 rounded bg-gray-300" />
          <div className="size-48 shrink-0 rounded bg-gray-300" />
          <div className="size-48 shrink-0 rounded bg-gray-300" />
          <div className="size-48 shrink-0 rounded bg-gray-300" />
          <div className="size-48 shrink-0 rounded bg-gray-300" />
        </section>
        <section className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="aspect-video rounded bg-gray-300" />
          <div className="aspect-video rounded bg-gray-300" />
        </section>
        <section className="mt-12">
          <div className="aspect-video rounded bg-gray-300" />
        </section>
      </main>
      <footer className="p-4 text-center text-gray-600 text-sm md:px-6">
        <p>
          Este site é mantido e operado por MATHEUS INOCENCIO LOPES -
          55.740.093/0001-82
        </p>
      </footer>
    </div>
  );
}
