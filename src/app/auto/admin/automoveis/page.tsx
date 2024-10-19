"use client";
import { ImageBroken, Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "../../../../components/ui/button";
import { api } from "../../../../lib/api";
import { getItemOrThrow } from "../../../../utils/array";

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

    effect();
  }, []);

  return (
    <>
      <header className="flex items-start">
        <h1 className="mr-auto font-semibold text-2xl">Automóveis</h1>
        <Button asChild>
          <Link href="/auto/admin/automoveis/novo/">
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
            className="hover:-translate-y-px active:-translate-y-0.5 block rounded-lg border border-gray-300 p-2 text-start"
            key={automobile.id}
            href={`/auto/admin/automoveis/visualizar/?id=${automobile.id}`}
          >
            <span className="relative block aspect-video overflow-hidden rounded bg-gray-300">
              {(automobile.photos === undefined ||
                automobile.photos.length === 0) && (
                <ImageBroken className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-8 text-gray-400" />
              )}
              {automobile.photos !== undefined &&
                automobile.photos.length > 0 && (
                  <img
                    src={getItemOrThrow(automobile.photos, 0)}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                )}
            </span>
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
