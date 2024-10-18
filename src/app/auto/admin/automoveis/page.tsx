import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";

const Page: React.FC = () => (
  <div>
    <header className="flex items-center">
      <h1 className="mr-auto font-semibold text-2xl">Automóveis</h1>
      <Button asChild>
        <Link href="/auto/admin/automoveis/novo">
          <PlusIcon className="size-4" />
          <span>
            Novo<span className="hidden sm:inline"> Automóvel</span>
          </span>
        </Link>
      </Button>
    </header>
    <div className="mt-6 text-gray-600 text-sm">
      Listagem de automóveis não implementada
    </div>
  </div>
);

export default Page;
