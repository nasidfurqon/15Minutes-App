import React, { useEffect, useState } from "react";

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

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

export default DashboardHome;
