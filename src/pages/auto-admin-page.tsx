export default function Component() {
  return (
    <>
      <h1 className="font-semibold text-2xl">Dashboard</h1>
      <section className="mt-12 flex justify-evenly gap-x-4 overflow-x-auto">
        <div className="size-48 shrink-0 rounded bg-gray-300" />
        <div className="size-48 shrink-0 rounded bg-gray-300" />
        <div className="size-48 shrink-0 rounded bg-gray-300" />
        <div className="size-48 shrink-0 rounded bg-gray-300" />
        <div className="size-48 shrink-0 rounded bg-gray-300" />
        <div className="size-48 shrink-0 rounded bg-gray-300" />
      </section>
      <section className="mt-12 grid gap-12 md:grid-cols-2">
        <div className="aspect-video rounded bg-gray-300" />
        <div className="aspect-video rounded bg-gray-300" />
      </section>
      <section className="mt-12">
        <div className="aspect-video rounded bg-gray-300" />
      </section>
    </>
  );
}
