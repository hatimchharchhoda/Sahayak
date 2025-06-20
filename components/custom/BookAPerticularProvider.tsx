import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BookAPerticularProvider = () => {
  return (
    <div>
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
          >
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Choose Your Trusted Provider
              </h2>
              <p className="text-base md:text-xl text-gray-600 leading-relaxed">
                Find and book top-rated service providers available in your
                city. Whether it’s cleaning, plumbing, or salon services —
                choose who you trust, when you need it.
              </p>
              <p className="text-base md:text-lg text-gray-700 font-medium">
                Take control of your service experience by selecting a
                professional based on location, ratings, and reviews.
              </p>

              <Link href="/browse-providers">
                <Button className="mt-5 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 md:px-8 py-4 md:py-6 rounded-full text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Browse Providers
                  <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative w-full h-80 md:h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl md:text-6xl"
                  >
                    💼✨
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 text-xl md:text-2xl font-semibold text-indigo-800"
                  >
                    City-Based Experts, Handpicked for You
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-2 text-gray-700 text-sm md:text-base"
                  >
                    No more random assignments. Choose the provider you want —
                    trusted, rated, and local.
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BookAPerticularProvider;
