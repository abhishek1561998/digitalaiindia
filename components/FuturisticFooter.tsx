"use client";

import { Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.png"
                alt="Digital AI India"
                width={180}
                height={54}
                className="h-14 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(234,179,8,0.25)] brightness-110"
              />
            </Link>
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
