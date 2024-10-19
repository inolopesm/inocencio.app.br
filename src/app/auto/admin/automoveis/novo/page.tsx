"use client";

import {
  ArrowClockwise as ArrowClockwiseIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  CloudCheck as CloudCheckIcon,
  CloudSlash as CloudSlashIcon,
  DotsThreeVertical as DotsThreeVerticalIcon,
  FloppyDisk as FloppyDiskIcon,
  Image as ImageIcon,
  Star as StarIcon,
  Trash as TrashIcon,
  X as XIcon,
} from "@phosphor-icons/react/dist/ssr";

import * as Popover from "@radix-ui/react-popover";
import axios from "axios";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../../../components/ui/button";
import { TextField } from "../../../../../components/ui/text-field";
import { api } from "../../../../../lib/api";
import { getItemOrThrow } from "../../../../../utils/array";

// biome-ignore format: better readability
const STATES = [
  "RO", "AC", "AM", "RR", "PA", "AP", "TO", "MA", "PI", "CE", "RN", "PB", "PE",
  "AL", "SE", "BA", "MG", "ES", "RJ", "SP", "PR", "SC", "RS", "MS", "MT", "GO",
  "DF",
];

// biome-ignore format: better readability
const UPPERCASED_LETTERS = [
  "A",    "B",    "C",    "D",    "E",    "F",    "G",
  "H",    "I",    "J",    "K",    "L",    "M",    "N",    "O",
  "P",    "Q",    "R",    "S",    "T",    "U",    "V",    "W",
  "X",    "Y",    "Z",
];

// biome-ignore format: better readability
const LOWERCASED_LETTERS = [
  "a",    "b",    "c",    "d",    "e",    "f",    "g",
  "h",    "i",    "j",    "k",    "l",    "m",    "n",    "o",
  "p",    "q",    "r",    "s",    "t",    "u",    "v",    "w",
  "x",    "y",    "z",
];

const LETTERS = [...UPPERCASED_LETTERS, ...LOWERCASED_LETTERS];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const PLATE_REGEX = /^[A-Z]{3}[0-9]{1}[0-9A-Z]{1}[0-9]{2}$/;

const removeAccents = (string: string) =>
  string.normalize("NFD").replace(/\p{Diacritic}/gu, "");

const keepOnly = (chars: string[]) => (string: string) =>
  string
    .split("")
    .filter((char) => chars.includes(char))
    .join("");

const ApiPlacasSchema = z.union([
  z.object({
    MARCA: z.string(),
    MODELO: z.string(),
    SUBMODELO: z.string(),
    ano: z.string(),
    anoModelo: z.string(),
    cor: z.string(),
    municipio: z.string(),
    uf: z.string(),
    mensagemRetorno: z.literal("Sem erros."),
    extra: z.object({
      chassi: z.string().optional(),
      combustivel: z.string().optional(),
    }),
  }),
  z.object({
    status: z.number(),
    mensagemRetorno: z.string(),
  }),
]);

