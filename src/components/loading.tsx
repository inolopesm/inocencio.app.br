import { CircleNotch } from "@phosphor-icons/react/dist/ssr";

export const Loading = () => {
  return (
    <div className="fixed flex min-h-screen w-full items-center justify-center bg-gray-100">
      <CircleNotch className="size-12 animate-spin text-primary" />
    </div>
  );
};

export default Loading;
