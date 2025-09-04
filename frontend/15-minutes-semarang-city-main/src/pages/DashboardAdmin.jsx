import { Link, Outlet } from "react-router-dom";

function DashboardAdmin() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-500">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to=""
            className="block py-2 px-3 rounded-lg hover:bg-blue-600 transition"
          >
            Dashboard
          </Link>
          <Link
            to="district"
            className="block py-2 px-3 rounded-lg hover:bg-blue-600 transition"
          >
            District
          </Link>
          <Link
            to="public-service"
            className="block py-2 px-3 rounded-lg hover:bg-blue-600 transition"
          >
            Public Service
          </Link>
          <Link
            to="kelurahan"
            className="block py-2 px-3 rounded-lg hover:bg-blue-600 transition"
          >
            Kelurahan
          </Link>
        </nav>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
}

export default DashboardAdmin;
