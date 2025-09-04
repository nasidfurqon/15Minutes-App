import React, {useEffect, useState} from "react";
import { Link, Routes, Route } from "react-router-dom";
// halaman konten per menu
function District() {
  return <h2 className="text-xl font-semibold">Halaman District</h2>;
}

function PublicService() {
  return <h2 className="text-xl font-semibold">Halaman Public Service</h2>;
}

function Kelurahan() {
  return <h2 className="text-xl font-semibold">Halaman Kelurahan</h2>;
}

function DashboardHome() {
  const [data, setData] = useState({
    districtCount: 0,
    publicServiceCount: 0,
    kelurahanCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCounts = async () => {
      try {

        // fetch paralel biar cepat
        const [districtRes, publicServiceRes, kelurahanRes] = await Promise.all(
          [
            fetch("http://127.0.0.1:8000/api/count/districts"),
            fetch("http://127.0.0.1:8000/api/count/public_services"),
            fetch("http://127.0.0.1:8000/api/count/kelurahans"),
          ]
        );

        const districtData = await districtRes.json();
        const publicServiceData = await publicServiceRes.json();
        const kelurahanData = await kelurahanRes.json();

        setData({
          districtCount: districtData.data ?? 0,
          publicServiceCount: publicServiceData.data ?? 0,
          kelurahanCount: kelurahanData.data ?? 0,
        });
      } catch (err) {
        console.error("Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCounts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card District */}
      <div className="bg-white shadow-md rounded-xl h-48 flex flex-col items-center justify-center">
        <h3 className="text-3xl font-bold mb-2">{data.districtCount}</h3>
        <p className="text-gray-600 text-lg">Total District</p>
      </div>

      {/* Card Public Service */}
      <div className="bg-white shadow-md rounded-xl h-48 flex flex-col items-center justify-center">
        <h3 className="text-3xl font-bold mb-2">{data.publicServiceCount}</h3>
        <p className="text-gray-600 text-lg">Total Public Service</p>
      </div>

      {/* Card Kelurahan */}
      <div className="bg-white shadow-md rounded-xl h-48 flex flex-col items-center justify-center">
        <h3 className="text-3xl font-bold mb-2">{data.kelurahanCount}</h3>
        <p className="text-gray-600 text-lg">Total Kelurahan</p>
      </div>
    </div>
  );
}


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
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="district" element={<District />} />
          <Route path="public-service" element={<PublicService />} />
          <Route path="kelurahan" element={<Kelurahan />} />
        </Routes>
      </main>
    </div>
  );
}

export default DashboardAdmin;
