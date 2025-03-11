import { Loader2Icon } from "lucide-react";

const loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Loader2Icon size={30} className="animate-spin stroke-emerald" />
    </div>
  );
};

export default loading;
