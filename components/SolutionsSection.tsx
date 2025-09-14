"use client";

import { Bot, Phone, MessageSquare, TrendingUp, Clock, Headphones } from "lucide-react";

export default function SolutionsSection() {
  const solutions = [
    {
      icon: Bot,
      title: "3D AI Chatbot",
      description: "Immersive 3D AI chatbot experience with lifelike avatars and natural conversations for enhanced customer engagement.",
      features: ["Lifelike Avatars", "Natural Conversations", "3D Interactions"],
      gradient: "from-yellow-500 to-orange-600",
      image: "🤖",
      support: "24/7 Available"
    },
    {
      icon: Phone,
      title: "AI Call Feature",
      description: "Advanced AI-powered calling system with voice recognition and intelligent responses for seamless customer support.",
      features: ["Voice Recognition", "Intelligent Responses", "Call Analytics"],
      gradient: "from-orange-500 to-amber-600",
      image: "📞",
      support: "24/7 Available"
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot",
      description: "Smart conversational AI chatbot with natural language processing capabilities for instant customer assistance.",
      features: ["Natural Language Processing", "Instant Responses", "Multi-language Support"],
      gradient: "from-amber-500 to-yellow-600",
      image: "💬",
      support: "24/7 Available"
    }
  ];

  return (
    <section id="solutions" className="relative py-24 bg-gradient-to-b from-gray-900 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(250,204,21,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our AI
            </span>{" "}            
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Cutting-edge AI solutions providing 24/7 support and intelligent automation for your business needs
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden"
              >
                {/* Card */}
                <div className="relative h-full p-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105">
                  {/* Background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                {/* Header */}
                  <div className="relative z-10 mb-6">
                  <div className="absolute -top-4 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>24/7</span>
                    </div>
                  </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${solution.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-4xl">{solution.image}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                      {solution.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {solution.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="relative z-10 space-y-3 mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${solution.gradient} rounded-full`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Support indicator */}
                  <div className="relative z-10 flex items-center space-x-2 text-yellow-400 text-sm font-medium mb-6">
                    <Headphones className="w-4 h-4" />
                    <span>{solution.support}</span>
                  </div>

                  {/* CTA */}
                  <div className="relative z-10">
                    <button className={`w-full py-3 bg-gradient-to-r ${solution.gradient} text-white font-semibold rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}>
                      Get Started
                    </button>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-xl rounded-3xl border border-yellow-500/20">
            <h3 className="text-3xl font-bold text-white mb-4">
              Need a Custom AI Solution?
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Our AI solutions are highly customizable and can be adapted to any business need. 
              Let's discuss how we can create a tailored solution with 24/7 support for your specific requirements.
            </p>
            <button className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300">
              <span className="relative z-10">Contact Our Experts</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
