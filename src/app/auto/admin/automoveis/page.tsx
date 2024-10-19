"use client";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "../../../../components/ui/button";
import { api } from "../../../../lib/api";
import { getItemOrThrow } from "../../../../utils/array";

const AutomobileSchema = z.object({
  brand: z.string(),
  city: z.string(),
  color: z.string(),
  fuel: z.string(),
  id: z.string(),
  manufactureYear: z.string(),
  model: z.string(),
  modelYear: z.string(),
  state: z.string(),
  mileage: z.string().optional(),
  price: z.string().optional(),
  photos: z.string().array().optional(),
});

type AutomobileDTO = z.infer<typeof AutomobileSchema>;

const Page: React.FC = () => {
  const [automobiles, setAutomobiles] = useState<AutomobileDTO[]>();

  useEffect(() => {
    const effect = async () => {
      const response = await api("/automobiles");
      setAutomobiles(z.array(AutomobileSchema).parse(response.data));
    };

    void effect();
  }, []);

  return (
    <>
      <header className="flex items-start">
        <h1 className="mr-auto text-2xl font-semibold">Automóveis</h1>
        <Button asChild>
          <Link href="/auto/admin/automoveis/novo/">
            <PlusIcon className="size-4" />
            <span>
              Novo<span className="hidden sm:inline"> Automóvel</span>
            </span>
          </Link>
        </Button>
      </header>
      {automobiles === undefined && <div className="mt-6">Carregando...</div>}
      {automobiles !== undefined && (
        <div className="mt-6 grid gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {automobiles?.map((automobile) => (
            <Link
              key={automobile.id}
              className="block rounded border border-gray-300 text-start hover:-translate-y-px active:-translate-y-0.5"
              href={`/auto/admin/automoveis/visualizar/?id=${automobile.id}`}
            >
              <span className="relative block aspect-video overflow-hidden rounded-t bg-gray-200">
                {(automobile.photos === undefined ||
                  automobile.photos.length === 0) && (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-400">
                    Sem foto
                  </span>
                )}
                {automobile.photos !== undefined &&
                  automobile.photos.length > 0 && (
                    <img
                      alt=""
                      className="size-full object-cover"
                      src={getItemOrThrow(automobile.photos, 0)}
                    />
                  )}
              </span>
              <span className="block p-4">
                <span className="block h-8 truncate text-2xl font-medium">
                  {automobile.price !== undefined
                    ? `R$ ${automobile.price}`
                    : null}
                </span>
                <span className="mt-2 block h-7 truncate font-medium text-gray-600">
                  {automobile.brand} {automobile.model}{" "}
                  {automobile.manufactureYear}/{automobile.modelYear}
                </span>
                <span className="mt-4 flex flex-wrap gap-1">
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium">
                    {automobile.color}
                  </span>
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium">
                    {automobile.fuel}
                  </span>
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium">
                    {automobile.city}/{automobile.state}
                  </span>
                  {automobile.mileage !== undefined && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium">
                      {automobile.mileage} km
                    </span>
                  )}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
