"use client";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "../../../../components/ui/button";
import { api } from "../../../../lib/api";

const AutomobileSchema = z.object({
  brand: z.string(),
  chassis: z.string(),
  city: z.string(),
  color: z.string(),
  fuel: z.string(),
  id: z.string(),
  manufactureYear: z.string(),
  model: z.string(),
  modelYear: z.string(),
  partition: z.string(),
  plate: z.string(),
  state: z.string(),
  variant: z.string(),
});

type AutomobileDTO = z.infer<typeof AutomobileSchema>;

const Page: React.FC = () => {
  const [automobiles, setAutomobiles] = useState<AutomobileDTO[]>();

  useEffect(() => {
    const effect = async () => {
      const response = await api("/automobiles");
      setAutomobiles(z.array(AutomobileSchema).parse(response.data));
    };

    effect();
  }, []);

  return (
    <>
      <header className="flex items-start">
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
      <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4 min-[480px]:grid-cols-2">
        {automobiles?.map((automobile) => (
          <Link
            className="hover:-translate-y-px active:-translate-y-0.5 block rounded border border-gray-300 p-2 text-start"
            key={automobile.id}
            href={`/auto/admin/automoveis/visualizar?id=${automobile.id}`}
          >
            <span className="line-clamp-2 block h-12 font-medium">
              {automobile.brand} {automobile.model} {automobile.manufactureYear}
              /{automobile.modelYear}
            </span>
            <span className="mt-4 flex flex-wrap gap-1">
              <span className="rounded bg-gray-200 px-2 py-0.5 font-medium text-xs">
                {automobile.color}
              </span>
              <span className="rounded bg-gray-200 px-2 py-0.5 font-medium text-xs">
                {automobile.fuel}
              </span>
              <span className="rounded bg-gray-200 px-2 py-0.5 font-medium text-xs">
                {automobile.city}/{automobile.state}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Page;
