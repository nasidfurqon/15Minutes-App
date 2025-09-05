import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet icon issue in React
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const categories = [
  { id: 1, name: "Kesehatan" },
  { id: 2, name: "Pendidikan" },
  { id: 3, name: "Transportasi" },
  { id: 4, name: "Belanja" },
  { id: 5, name: "Pemerintahan" },
  { id: 6, name: "Ibadah" },
  { id: 7, name: "Lainnya" },
];

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position === null ? null : <Marker position={position} />;
}

export default function AddPublicServicePage() {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    opening_hours: "",
    rating: "",
  });
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.categoryId || !position) {
      setError("Nama, kategori, dan lokasi wajib diisi.");
      return;
    }
    console.log("Payload dikirim:", {
        name: formData.name?.trim() || "-",
        category_id: Number(formData.categoryId),
        description: formData.description?.trim() || "-",
        website: formData.website?.trim() || "-",
        phone: formData.phone?.trim() || "-",
        email: formData.email?.trim() || "-",
        address: formData.address?.trim() || "-",
        location: {
            lat: position[0],
            lng: position[1],
        },
        opening_hours: formData.opening_hours?.trim() || "{}",
        rating: formData.rating ? Number(formData.rating) : 0,
        is_active: true,
    });

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/add/public_services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        name: formData.name?.trim() || "-",
        category_id: Number(formData.categoryId), // harus angka
        description: formData.description?.trim() || "-",
        website: formData.website?.trim() || "-",
        phone: formData.phone?.trim() || "-",
        email: formData.email?.trim() || "-",
        address: formData.address?.trim() || "-",
        location: {
            lat: position[0],
            lng: position[1],
        },
        rating: formData.rating ? Number(formData.rating) : 0,
        is_active: true,
        }),

      });
      console.log("Response diterima CEK:", position[0], position[1]);
      if (!res.ok) throw new Error("Gagal menambah public service");
      setSuccess("Public service berhasil ditambahkan!");
      setFormData({
        name: "",
        categoryId: "",
        description: "",
        website: "",
        phone: "",
        email: "",
        address: "",
        opening_hours: "",
        rating: "",
      });
      setPosition(null);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Public Service</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <div>
          <label className="block font-medium mb-1">Nama Public Service</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded px-3 py-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Kategori</label>
          <select
            name="categoryId"
            className="w-full border rounded px-3 py-2"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Extra Fields */}
        <div>
          <label className="block font-medium mb-1">Deskripsi</label>
          <textarea
            name="description"
            className="w-full border rounded px-3 py-2"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Website</label>
          <input
            type="text"
            name="website"
            className="w-full border rounded px-3 py-2"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Telepon</label>
          <input
            type="text"
            name="phone"
            className="w-full border rounded px-3 py-2"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Alamat</label>
          <textarea
            name="address"
            className="w-full border rounded px-3 py-2"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        {/* <div>
          <label className="block font-medium mb-1">Jam Buka</label>
          <input
            type="text"
            name="opening_hours"
            className="w-full border rounded px-3 py-2"
            value={formData.opening_hours}
            onChange={handleChange}
          />
        </div> */}
        <div>
          <label className="block font-medium mb-1">Rating</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            className="w-full border rounded px-3 py-2"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>

        {/* Map Picker */}
        <div>
          <label className="block font-medium mb-1">Pilih Lokasi di Peta</label>
          <MapContainer
            center={[-6.9667, 110.4167]}
            zoom={12}
            style={{ height: "300px", width: "100%" }}
            className="rounded"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
          {position && (
            <div className="mt-2 text-sm text-gray-600">
              Koordinat: {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
          )}
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
