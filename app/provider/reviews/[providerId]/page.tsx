"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/custom/loading";
import { Review } from "@/lib/types";

export default function ProviderReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    if (params?.providerId) {
      setProviderId(params.providerId as string);
    }
  }, [params]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!providerId) return;
      try {
        const response = await axios.post(
          `/api/providerReviews/${providerId}`,
          {
            providerId,
          }
        );
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [providerId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Reviews</h1>

        {reviews.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-gray-600">
              No reviews yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold">{review.User.name}</h3>
                        <p className="text-sm text-gray-500">
                          Service: {review.Service.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < review.stars
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.review && (
                    <p className="mt-4 text-gray-700">{review.review}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
