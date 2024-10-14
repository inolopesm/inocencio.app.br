import { ChartBar, Check, Gear, Users } from "@phosphor-icons/react/dist/ssr";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function Component() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 md:px-6">
        <Link className="font-serif text-2xl" to="/">
          <span className="text-primary">ino</span>auto
        </Link>
      </header>
      <main className="grow">
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
          <h1 className="text-3xl font-semibold tracking-tighter">
            Gerencie sua Loja de Automóveis com facilidade
          </h1>
          <p className="mt-2">
            Simplifique operações, impulsione vendas, e cresça seu negócio de
            loja de veículos com nossa solução tudo-em-um para gestão.
          </p>
          <p className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <a
                href="https://wa.me/5583991957887"
                rel="noreferrer noopener"
                target="_blank"
              >
                Solicitar demonstração
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#funcionalidades-chave">Ver mais</a>
            </Button>
          </p>
        </section>
        <section
          className="bg-primary/5 px-4 py-12 md:px-6 md:py-24"
          id="funcionalidades-chave"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-medium tracking-tighter">
              Funcionalidades Chave
            </h2>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <div className="rounded border border-gray-300 bg-white p-4">
                <ChartBar className="size-12 text-primary" />
                <h3 className="mt-2 font-medium">Gestão de Inventório</h3>
                <p className="mt-4 text-sm">
                  Rastreie e gerencie seu inventório de veículos da sua loja com
                  atualizações e alertas em tempo real.
                </p>
              </div>
              <div className="rounded border border-gray-300 bg-white p-4">
                <Users className="size-12 text-primary" />
                <h3 className="mt-2 font-medium">
                  Gestão de Relacionamento com Clientes
                </h3>
                <p className="mt-4 text-sm">
                  Gerencie informações de clientes, rastreie histórico de
                  compras, e melhore a retenção com um marketing direcionado.
                </p>
              </div>
              <div className="rounded border border-gray-300 bg-white p-4">
                <Gear className="size-12 text-primary" />
                <h3 className="mt-2 font-medium">Gestão de Serviços</h3>
                <p className="mt-4 text-sm">
                  Agende compromissos, atribua técnicos e acompanhe o progresso
                  do serviço para operações eficientes.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-4 py-12 md:px-6 md:py-24">
          <h2 className="text-center text-3xl font-medium tracking-tighter">
            Planos de Preços
          </h2>
          <div className="mt-12 grid gap-6">
            <div className="rounded border border-gray-300 bg-white p-4">
              <h3 className="text-xl font-medium">Plano único</h3>
              <p className="mt-6 text-4xl font-semibold tracking-tighter">
                Em breve
              </p>
              <ul className="mt-4 grid gap-1 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> Veículos ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> Gerador de Contratos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> Nota Fiscal
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> Suporte via Whatsapp
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="bg-primary/5 px-4 py-12 md:px-6 md:py-24">
          <h2 className="text-center text-3xl font-medium tracking-tighter">
            O que nossos clientes estão dizendo
          </h2>
          <div className="mt-12 text-center text-gray-600">
            Nenhum depoimento registrado até o momemto
          </div>
        </section>
        <section className="px-4 py-12 text-center">
          <h2 className="text-center text-3xl font-medium tracking-tighter">
            Preparado para crescer sua loja de automóveis?
          </h2>
          <p className="mt-2">
            Junte-se a vários proprietários de loja de veículos que
            transformaram seus negócios conosco.
          </p>
          <p className="mt-4">
            <Button asChild>
              <a
                href="https://wa.me/5583991957887"
                rel="noreferrer noopener"
                target="_blank"
              >
                Solicitar demonstração
              </a>
            </Button>
          </p>
        </section>
      </main>
      <footer className="bg-primary/5 p-4 text-center text-sm md:px-6">
        <p>
          Este site é mantido e operado por MATHEUS INOCENCIO LOPES -
          55.740.093/0001-82
        </p>
      </footer>
    </div>
  );
}
