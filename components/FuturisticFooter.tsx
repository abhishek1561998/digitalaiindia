"use client";

import { Brain, Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import Link from "next/link";

export default function FuturisticFooter() {
  return (
    <footer className="relative bg-black border-t border-yellow-500/20">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              {/* Enhanced footer logo */}
              <div className="relative">
                <div className="relative w-12 h-12 group-hover:scale-110 transition-all duration-500">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>

                  {/* Middle ring */}
                  <div className="absolute inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                  {/* Inner core */}
                  <div className="absolute inset-2 bg-gradient-to-br from-gray-900 to-black rounded-md flex items-center justify-center">
                    <Brain className="w-5 h-5 text-yellow-400 group-hover:text-orange-300 transition-colors duration-300" />

                    {/* Orbiting particles */}
                    <div className="absolute -inset-2">
                      <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-spin origin-bottom transform -translate-x-1/2"></div>
                      <div className="absolute bottom-0 right-0 w-1 h-1 bg-orange-400 rounded-full animate-spin origin-top-left" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-1/2 left-0 w-1 h-1 bg-amber-400 rounded-full animate-spin origin-right transform -translate-y-1/2" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-orange-400 transition-all duration-300">
                    Digitalai
                  </span>
                  <span className="text-gray-400 group-hover:text-yellow-300 transition-colors duration-300">
                    india.com
                  </span>
                </h3>
                <div className="flex items-center space-x-1 -mt-1">
                  <p className="text-xs text-gray-400 group-hover:text-yellow-400 transition-colors duration-300 font-medium">
                    Future of AI
                  </p>
                  <div className="w-1 h-3 bg-yellow-400 animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pioneering the future of artificial intelligence with cutting-edge solutions 
              that transform businesses and empower innovation across India and beyond.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#solutions"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  AI Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#careers"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">AI Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  3D AI Chatbot
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  AI Call Feature
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  AI Chatbot
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  24/7 Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Voice AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-400 text-sm">contact@digitalaiindia.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-400 text-sm">+91 9516018508</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-gray-400 text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Digitalaiindia.com. All rights reserved. Powered by AI Innovation.
            </p>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
