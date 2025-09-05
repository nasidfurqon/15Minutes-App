import React, { useEffect, useState } from "react";

export default function District() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDistricts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/list/districts");
      const data = await res.json();
      setDistricts(data.data || []);
    } catch (err) {
      console.error("Gagal fetch districts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus district ini?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/delete/districts/${id}`, {
        method: "DELETE",
      });
      setDistricts(districts.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Gagal delete:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}


      {/* Card Tabel */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mb-2"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {districts.length > 0 ? (
                districts.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{d.id}</td>
                    <td className="px-6 py-3">{d.name}</td>
                    <td className="px-6 py-3 text-center space-x-2">
                      <button
                        onClick={() => alert(`TODO: edit district ${d.id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data district
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
