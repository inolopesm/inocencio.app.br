"use client";

import {
  ArrowClockwise as ArrowClockwiseIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  CloudCheck as CloudCheckIcon,
  CloudSlash as CloudSlashIcon,
  DotsThreeVertical as DotsThreeVerticalIcon,
  File as FileIcon,
  FloppyDisk as FloppyDiskIcon,
  Image as ImageIcon,
  Star as StarIcon,
  Trash as TrashIcon,
  X as XIcon,
} from "@phosphor-icons/react/dist/ssr";

import * as Popover from "@radix-ui/react-popover";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../../../components/ui/button";
import { TextField } from "../../../../../components/ui/text-field";
import { api } from "../../../../../lib/api";
import { getItemOrThrow } from "../../../../../utils/array";
import { intl } from "../../../../../utils/intl";

type AutoFile = {
  id: string;
  file: File;
  status: number;
  url: string;
};

const PLATE_REGEX = /^[A-Z]{3}[0-9]{1}[0-9A-Z]{1}[0-9]{2}$/;

const numbers = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

// biome-ignore format: better readability
const lettersAndNumbers = new Set([
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d",
  "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
  "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7",
  "8", "9",
]);

// biome-ignore format: better readability
const states = new Set([
  "RO", "AC", "AM", "RR", "PA", "AP", "TO", "MA", "PI", "CE", "RN", "PB", "PE",
  "AL", "SE", "BA", "MG", "ES", "RJ", "SP", "PR", "SC", "RS", "MS", "MT", "GO",
  "DF",
]);

const removeAccents = (string: string) =>
  string.normalize("NFD").replace(/\p{Diacritic}/gu, "");

const keepOnly = (chars: Set<string>) => (string: string) =>
  string
    .split("")
    .filter((char) => chars.has(char))
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
        z.coerce.number().int().min(1950).max(2026).safeParse(value).success,
      "Ano de Fabricação deve ser um ano válido (1950-2026)",
    ),

  modelYear: z
    .string()
    .trim()
    .min(1, "Ano do Modelo é um campo obrigatório")
    .refine(
      (value) =>
        z.coerce.number().int().min(1950).max(2026).safeParse(value).success,
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
    .refine((value) => states.has(value), "Estado inválido"),

  mileage: z.string().min(1, "Quilometragem é um campo obrigatório"),
  price: z.string().min(1, "Preço é um campo obrigatório"),
  photos: z.array(z.string().url()),
  documents: z.array(z.string().url()),
});

