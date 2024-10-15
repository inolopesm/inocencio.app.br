import { Car, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function Component() {
  return (
    <div className="bg-gradient-to-tr from-primary/10 to-transparent">
      <div className="mx-auto flex min-h-dvh max-w-screen-md flex-col items-center">
        <header className="mx-auto flex h-14 w-full items-center px-4 md:px-6">
          <Link className="font-serif text-2xl text-primary" to="/">
            inolopesm
          </Link>
        </header>
        <main className="flex w-full max-w-[320px] grow flex-col justify-center gap-2 px-4 md:px-6">
          <Button asChild>
            <Link to="/auto">
              <Car className="size-4" />
              inoauto
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <a
              href="https://www.linkedin.com/in/inolopesm/"
              rel="noreferrer noopener"
            >
              <LinkedinLogo className="size-4" />
              LinkedIn
            </a>
          </Button>
        </main>
        <footer className="mx-auto flex h-16 items-center px-4 text-center text-gray-700 text-sm md:px-6">
          Este site é mantido e operado por MATHEUS INOCENCIO LOPES -
          55.740.093/0001-82
        </footer>
      </div>
    </div>
  );
}
