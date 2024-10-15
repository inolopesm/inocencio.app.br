import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { TextField } from "../components/ui/text-field";

export default function Component() {
  const [plate, setPlate] = useState("");
  const [apiPlacasData, setApiPlacasData] = useState<unknown>(null);

  const handlePlateChange = (value: string) => {
    const newPlate = value
      .slice(0, 7)
      .replace(/[^A-Za-z0-9]+/g, "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toUpperCase();

    setPlate(newPlate);

    if (newPlate.length === 7) {
      axios(
        `https://wdapi2.com.br/consulta/${newPlate}/${import.meta.env.VITE_API_PLACAS_TOKEN}`,
      )
        .then((response) => setApiPlacasData(response.data))
        .catch(() => toast.error("Não foi possível buscar dados do automóvel"));
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl">Novo Automóvel</h1>
      <Button className="mt-6" variant="secondary" asChild>
        <Link to="/auto/admin/automoveis">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>
      <form className="mt-6">
        <TextField
          label="Placa"
          placeholder="AAA0X00 ou AAA9999"
          autoCapitalize="characters"
          autoComplete="off"
          value={plate}
          onValueChange={handlePlateChange}
        />
        <div className="mt-4 overflow-auto rounded bg-black p-2 text-white">
          <code>
            <pre>{JSON.stringify(apiPlacasData, null, 2)}</pre>
          </code>
        </div>
      </form>
    </>
  );
}