const Page: React.FC = () => {
  const router = useRouter();
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
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState<AutoFile[]>([]);
  const [documents, setDocuments] = useState<AutoFile[]>([]);
  const [loading, setLoading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handlePlateChange = async (value: string) => {
    const keepOnlyLettersAndNumbers = keepOnly(lettersAndNumbers);

    const newPlate = removeAccents(
      keepOnlyLettersAndNumbers(value.slice(0, 7)),
    ).toUpperCase();

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

  const handleManufactureYearChange = (value: string) => {
    const keepOnlyNumbers = keepOnly(numbers);
    setManufactureYear(keepOnlyNumbers(value.slice(0, 4)));
  };

  const handleModelYearChange = (value: string) => {
    const keepOnlyNumbers = keepOnly(numbers);
    setModelYear(keepOnlyNumbers(value.slice(0, 4)));
  };

  const handleChassisChange = (value: string) => {
    const keepOnlyLettersAndNumbers = keepOnly(lettersAndNumbers);
    setChassis(keepOnlyLettersAndNumbers(value.slice(0, 50)).toUpperCase());
  };

  const handleMileageChange = (value: string) => {
    const keepOnlyNumbers = keepOnly(numbers);
    let newMileage = keepOnlyNumbers(value).slice(0, 7 /* "0000000".length */);

    if (newMileage)
      newMileage = intl.number.format(Number.parseInt(newMileage, 10));

    setMileage(newMileage);
  };

  const handlePriceChange = (value: string) => {
    const keepOnlyNumbers = keepOnly(numbers);
    let newPrice = keepOnlyNumbers(value).slice(0, 6 /* "000000".length */);
    if (newPrice) newPrice = intl.number.format(Number.parseInt(newPrice, 10));
    setPrice(newPrice);
  };

  const handleBrandChange = (value: string) =>
    setBrand(removeAccents(value.slice(0, 50)).toUpperCase());

  const handleModelChange = (value: string) =>
    setModel(removeAccents(value.slice(0, 50)).toUpperCase());

  const handleVariantChange = (value: string) =>
    setVariant(removeAccents(value.slice(0, 50)).toUpperCase());

  const handleColorChange = (value: string) =>
    setColor(removeAccents(value.slice(0, 50)).toUpperCase());

  const handleFuelChange = (value: string) =>
    setFuel(removeAccents(value.slice(0, 50)).toUpperCase());

  const handleCityChange = (value: string) =>
    setCity(removeAccents(value.slice(0, 50)).toUpperCase());

  const handleStateChange = (value: string) =>
    setState(removeAccents(value.slice(0, 2)).toUpperCase());

  const handlePhoto = (file: File) => {
    if (file === null) {
      toast.error("Não foi possível ler o arquivo arrastado");
      return;
    }

    if (!/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      toast.error("Arquivo deve ser JPG, JPEG, PNG ou WEBP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Foto deve ter no máximo 5MB");
      return;
    }

    const id = window.crypto.randomUUID();
    const photo = { id, file, status: 0, url: "" };

    setPhotos((previous) => {
      if (previous.length === 10) {
        toast.error("Limite máximo de fotos (10) atingido");
        return previous;
      }

      return [...previous, photo];
    });
  };

  const handleDocument = (file: File) => {
    if (file === null) {
      toast.error("Não foi possível ler o arquivo arrastado");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Documento deve ter no máximo 5MB");
      return;
    }

    const id = window.crypto.randomUUID();
    const document = { id, file, status: 0, url: "" };

    setDocuments((previous) => {
      if (previous.length === 10) {
        toast.error("Limite máximo de documentos (10) atingido");
        return previous;
      }

      return [...previous, document];
    });
  };

  const handleInDropZone = (event: React.DragEvent<HTMLButtonElement>) => {
    event.currentTarget.dataset.inDropZone = "true";
  };

  const handleOutDropZone = (event: React.DragEvent<HTMLButtonElement>) => {
    event.currentTarget.dataset.inDropZone = "false";
  };

  const handlePhotoDelete = (index: number) => () =>
    setPhotos(photos.toSpliced(index, 1));

  const handlePhotoFirst = (photo: AutoFile, index: number) => () =>
    setPhotos([photo, ...photos.toSpliced(index, 1)]);

  const handlePhotoLeft = (index: number) => () => {
    const photo = getItemOrThrow(photos, index);
    const photoOnTheLeftSide = getItemOrThrow(photos, index - 1);
    setPhotos(photos.toSpliced(index - 1, 2, photo, photoOnTheLeftSide));
  };

  const handlePhotoRight = (index: number) => () => {
    const photo = getItemOrThrow(photos, index);
    const photoOnTheRightSide = getItemOrThrow(photos, index + 1);
    setPhotos(photos.toSpliced(index, 2, photo, photoOnTheRightSide));
  };

  const handlePhotoDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();

    event.currentTarget.dataset.inDropZone = "false";

    if (!event.dataTransfer.items) {
      Array.from(event.dataTransfer.files).forEach(handlePhoto);
      return;
    }

    for (const item of Array.from(event.dataTransfer.items)) {
      if (item.kind !== "file") {
        toast.error("Item arrastado não é um arquivo");
        continue;
      }

      const file = item.getAsFile();

      if (file === null) {
        toast.error("Não foi possível ler o arquivo arrastado");
        continue;
      }

      handlePhoto(file);
    }
  };

  const handlePhotoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files === null) return;
    Array.from(event.target.files).forEach(handlePhoto);
    event.target.value = "";
  };

  const handleDocumentDelete = (index: number) => () =>
    setDocuments(documents.toSpliced(index, 1));

  const handleDocumentDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();

    event.currentTarget.dataset.inDropZone = "false";

    if (!event.dataTransfer.items) {
      Array.from(event.dataTransfer.files).forEach(handleDocument);
      return;
    }

    for (const item of Array.from(event.dataTransfer.items)) {
      if (item.kind !== "file") {
        toast.error("Item arrastado não é um arquivo");
        continue;
      }

      const file = item.getAsFile();

      if (file === null) {
        toast.error("Não foi possível ler o arquivo arrastado");
        continue;
      }

      handleDocument(file);
    }
  };

  const handleDocumentInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files === null) return;
    Array.from(event.target.files).forEach(handleDocument);
    event.target.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const photosSent: string[] = [];
    const documentsSent: string[] = [];

    const sendToS3 = async (file: File) => {
      const headers = {
        "content-type": file.type,
        "content-length": file.size,
      };

      const response = await api.post<unknown>("/storage", headers);
      const s3url = z.string().parse(response.data);
      await axios.put(s3url, file, { headers, adapter: "fetch" });

      return s3url
        .slice(0, s3url.indexOf("?") + 1)
        .replace("s3.sa-east-1.amazonaws.com/", "");
    };

    try {
      await Promise.all([
        ...photos.map(async (photo, i) => {
          if (photo.status === 2) {
            photosSent.push(photo.url);
            return;
          }

          try {
            setPhotos((prev) => prev.toSpliced(i, 1, { ...photo, status: 1 }));
            const url = await sendToS3(photo.file);
            setPhotos((p) => p.toSpliced(i, 1, { ...photo, status: 2, url }));
            photosSent.push(url.slice(0, url.indexOf("?")));
          } catch (error) {
            setPhotos((p) => p.toSpliced(i, 1, { ...photo, status: 1 }));
            toast.error("Não foi possível salvar a foto na nuvem");
            throw error;
          }
        }),
        ...documents.map(async (doc, i) => {
          if (doc.status === 2) {
            photosSent.push(doc.url);
            return;
          }

          setDocuments((prev) => prev.toSpliced(i, 1, { ...doc, status: 1 }));

          try {
            const url = await sendToS3(doc.file);
            setPhotos((p) => p.toSpliced(i, 1, { ...doc, status: 2, url }));
            documentsSent.push(url.slice(0, url.indexOf("?")));
          } catch (error) {
            setPhotos((p) => p.toSpliced(i, 1, { ...doc, status: 1 }));
            toast.error("Não foi possível salvar a foto na nuvem");
            throw error;
          }
        }),
      ]);
    } catch {
      setLoading(false);
      return;
    }

    const result = FormSchema.safeParse({
      ...{ plate, brand, model, variant, manufactureYear, modelYear },
      ...{ chassis, color, fuel, city, state, mileage, price },
      ...{ photos: photosSent, documents: documentsSent },
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
            name="plate"
            value={plate}
            onValueChange={handlePlateChange}
            disabled={loading}
          />
          <TextField
            label="Marca"
            placeholder="VW"
            autoCapitalize="characters"
            name="brand"
            value={brand}
            onValueChange={handleBrandChange}
            disabled={loading}
          />
          <TextField
            label="Modelo"
            placeholder="Polo"
            autoCapitalize="characters"
            name="model"
            value={model}
            onValueChange={handleModelChange}
            disabled={loading}
          />
          <TextField
            label="Versão"
            placeholder="POLO CL AD"
            autoCapitalize="characters"
            name="variant"
            value={variant}
            onValueChange={handleVariantChange}
            disabled={loading}
          />
          <TextField
            label="Ano de Fabricação"
            placeholder="2018"
            inputMode="numeric"
            name="manufactureYear"
            value={manufactureYear}
            onValueChange={handleManufactureYearChange}
            disabled={loading}
          />
          <TextField
            label="Ano do Modelo"
            placeholder="2018"
            inputMode="numeric"
            name="modelYear"
            value={modelYear}
            onValueChange={handleModelYearChange}
            disabled={loading}
          />
          <TextField
            label="Chassi"
            placeholder="ABCXYZ1234XPTO567"
            autoCapitalize="characters"
            name="chassis"
            value={chassis}
            onValueChange={handleChassisChange}
            disabled={loading}
          />
          <TextField
            label="Cor"
            placeholder="BRANCA"
            autoCapitalize="characters"
            name="color"
            value={color}
            onValueChange={handleColorChange}
            disabled={loading}
          />
          <TextField
            label="Combustível"
            placeholder="Alcool / Gasolina"
            autoCapitalize="characters"
            name="fuel"
            value={fuel}
            onValueChange={handleFuelChange}
            disabled={loading}
          />
          <TextField
            label="Cidade"
            placeholder="JOAO PESSOA"
            autoCapitalize="characters"
            name="city"
            value={city}
            onValueChange={handleCityChange}
            disabled={loading}
          />
          <TextField
            label="Estado"
            placeholder="PB"
            autoCapitalize="characters"
            name="state"
            value={state}
            onValueChange={handleStateChange}
            disabled={loading}
          />
          <TextField
            label="Quilometragem"
            placeholder="65.000"
            inputMode="numeric"
            name="mileage"
            value={mileage}
            onValueChange={handleMileageChange}
            disabled={loading}
          />
          <TextField
            label="Preço"
            placeholder="70.000"
            name="price"
            inputMode="numeric"
            value={price}
            onValueChange={handlePriceChange}
            disabled={loading}
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          <div>
            <button
              type="button"
              className="group flex aspect-video max-w-xs cursor-pointer select-none flex-col items-center justify-center rounded border-2 border-gray-300 border-dashed text-center font-medium text-sm duration-150 hover:border-gray-400 data-[in-drop-zone=true]:border-primary data-[in-drop-zone=true]:bg-primary/10"
              onDrop={handlePhotoDrop}
              onDragOver={(event) => event.preventDefault()}
              onDragEnter={handleInDropZone}
              onDragLeave={handleOutDropZone}
              onDragEnd={handleOutDropZone}
              onClick={() => photoInputRef.current?.click()}
            >
              <ImageIcon className="size-12 text-gray-400 group-[[data-in-drop-zone=true]]:text-primary" />
              <span className="mt-2">
                Clique aqui para adicionar fotos do automóvel ou arraste-os para
                cá
              </span>
            </button>
            <input
              type="file"
              className="hidden"
              ref={photoInputRef}
              accept=".jpg, .jpeg, .png, .webp"
              onChange={handlePhotoInputChange}
              multiple
            />
          </div>
          <div>
            <button
              type="button"
              className="group flex aspect-video max-w-xs cursor-pointer select-none flex-col items-center justify-center rounded border-2 border-gray-300 border-dashed text-center font-medium text-sm duration-150 hover:border-gray-400 data-[in-drop-zone=true]:border-primary data-[in-drop-zone=true]:bg-primary/10"
              onDrop={handleDocumentDrop}
              onDragOver={(event) => event.preventDefault()}
              onDragEnter={handleInDropZone}
              onDragLeave={handleOutDropZone}
              onDragEnd={handleOutDropZone}
              onClick={() => documentInputRef.current?.click()}
            >
              <FileIcon className="size-12 text-gray-400 group-[[data-in-drop-zone=true]]:text-primary" />
              <span className="mt-2">
                Clique aqui para adicionar documentos do automóvel ou arraste-os
                para cá
              </span>
            </button>
            <input
              type="file"
              className="hidden"
              ref={documentInputRef}
              onChange={handleDocumentInputChange}
              multiple
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4 overflow-x-auto py-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative aspect-video w-full max-w-xs shrink-0 overflow-hidden rounded"
            >
              <img
                className="h-full w-full object-cover"
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
        <div className="mt-4 flex gap-4 overflow-x-auto py-2">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className="relative flex aspect-square w-full max-w-48 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200"
            >
              <div className="w-32 break-words text-center text-sm">
                {doc.file.name}
              </div>
              <div className="absolute right-1 bottom-1 inline-flex size-8 select-none items-center justify-center rounded bg-gray-400">
                {doc.status === 0 && (
                  <CloudSlashIcon className="size-5 text-white" />
                )}
                {doc.status === 1 && (
                  <ArrowClockwiseIcon className="size-5 text-white" />
                )}
                {doc.status === 2 && (
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
                    <Popover.Close asChild>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={handleDocumentDelete(index)}
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
