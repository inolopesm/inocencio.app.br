"use client";
import { ArrowLeft, FloppyDisk, X } from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../../../components/ui/button";
import { TextField } from "../../../../../components/ui/text-field";
import { api } from "../../../../../lib/api";

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
});

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
      const response = await axios<unknown>(url);
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

    const result = FormSchema.safeParse({
      plate,
      brand,
      model,
      variant,
      manufactureYear,
      modelYear,
      chassis,
      color,
      fuel,
      city,
      state,
    } satisfies z.infer<typeof FormSchema>);

    if (!result.success) {
      const [issue] = result.error.issues;
      if (issue !== undefined) toast.error(issue.message);
      return;
    }

    try {
      await api.post("/automobiles", result.data);
      toast.success("Automóvel cadastrado com sucesso");
      router.push("/auto/admin/automoveis");
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
        <Link href="/auto/admin/automoveis">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <form className="mt-6" onSubmit={handleSubmit}>
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
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" asChild>
            <Link href="/auto/admin/automoveis">
              <X className="size-4" />
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <FloppyDisk className="size-4" />
            Cadastrar
          </Button>
        </div>
      </form>
    </>
  );
};

export default Page;
