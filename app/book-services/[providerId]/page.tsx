"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ServiceCard from "@/components/custom/ServiceCard";
import { Service } from "@/app/services/[categoryName]/page";
import { Sparkles, Package } from "lucide-react";

const ProviderServicesPage = () => {
  const { providerId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderServices = async () => {
      try {
        const res = await axios.post("/api/provider-services", {
          providerId,
        });
        setServices(res.data.services.map((item: any) => item.Service));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProviderServices();
    }
  }, [providerId]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@500;600&family=Nunito+Sans:wght@300;400&display=swap');
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(to right, #EDE7F6 0%, #F8BBD0 50%, #EDE7F6 100%);
          background-size: 1000px 100%;
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
        
        .card-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 20px 40px rgba(255, 111, 97, 0.2);
        }
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .font-lato {
          font-family: 'Lato', sans-serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-nunito {
          font-family: 'Nunito Sans', sans-serif;
        }
      `}</style>

      <section className="min-h-screen bg-gradient-to-br from-[#EDE7F6] via-[#F8BBD0] to-[#EDE7F6] font-lato relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#FF6F61] blur-3xl floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#26C6DA] blur-3xl floating" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16 relative z-10">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md mb-4 border border-[#F8BBD0]/30">
              <Sparkles className="w-4 h-4 text-[#FF6F61]" />
              <span className="text-sm font-poppins font-medium text-[#212121] uppercase tracking-wide">Provider Services</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-montserrat font-semibold text-[#212121] mb-4">
              Services Offered by
              <br />
              <span className="bg-gradient-to-r from-[#FF6F61] via-[#FF8A65] to-[#FF6F61] bg-clip-text text-transparent">
                This Provider
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#424242] font-lato max-w-2xl mx-auto">
              Browse available services and book directly with this professional
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#F8BBD0]/20 p-6"
                >
                  <div className="w-16 h-16 rounded-full animate-shimmer mb-4"></div>
                  <div className="h-6 animate-shimmer rounded mb-2"></div>
                  <div className="h-4 animate-shimmer rounded w-3/4 mb-4"></div>
                  <div className="h-10 animate-shimmer rounded"></div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center py-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#F8BBD0]/30 p-12 animate-fade-slide-up">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EDE7F6] to-[#F8BBD0] flex items-center justify-center mb-6 shadow-lg">
                <Package className="w-10 h-10 text-[#9E9E9E]" />
              </div>
              <h3 className="text-xl font-montserrat font-semibold text-[#212121] mb-2">
                No Services Available
              </h3>
              <p className="text-[#424242] text-base font-lato text-center max-w-md">
                This provider hasn't added any services yet. Please check back later or explore other providers.
              </p>
            </div>
          ) : (
            <>
              {/* Service Count Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-[#F8BBD0]/20">
                  <span className="font-poppins font-medium text-[#FF6F61]">{services.length}</span>
                  <span className="text-sm text-[#424242] font-lato">
                    {services.length === 1 ? 'Service' : 'Services'} Available
                  </span>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="animate-fade-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link
                      href={`/book-services/${providerId}/${service.id}`}
                      className="block h-full"
                    >
                      <ServiceCard service={service} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ProviderServicesPage;