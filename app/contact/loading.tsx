import { MessageSquare, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Header Loading Skeleton */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6 animate-pulse">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div className="h-16 bg-gray-800 rounded-xl mb-6 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-6 bg-gray-800 rounded-lg w-2/3 mx-auto animate-pulse"></div>
          
          {/* Benefits Banner Skeleton */}
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-800 animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
                <div>
                  <div className="h-6 bg-gray-700 rounded mb-2 w-48"></div>
                  <div className="h-4 bg-gray-700 rounded w-64"></div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-24 h-1 bg-gray-700 mx-auto mt-6 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information Loading */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
              <div className="h-8 bg-gray-800 rounded-lg mb-8 animate-pulse"></div>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-800 rounded mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded mb-2 w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-800 rounded mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded mb-2 w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-800 rounded mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded mb-2 w-3/4 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded w-4/6 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-800 rounded mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded mb-2 w-3/4 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded w-4/6 animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded w-3/6 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Services Loading */}
              <div className="mt-8 pt-8 border-t border-gray-800">
                <div className="h-5 bg-gray-800 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Loading */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
              <div className="h-8 bg-gray-800 rounded-lg mb-6 animate-pulse"></div>
              
              <div className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                </div>

                {/* Phone and Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                </div>

                {/* Service and Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                  <div className="h-32 bg-gray-800 rounded-xl animate-pulse"></div>
                </div>

                {/* Submit Button */}
                <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Loading */}
        <div className="mt-16">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 animate-pulse">
            <div className="h-8 bg-gray-700 rounded-lg mb-8 mx-auto w-80"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
