"use client";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";

const Page: React.FC = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold">Automóvel</h1>
      <Button className="mt-6" variant="secondary" asChild>
        <Link href="/auto/admin/automoveis/">
          <ArrowLeftIcon className="size-4" />
          Voltar
        </Link>
      </Button>
    </>
  );
};

export default Page;
