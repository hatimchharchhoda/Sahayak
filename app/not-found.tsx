import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 px-4">
      <div className="text-4xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
        Sayahak
      </div>
      <div className="flex items-center mb-8">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mr-4 animate-bounce" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          404 - Page Not Found
        </h1>
      </div>
      <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        Oops! It seems the service you&apos;re looking for is currently
        unavailable.
      </p>
      <Link
        href="/"
        className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
      >
        <Home className="w-5 h-5 mr-2" />
        Return Home
      </Link>
      <div className="mt-16 flex justify-center space-x-8">
        <IconSpin icon="🧹" speed="animate-spin-slow" />
        <IconSpin icon="🔧" speed="animate-spin-slower" />
        <IconSpin icon="🏠" speed="animate-spin-slow" />
        <IconSpin icon="🔨" speed="animate-spin-slower" />
      </div>
    </div>
  );
}

function IconSpin({ icon, speed }: { icon: string; speed: string }) {
  return <div className={`text-4xl ${speed}`}>{icon}</div>;
}
