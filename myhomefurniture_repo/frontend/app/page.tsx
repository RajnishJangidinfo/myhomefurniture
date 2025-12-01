import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            My Home Furniture
          </h1>
          <p className="text-2xl text-white mb-8 drop-shadow">
            Elegant pieces for every room
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="bg-white text-purple-600 font-bold px-8 py-4 rounded-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:shadow-2xl transition transform hover:scale-105 border-2 border-white"
            >
              Register
            </Link>
          </div>

          <div className="mt-16 bg-white/20 backdrop-blur-lg rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div>
                <div className="text-4xl mb-2">🛋️</div>
                <h3 className="font-semibold mb-2">Premium Quality</h3>
                <p className="text-sm">High-quality furniture for your home</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-semibold mb-2">Secure Login</h3>
                <p className="text-sm">JWT authentication for safety</p>
              </div>
              <div>
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm">Quick and reliable service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
