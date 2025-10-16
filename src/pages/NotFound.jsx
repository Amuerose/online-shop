export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8e6e0] to-[#e8d8c3] text-center p-8">
      <h1 className="text-6xl font-semibold text-[#4B2E0E] mb-6">404</h1>
      <p className="text-xl text-[#5c3d1f] mb-8">Stránka nebyla nalezena / Page not found</p>
      <a
        href="/"
        className="px-6 py-3 bg-[#BDA47A]/80 backdrop-blur-md text-white rounded-xl shadow-md hover:bg-[#BDA47A] transition-all duration-300"
      >
        Zpět domů / Back home
      </a>
    </div>
  );
}