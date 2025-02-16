import Link from "next/link";
import React, { JSX } from "react";
import { Card, CardContent } from "../ui/card";
import {
  ArrowRight,
  Home,
  Paintbrush,
  Scissors,
  Wifi,
  Wrench,
} from "lucide-react";

interface Category {
  name: string;
  id: string;
}

interface ServicesCardProps {
  category: Category;
}

const ServicesCard: React.FC<ServicesCardProps> = ({ category }) => {
  console.log(category);

  const categoryIcons: Record<string, JSX.Element> = {
    cleaning: <Home className="w-6 h-6" />,
    repair: <Wrench className="w-6 h-6" />,
    painting: <Paintbrush className="w-6 h-6" />,
    plumbing: <Wrench className="w-6 h-6" />,
    electrical: <Wifi className="w-6 h-6" />,
    beauty: <Scissors className="w-6 h-6" />,
  };

  return (
    <div>
      <Link href={`/services/${category.name}`}>
        <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full">
                {categoryIcons[category.name.toLowerCase()] || (
                  <Wrench className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Book Now</p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default ServicesCard;
