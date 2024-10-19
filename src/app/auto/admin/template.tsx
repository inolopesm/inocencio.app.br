"use client";

import {
  Car as CarIcon,
  ChartLine as ChartLineIcon,
  List as ListIcon,
  SignOut as SignOutIcon,
  User as UserIcon,
} from "@phosphor-icons/react/dist/ssr";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";

import {
  AuthStoreContext,
  useAuthStore,
} from "../../../providers/auth-store-provider";

type TemplateProps = {
  children: React.ReactNode;
};

const Template: React.FC<TemplateProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const authenticated = useAuthStore((state) => state.authenticated);
  const user = useAuthStore((state) => state.accessToken.decoded);
  const logout = useAuthStore((state) => state.logout);
  const authStore = useContext(AuthStoreContext);
  const [hydrated, setHydrated] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auto/admin/entrar/");
  };

  useEffect(() => {
    if (authStore === undefined) return;
    void authStore.persist.rehydrate();
    setHydrated(true);
  }, [authStore]);

  useEffect(() => {
    if (!hydrated) return;

    if (pathname === "/auto/admin/entrar/" && authenticated) {
      router.push("/auto/admin/");
      return;
    }

    if (pathname !== "/auto/admin/entrar/" && !authenticated) {
      router.push("/auto/admin/entrar/");
      return;
    }
  }, [pathname, router, authenticated, hydrated]);

  if (pathname === "/auto/admin/entrar/" && authenticated) {
    return null;
  }

  if (pathname !== "/auto/admin/entrar/" && !authenticated) {
    return null;
  }

  if (pathname === "/auto/admin/entrar/") {
    return children;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex min-h-14 w-full max-w-7xl flex-wrap items-center gap-4 px-4 md:px-6">
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button className="sm:hidden" size="icon" variant="ghost">
              <ListIcon className="size-5" />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="grid rounded-md border border-gray-300 bg-white py-2"
              collisionPadding={8}
              sideOffset={8}
            >
              <Popover.Close asChild>
                <Button className="justify-start" variant="ghost" asChild>
                  <Link href="/auto/admin/">
                    <ChartLineIcon className="size-5" />
                    Dashboard
                  </Link>
                </Button>
              </Popover.Close>
              <Popover.Close asChild>
                <Button className="justify-start" variant="ghost" asChild>
                  <Link href="/auto/admin/automoveis/">
                    <CarIcon className="size-5" />
                    Automóveis
                  </Link>
                </Button>
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <Link
          className="mr-auto whitespace-nowrap font-serif"
          href="/auto/admin/"
        >
          <span className="text-2xl">
            <span className="text-primary">ino</span>auto
          </span>{" "}
          <span className="text-gray-600">admin</span>
        </Link>
        <Button
          className="hidden sm:inline-flex"
          type="button"
          variant="ghost"
          asChild
        >
          <Link href="/auto/admin/">
            <ChartLineIcon className="size-5" />
            Dashboard
          </Link>
        </Button>
        <Button
          className="hidden sm:inline-flex"
          type="button"
          variant="ghost"
          asChild
        >
          <Link href="/auto/admin/automoveis/">
            <CarIcon className="size-5" />
            Automóveis
          </Link>
        </Button>
        <Popover.Root>
          <Popover.Trigger className="inline-flex size-8 shrink-0 items-center justify-center rounded-[50%] bg-gray-200">
            <UserIcon className="size-4" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="rounded-md border border-gray-300 bg-white p-2"
              collisionPadding={8}
              sideOffset={8}
            >
              <p className="flex h-10 items-center px-2 text-sm">{user.name}</p>
              <div className="grid">
                <Button
                  onClick={handleLogout}
                  type="button"
                  variant="destructive"
                >
                  <SignOutIcon className="size-4" />
                  Sair
                </Button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </header>
      <main className="mx-auto w-full max-w-7xl grow px-4 py-12 md:px-6">
        {children}
      </main>
      <footer className="p-4 text-center text-sm text-gray-600 md:px-6">
        <p>
          Este site é mantido e operado por MATHEUS INOCENCIO LOPES -
          55.740.093/0001-82
        </p>
      </footer>
    </div>
  );
};

export default Template;
