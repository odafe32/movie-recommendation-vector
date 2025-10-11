"use client";

import { MagnifyingGlassIcon, SparklesIcon, FilmIcon, StarIcon, FireIcon, BoltIcon, EnvelopeIcon, UserGroupIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LandingNav from "./LandingNav";

export default function LandingHero() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      router.push(`/search/${encodeURIComponent(trimmedTerm)}`);
    } else {
      router.push("/browse");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <LandingNav />

      {/* HOME SECTION */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/30 rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-500/30 rounded-full animate-bounce-slow"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
          {/* Icon/Logo with Premium Effect */}
          <div className="flex justify-center mb-8 animate-scaleIn">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-3xl shadow-2xl transform group-hover:scale-110 transition-all duration-300 animate-float">
                <FilmIcon className="h-20 w-20 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Heading with Premium Typography */}
          <div className="space-y-6 animate-slideInUp">
            <div className="inline-block">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6 animate-bounce-slow">
                <SparklesIcon className="h-5 w-5 dark-text-purple-400  text-dark animate-wiggle" />
                <span className="text-sm font-semibold dark:text-purple-300  text-dark uppercase tracking-wider">AI-Powered Recommendations</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
              Discover Your
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Perfect Movie
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Experience the future of movie discovery with our advanced AI. 
              Simply describe what you're in the mood for, and we'll find your perfect match.
            </p>
          </div>

          {/* Premium Search Bar */}
          <div className="max-w-3xl mx-auto mt-16 animate-slideInUp">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500 animate-gradient-slow"></div>
              <div className="relative flex items-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                <div className="flex-1 flex items-center px-6 py-6">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 mr-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Try 'thrilling space adventure' or 'heartwarming romance'..."
                    className="flex-1 text-lg outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500"
                    aria-label="Search for movies"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="m-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
                  aria-label="Search movies"
                >
                  <span className="text-lg">Search</span>
                  <BoltIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 animate-slideInUp">
            <button
              onClick={() => router.push("/browse")}
              className="group px-10 py-5 bg-gray-100 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <FilmIcon className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              <span className="text-lg">Browse Collection</span>
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
                <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">About Us</span>
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Revolutionizing Movie Discovery
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help you find the perfect movie every time, powered by cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-3xl p-12">
                  <RocketLaunchIcon className="h-16 w-16 text-purple-400 mb-6 animate-float" />
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    To eliminate the endless scrolling and help you discover movies that truly resonate with your mood, preferences, and taste. No more decision fatigue!
                  </p>
                </div>
              </div>
            </div>

            <div className="scroll-animate">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-3xl p-12">
                  <UserGroupIcon className="h-16 w-16 text-blue-400 mb-6 animate-float" />
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Technology</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    Using advanced vector search and natural language processing, we understand what you're looking for and match it with our vast movie database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
                <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Features</span>
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Why Choose MovieAI?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative scroll-animate">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-lg animate-bounce-slow">
                    <SparklesIcon className="h-10 w-10 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Advanced vector search technology finds movies that perfectly match your preferences
                </p>
              </div>
            </div>
            
            <div className="group relative scroll-animate">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg animate-bounce-slow">
                    <FireIcon className="h-10 w-10 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Smart Search</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Describe what you want in natural language and get instant, accurate results
                </p>
              </div>
            </div>
            
            <div className="group relative scroll-animate">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-pink-600 to-pink-800 rounded-2xl shadow-lg animate-bounce-slow">
                    <StarIcon className="h-10 w-10 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Vast Library</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Explore lists of movies across all genres, eras, and styles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-16 scroll-animate">
            <div className="inline-block mb-4">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
                <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Get In Touch</span>
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Let's Connect
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="relative group scroll-animate">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all"></div>
            <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-3xl p-12">
              <div className="flex flex-col items-center text-center space-y-8">
                <div className="p-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl animate-float">
                  <EnvelopeIcon className="h-16 w-16 text-white" strokeWidth={2} />
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    We typically respond within 24 hours
                  </p>
                  <a
                    href="mailto:godfreyj.sule1@gmail.com"
                    className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
                  >
                    godfreyj.sule1@gmail.com
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
                  <div className="bg-gray-100 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Support</p>
                    <p className="text-gray-900 dark:text-white font-semibold">support@movieai.com</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Business</p>
                    <p className="text-gray-900 dark:text-white font-semibold">business@movieai.com</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Press</p>
                    <p className="text-gray-900 dark:text-white font-semibold">press@movieai.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
              <FilmIcon className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              Movie<span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">AI</span>
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Discover your perfect movie with AI-powered recommendations
          </p>
          <p className="text-gray-500 dark:text-gray-600 text-sm">
            © 2025 MovieAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
