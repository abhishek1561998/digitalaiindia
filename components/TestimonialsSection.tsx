"use client";

import { Star, Quote, Users, Award, TrendingUp, Globe } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "CTO, TechCorp India",
      company: "TechCorp",
      content: "Digitalaiindia.com transformed our business operations completely. The AI solutions are incredibly sophisticated and have increased our efficiency by 300%.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Priya Sharma",
      role: "CEO, InnovateLabs",
      company: "InnovateLabs",
      content: "The machine learning models are exceptionally accurate. We've seen a 250% improvement in our predictive analytics capabilities.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Amit Patel",
      role: "Head of AI, DataFlow",
      company: "DataFlow",
      content: "Outstanding AI infrastructure and support. The team's expertise in neural networks is unmatched in the industry.",
      rating: 5,
      avatar: "👨‍🔬"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Users",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      value: "99.9%",
      label: "Accuracy Rate",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      value: "500%",
      label: "ROI Increase",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Stats Section */}
        {/* <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Trusted by
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="group text-center"
                >
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${stat.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 animate-pulse-glow`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}

        {/* Testimonials Section */}
        <div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                What Our
              </span>
             {" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative h-full p-8 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-500 group-hover:transform group-hover:scale-105">
                  {/* Quote icon */}
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex space-x-1 mb-6 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 leading-relaxed mb-8 group-hover:text-white transition-colors duration-300">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
