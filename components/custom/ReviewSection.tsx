import React from "react";
import { Card, CardContent } from "../ui/card";
import { Star, UserIcon } from "lucide-react";

export interface Booking {
  id: string;
  status: string;
  rating?: {
    stars: number;
    review?: string;
    User: {
      name: string;
    };
  };
  // Add any other fields you need from serviceDetails
}

interface Props {
  serviceDetails: Booking;
}

const ReviewSection = ({ serviceDetails }: Props) => {
  if (serviceDetails?.status !== "COMPLETED" || !serviceDetails?.rating) {
    return null;
  }

  const rating = serviceDetails.rating;

  return (
    <Card className="bg-yellow-50 mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Client Review
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-yellow-600" />
              <span className="font-medium text-gray-700">
                {rating.User.name}
              </span>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < rating.stars
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({rating.stars}/5)
              </span>
            </div>
          </div>
          {rating.review && (
            <p className="text-gray-700 bg-white/50 p-4 rounded-lg">
              &quot;{rating.review}&quot;
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