const FormSchema = z.object({
  plate: z
    .string()
    .trim()
    .min(1, "Placa é um campo obrigatório")
    .regex(PLATE_REGEX, "Placa inválida"),

  brand: z
    .string()
    .trim()
    .min(1, "Marca é um campo obrigatório")
    .max(50, "Marca deve ter até 50 caracteres"),

  model: z
    .string()
    .trim()
    .min(1, "Modelo é um campo obrigatório")
    .max(50, "Modelo deve ter até 50 caracteres"),

  variant: z
    .string()
    .trim()
    .min(1, "Versão é um campo obrigatório")
    .max(50, "Versão deve ter até 50 caracteres"),

  manufactureYear: z
    .string()
    .trim()
    .min(1, "Ano de Fabricação é um campo obrigatório")
    .refine(
      (value) =>
        pipe(
          O.some(Number.parseInt(value, 10)),
          O.filter(Number.isSafeInteger),
          O.filter((n) => n >= 1950 && n <= 2026),
          O.fold(
            () => false,
            () => true,
          ),
        ),
      "Ano de Fabricação deve ser um ano válido (1950-2026)",
    ),

  modelYear: z
    .string()
    .trim()
    .min(1, "Ano do Modelo é um campo obrigatório")
    .refine(
      (value) =>
        pipe(
          O.some(Number.parseInt(value, 10)),
          O.filter(Number.isSafeInteger),
          O.filter((n) => n >= 1950 && n <= 2026),
          O.fold(
            () => false,
            () => true,
          ),
        ),
      "Ano do Modelo deve ser um ano válido (1950-2026)",
    ),

  chassis: z
    .string()
    .trim()
    .min(1, "Chassi é um campo obrigatório")
    .max(50, "Chassi deve ter até 50 caracteres")
    .regex(/^[A-Z0-9]+$/, "Chassi deve conter apenas letras e números"),

  color: z
    .string()
    .trim()
    .min(1, "Cor é um campo obrigatório")
    .max(50, "Cor deve ter até 50 caracteres"),

  fuel: z
    .string()
    .trim()
    .min(1, "Combustível é um campo obrigatório")
    .max(50, "Combustível deve ter até 50 caracteres"),

  city: z
    .string()
    .trim()
    .min(1, "Cidade é um campo obrigatório")
    .max(50, "Cidade deve ter até 50 caracteres"),

  state: z
    .string()
    .trim()
    .min(1, "Estado é um campo obrigatório")
    .refine((value) => STATES.includes(value), "Estado inválido"),

  photos: z.array(z.string()),
});

type Photo = {
  id: string;
  file: File;
  status: number;
  url: string;
};

