import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Component() {
  return (
    <>
      <header className="flex items-center">
        <h1 className="mr-auto font-semibold text-2xl">Automóveis</h1>
        <Button asChild>
          <Link to="/auto/admin/automoveis/novo">
            <Plus className="size-4" />
            <span>
              Novo<span className="hidden sm:inline"> Automóvel</span>
            </span>
          </Link>
        </Button>
      </header>
    </>
  );
}
