import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <div className="text-4xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
        Sayahak
      </div>
      <div className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 text-center">
        Connecting you to quality home services
      </div>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <Loader2 className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <div className="mt-12 flex justify-center space-x-8">
        <IconPulse icon="🧹" delay="delay-100" />
        <IconPulse icon="🔧" delay="delay-200" />
        <IconPulse icon="🏠" delay="delay-300" />
        <IconPulse icon="🔨" delay="delay-400" />
      </div>
    </div>
  );
}

function IconPulse({ icon, delay }: { icon: string; delay: string }) {
  return <div className={`text-3xl animate-bounce ${delay}`}>{icon}</div>;
}
