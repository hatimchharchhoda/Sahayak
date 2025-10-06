// @ts-nocheck
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Brand / Title */}
      <div className="text-4xl md:text-6xl font-inter font-bold text-gray-900 dark:text-gray-100 mb-4 animate-pulse">
        Sahayak
      </div>

      {/* Subtitle */}
      <div className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 text-center font-poppins">
        Connecting you to quality services effortlessly
      </div>

      {/* Loader Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
      </div>

      {/* Icon Animation Row */}
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
  return (
    <div
      className={`text-3xl md:text-4xl animate-bounce ${delay} text-gray-700 dark:text-gray-200`}
    >
      {icon}
    </div>
  );
}
