export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Loading skeleton */}
        <div className="text-center mb-16">
          {/* Breadcrumb skeleton */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-2 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6 animate-pulse">
            <div className="w-8 h-8 bg-white/20 rounded"></div>
          </div>
          <div className="h-16 bg-gray-800 rounded-xl mb-6 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-6 bg-gray-800 rounded-lg w-2/3 mx-auto animate-pulse"></div>
        </div>
        
        {/* Search bar skeleton */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-12 bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="h-12 w-32 bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="h-12 w-32 bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Posts grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-900/50 rounded-2xl p-8 animate-pulse">
              <div className="h-48 bg-gray-800 rounded-xl mb-6"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-800 rounded w-24"></div>
                <div className="h-4 bg-gray-800 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-800 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-800 rounded-full w-16"></div>
                <div className="h-6 bg-gray-800 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-gray-800 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
