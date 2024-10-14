import { ChartBar, Check, Gear, Users } from "@phosphor-icons/react/dist/ssr";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function Component() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[320px] flex-col items-center">
      <header className="mx-auto flex h-14 w-full items-center px-4 md:px-6">
        <Link className="font-serif text-2xl" to="/">
          <span className="text-primary">ino</span>auto
        </Link>
      </header>
      <main className="grow">
        <section className="px-4 py-12 ">
          <h1 className="text-3xl font-semibold tracking-tighter">
            Manage Your Auto Stores with Ease
          </h1>
          <p className="mt-2">
            Streamline operations, boost sales, and grow your auto store
            business with our all-in-one management solution.
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
              <Link to="/">Ver mais</Link>
            </Button>
          </p>
        </section>
        <section className="bg-primary/5 px-4 py-12">
          <h2 className="text-center text-3xl font-medium tracking-tighter">
            Key Features
          </h2>
          <div className="mt-12 grid gap-6">
            <div className="rounded border border-gray-300 bg-white p-4">
              <ChartBar className="size-12 text-primary" />
              <h3 className="mt-2 font-medium">Inventory Management</h3>
              <p className="mt-4 text-sm">
                Track and manage your auto parts inventory across multiple
                stores with real-time updates and alerts.
              </p>
            </div>
            <div className="rounded border border-gray-300 bg-white p-4">
              <Users className="size-12 text-primary" />
              <h3 className="mt-2 font-medium">
                Customer Relationship Management
              </h3>
              <p className="mt-4 text-sm">
                Manage customer information, track service history, and improve
                customer retention with targeted marketing.
              </p>
            </div>
            <div className="rounded border border-gray-300 bg-white p-4">
              <Gear className="size-12 text-primary" />
              <h3 className="mt-2 font-medium">Service Center Management</h3>
              <p className="mt-4 text-sm">
                Schedule appointments, assign technicians, and track service
                progress for efficient operations.
              </p>
            </div>
          </div>
        </section>
        <section className="px-4 py-12">
          <h2 className="text-center text-3xl font-medium tracking-tighter">
            Pricing Plans
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
        <section className="bg-primary/5 px-4 py-12">
          <h2 className="text-center text-3xl font-medium tracking-tighter">
            What Our Customers Say
          </h2>
          <div className="mt-12 text-center text-gray-600">
            Nenhum depoimento registrado até o momemto
          </div>
        </section>
        <section className="px-4 py-12 text-center">
          <h2 className="text-center text-3xl font-medium tracking-tighter">
            Ready to Grow Your Auto Store Business?
          </h2>
          <p className="mt-2">
            Join thousands of auto store owners who have transformed their
            businesses with AutoStorePro.
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
      <footer className="mx-auto flex min-h-16 items-center px-4 py-2 text-center text-sm text-gray-600 md:px-6">
        Este site é mantido e operado por MATHEUS INOCENCIO LOPES -
        55.740.093/0001-82
      </footer>
    </div>
  );
}
