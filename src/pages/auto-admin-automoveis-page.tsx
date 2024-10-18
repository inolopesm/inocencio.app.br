import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

export default function Component() {
  useEffect(() => {
    api("/automobiles").then((response) => console.log(response.data));
  }, []);

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