const Page: React.FC = () => {
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [chassis, setChassis] = useState("");
  const [color, setColor] = useState("");
  const [fuel, setFuel] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePlateChange = async (value: string) => {
    const newPlate = pipe(
      value,
      S.slice(0, 7),
      keepOnly([...LETTERS, ...NUMBERS]),
      removeAccents,
      S.toUpperCase,
    );

    setPlate(newPlate);

    if (!PLATE_REGEX.test(newPlate)) return;
    setLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_API_PLACAS_TOKEN;
      const url = `https://wdapi2.com.br/consulta/${newPlate}/${token}`;
      const response = await axios<unknown>(url, { adapter: "fetch" });
      const apiplacas = ApiPlacasSchema.parse(response.data);

      if ("status" in apiplacas) {
        toast.error(apiplacas.mensagemRetorno);
        return;
      }

      toast.success("Placa encontrada");

      handleBrandChange(apiplacas.MARCA);
      handleModelChange(apiplacas.SUBMODELO);
      handleVariantChange(apiplacas.MODELO);
      handleManufactureYearChange(apiplacas.ano);
      handleModelYearChange(apiplacas.anoModelo);
      handleColorChange(apiplacas.cor);
      handleCityChange(apiplacas.municipio);
      handleStateChange(apiplacas.uf);

      if (apiplacas.extra.chassi) {
        handleChassisChange(apiplacas.extra.chassi);
      }

      if (apiplacas.extra.combustivel) {
        handleFuelChange(apiplacas.extra.combustivel);
      }
    } catch {
      toast.error("Não foi possível buscar dados do automóvel");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (value: string) =>
    setBrand(pipe(value, S.slice(0, 50), removeAccents, S.toUpperCase));

  const handleModelChange = (value: string) =>
    setModel(pipe(value, S.slice(0, 50), removeAccents, S.toUpperCase));

  const handleVariantChange = (value: string) =>
    setVariant(pipe(value, S.slice(0, 50), removeAccents, S.toUpperCase));

  const handleManufactureYearChange = (value: string) =>
    setManufactureYear(pipe(value, S.slice(0, 4), keepOnly(NUMBERS)));

  const handleModelYearChange = (value: string) =>
    setModelYear(pipe(value, S.slice(0, 4), keepOnly(NUMBERS)));

  const handleChassisChange = (value: string) =>
    setChassis(pipe(value, S.slice(0, 50), keepOnly([...LETTERS, ...NUMBERS])));

  const handleColorChange = (value: string) =>
    setColor(pipe(value, S.slice(0, 50), removeAccents, S.toUpperCase));

  const handleFuelChange = (value: string) =>
    setFuel(pipe(value, S.slice(0, 50), removeAccents, S.toUpperCase));

  const handleCityChange = (value: string) =>
    setCity(pipe(value, S.slice(0, 50), removeAccents, S.toUpperCase));

  const handleStateChange = (value: string) =>
    setState(pipe(value, S.slice(0, 2), removeAccents, S.toUpperCase));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const photosSent: string[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = getItemOrThrow(photos, i);

      if (photo.status === 2) {
        photosSent.push(photo.url);
        continue;
      }

      try {
        setPhotos((prev) => prev.toSpliced(i, 1, { ...photo, status: 1 }));

        const response = await api.post<unknown>("/storage", {
          "content-type": photo.file.type,
          "content-length": photo.file.size,
        });

        const url = z.string().parse(response.data);

        await axios.request({
          adapter: "fetch",
          method: "PUT",
          url: url,
          data: photo.file,
          headers: {
            "Content-Type": photo.file.type,
            "Content-Length": photo.file.size,
          },
        });

        setPhotos((prev) => prev.toSpliced(i, 1, { ...photo, status: 2, url }));
        photosSent.push(url.slice(0, url.indexOf("?")));
      } catch (error) {
        console.error(error);
        setPhotos((prev) => prev.toSpliced(i, 1, { ...photo, status: 1 }));
        toast.error("Não foi possível salvar a foto na nuvem");
        return;
      }
    }

    const result = FormSchema.safeParse({
      plate: plate,
      brand: brand,
      model: model,
      variant: variant,
      manufactureYear: manufactureYear,
      modelYear: modelYear,
      chassis: chassis,
      color: color,
      fuel: fuel,
      city: city,
      state: state,
      photos: photosSent,
    } satisfies z.infer<typeof FormSchema>);

    if (!result.success) {
      const [issue] = result.error.issues;
      if (issue !== undefined) toast.error(issue.message);
      return;
    }

    try {
      await api.post("/automobiles", result.data);
      toast.success("Automóvel cadastrado com sucesso");
      router.push("/auto/admin/automoveis/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (event.dataTransfer.items) {
      for (const item of Array.from(event.dataTransfer.items)) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log({ file });

          if (file !== null) {
            if (/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
              if (file.size < 5 * 1024 * 1024) {
                const id = window.crypto.randomUUID();
                const photo = { id, file, status: 0, url: "" };

                setPhotos((previous) => {
                  if (previous.length === 10) {
                    toast.error("Limite máximo de fotos (10) atingido");
                    return previous;
                  }

                  return [...previous, photo];
                });
              } else {
                toast.error("Foto deve ter no máximo 5MB");
              }
            } else {
              toast.error("Arquivo deve ser JPG, JPEG, PNG ou WEBP");
            }
          }
        }
      }
    } else {
      for (const file of Array.from(event.dataTransfer.files)) {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
          if (file.size < 5 * 1024 * 1024) {
            const id = window.crypto.randomUUID();
            const photo = { id, file, status: 0, url: "" };

            setPhotos((previous) => {
              if (previous.length === 10) {
                toast.error("Limite máximo de fotos (10) atingido");
                return previous;
              }

              return [...previous, photo];
            });
          } else {
            toast.error("Foto deve ter no máximo 5MB");
          }
        } else {
          toast.error("Arquivo deve ser JPG, JPEG, PNG ou WEBP");
        }
      }
    }

    if (event.target instanceof HTMLButtonElement) {
      event.currentTarget.dataset.inDropZone = "false";
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLButtonElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    event.currentTarget.dataset.inDropZone = "true";
  };

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    event.currentTarget.dataset.inDropZone = "false";
  };

  const handleDragEnd = (event: React.DragEvent<HTMLButtonElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    event.currentTarget.dataset.inDropZone = "false";
  };

  const handlePhotoDelete = (index: number) => () => {
    setPhotos(photos.toSpliced(index, 1));
  };

  const handlePhotoFirst = (photo: Photo, index: number) => () => {
    setPhotos([photo, ...photos.toSpliced(index, 1)]);
  };

  const handlePhotoLeft = (index: number) => () => {
    setPhotos(
      photos.toSpliced(
        index - 1,
        2,
        getItemOrThrow(photos, index),
        getItemOrThrow(photos, index - 1),
      ),
    );
  };

  const handlePhotoRight = (index: number) => () => {
    setPhotos(
      photos.toSpliced(
        index,
        2,
        getItemOrThrow(photos, index + 1),
        getItemOrThrow(photos, index),
      ),
    );
  };

  const handlePhotoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files !== null) {
      for (const file of Array.from(event.target.files)) {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
          if (file.size < 5 * 1024 * 1024) {
            const id = window.crypto.randomUUID();
            const photo = { id, file, status: 0, url: "" };

            setPhotos((previous) => {
              if (previous.length === 10) {
                toast.error("Limite máximo de fotos (10) atingido");
                return previous;
              }

              return [...previous, photo];
            });
          } else {
            toast.error("Foto deve ter no máximo 5MB");
          }
        } else {
          toast.error("Arquivo deve ser JPG, JPEG, PNG ou WEBP");
        }
      }
    }

    event.target.value === null;
  };

  return (
    <>
      <h1 className="font-semibold text-2xl">Novo Automóvel</h1>
      <Button className="mt-6" variant="secondary" asChild>
        <Link href="/auto/admin/automoveis/">
          <ArrowLeftIcon className="size-4" />
          Voltar
        </Link>
      </Button>
      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <TextField
            className="sm:col-span-2 md:col-span-4"
            label="Placa"
            placeholder="AAA0X00 ou AAA9999"
            autoCapitalize="characters"
            value={plate}
            onValueChange={handlePlateChange}
            disabled={loading}
          />
          <TextField
            label="Marca"
            placeholder="HYUNDAI"
            autoCapitalize="characters"
            value={brand}
            onValueChange={handleBrandChange}
            disabled={loading}
          />
          <TextField
            label="Modelo"
            placeholder="HB20S"
            autoCapitalize="characters"
            value={model}
            onValueChange={handleModelChange}
            disabled={loading}
          />
          <TextField
            label="Versão"
            placeholder="COMF"
            autoCapitalize="characters"
            value={variant}
            onValueChange={handleVariantChange}
            disabled={loading}
          />
          <TextField
            label="Ano de Fabricação"
            placeholder="2014"
            inputMode="numeric"
            value={manufactureYear}
            onValueChange={handleManufactureYearChange}
            disabled={loading}
          />
          <TextField
            label="Ano do Modelo"
            placeholder="2015"
            inputMode="numeric"
            value={modelYear}
            onValueChange={handleModelYearChange}
            disabled={loading}
          />
          <TextField
            label="Chassi"
            placeholder="XXIZ7GYK6CBAKIXQ8"
            autoCapitalize="characters"
            value={chassis}
            onValueChange={handleChassisChange}
            disabled={loading}
          />
          <TextField
            label="Cor"
            placeholder="BRANCA"
            autoCapitalize="characters"
            value={color}
            onValueChange={handleColorChange}
            disabled={loading}
          />
          <TextField
            label="Combustível"
            placeholder="Alcool / Gasolina"
            autoCapitalize="characters"
            value={fuel}
            onValueChange={handleFuelChange}
            disabled={loading}
          />
          <TextField
            label="Cidade"
            placeholder="JOAO PESSOA"
            autoCapitalize="characters"
            value={city}
            onValueChange={handleCityChange}
            disabled={loading}
          />
          <TextField
            label="Estado"
            placeholder="PB"
            autoCapitalize="characters"
            value={state}
            onValueChange={handleStateChange}
            disabled={loading}
          />
        </div>
        <button
          type="button"
          className="group mt-6 flex aspect-video max-w-xs cursor-pointer select-none flex-col items-center justify-center rounded border-2 border-gray-300 border-dashed text-center font-medium text-sm duration-150 hover:border-gray-400 data-[in-drop-zone=true]:border-primary data-[in-drop-zone=true]:bg-primary/10"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onClick={() => photoInputRef.current?.click()}
        >
          <ImageIcon className="size-12 text-gray-400 group-[[data-in-drop-zone=true]]:text-primary" />
          Clique aqui para adicionar fotos do automóvel ou arraste-os para cá
        </button>
        <input
          type="file"
          className="hidden"
          ref={photoInputRef}
          accept=".jpg, .jpeg, .png, .webp"
          onChange={handlePhotoInputChange}
          multiple
        />
        <div className="mt-4 flex gap-4 overflow-x-auto py-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-video w-full max-w-xs shrink-0 overflow-hidden rounded bg-gray-300"
            >
              <img
                className="h-full w-full object-contain"
                src={window.URL.createObjectURL(photo.file)}
                alt=""
              />
              {index === 0 && (
                <div className="absolute top-1 left-1 inline-flex size-8 select-none items-center justify-center rounded bg-gray-900">
                  <StarIcon className="size-5 text-white" />
                </div>
              )}
              <div className="absolute right-1 bottom-1 inline-flex size-8 select-none items-center justify-center rounded bg-gray-400">
                {photo.status === 0 && (
                  <CloudSlashIcon className="size-5 text-white" />
                )}
                {photo.status === 1 && (
                  <ArrowClockwiseIcon className="size-5 text-white" />
                )}
                {photo.status === 2 && (
                  <CloudCheckIcon className="size-5 text-white" />
                )}
              </div>
              <Popover.Root>
                <Popover.Trigger
                  type="button"
                  className="absolute top-1 right-1 inline-flex size-8 select-none items-center justify-center rounded bg-white duration-300 hover:bg-gray-100"
                >
                  <DotsThreeVerticalIcon className="size-6" weight="bold" />
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    collisionPadding={8}
                    sideOffset={8}
                    className="grid rounded-md border border-gray-300 bg-white py-2"
                  >
                    {index !== 0 && (
                      <Popover.Close asChild>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={handlePhotoFirst(photo, index)}
                        >
                          <StarIcon className="size-5" />
                          Tornar principal
                        </Button>
                      </Popover.Close>
                    )}
                    {index !== 0 && (
                      <Popover.Close asChild>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={handlePhotoLeft(index)}
                        >
                          <ArrowLeftIcon className="size-5" />
                          Mover para esquerda
                        </Button>
                      </Popover.Close>
                    )}
                    {index !== photos.length - 1 && (
                      <Popover.Close asChild>
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={handlePhotoRight(index)}
                        >
                          <ArrowRightIcon className="size-5" />
                          Mover para direita
                        </Button>
                      </Popover.Close>
                    )}
                    <Popover.Close asChild>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={handlePhotoDelete(index)}
                      >
                        <TrashIcon className="size-5" />
                        Excluir
                      </Button>
                    </Popover.Close>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="secondary" disabled={loading} asChild>
            <Link href="/auto/admin/automoveis/">
              <XIcon className="size-4" />
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <FloppyDiskIcon className="size-4" />
            Cadastrar
          </Button>
        </div>
      </form>
    </>
  );
};

export default Page;
