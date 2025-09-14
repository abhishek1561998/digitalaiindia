"use client";

import { Bot, Phone, MessageSquare, Sparkles, Clock, Headphones } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: "3D AI Chatbot",
      description: "Immersive 3D AI chatbot experience with lifelike avatars and natural conversations. Available 24/7 for instant support.",
      gradient: "from-yellow-400 to-orange-500",
      delay: "0",
      support: "24/7 Support"
    },
    {
      icon: Phone,
      title: "AI Call Feature",
      description: "Advanced AI-powered calling system with voice recognition and intelligent responses. Round-the-clock availability for your customers.",
      gradient: "from-orange-500 to-amber-500",
      delay: "200",
      support: "24/7 Support"
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot",
      description: "Smart conversational AI chatbot with natural language processing capabilities. Always ready to assist your customers instantly.",
      gradient: "from-amber-500 to-yellow-500",
      delay: "400",
      support: "24/7 Support"
    }
  ];

  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover our cutting-edge AI solutions that provide 24/7 support and intelligent automation for your business
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animationDelay: `${feature.delay}ms`
                }}
              >
                {/* Card */}
                <div className="relative h-full p-8 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-xl"
                       style={{
                         background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                         backgroundImage: `linear-gradient(135deg, rgb(250 204 21), rgb(249 115 22))`
                       }}></div>
                  
                  {/* 24/7 Support Badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>24/7</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 mb-4">
                    {feature.description}
                  </p>

                  {/* Support indicator */}
                  <div className="flex items-center space-x-2 text-yellow-400 text-sm font-medium">
                    <Headphones className="w-4 h-4" />
                    <span>{feature.support}</span>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-6">Ready to experience our 24/7 AI solutions?</p>
          <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300">
            <span className="relative z-10">Get Started Today</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </button>
        </div>
      </div>
    </section>
  );
}
