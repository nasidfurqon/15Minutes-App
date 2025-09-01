import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMapZoom } from "../../hooks/useMapZoom";

// Import semua icon SVG lokal
import BandaraIcon from "../../assets/icons/Bandara.svg";
import GerejaIcon from "../../assets/icons/Gereja.svg";
import KesehatanIcon from "../../assets/icons/Kesehatan.svg";
import KlentengIcon from "../../assets/icons/Klenteng.svg";
import MasjidIcon from "../../assets/icons/Masjid.svg";
import PemerintahIcon from "../../assets/icons/Pemerintah.svg";
import PendidikanIcon from "../../assets/icons/Pendidikan.svg";
import PerpustakaanIcon from "../../assets/icons/Perpustakaan.svg";
import PuraIcon from "../../assets/icons/Pura.svg";
import RestoranIcon from "../../assets/icons/Restoran.svg";
import StasiunIcon from "../../assets/icons/Stasiun.svg";
import TamanIcon from "../../assets/icons/Taman.svg";
import TerminalIcon from "../../assets/icons/Terminal.svg";
import TokoIcon from "../../assets/icons/Toko.svg";
import ViharaIcon from "../../assets/icons/Vihara.svg";

// Fungsi untuk membuat ikon kustom dengan path gambar
const createIcon = (iconPath, size = [32, 32]) => {
	return L.icon({
		iconUrl: iconPath,
		iconSize: size,
		iconAnchor: [size[0] / 2, size[1]],
		popupAnchor: [0, -size[1]],
		shadowUrl: null,
		className: "custom-facility-icon",
	});
};

// Ikon untuk berbagai tipe fasilitas menggunakan icon lokal
const icons = {
	Kesehatan: createIcon(KesehatanIcon),
	Pendidikan: createIcon(PendidikanIcon),
	Ibadah: createIcon(MasjidIcon), // Jika ingin lebih detail, bisa mapping ke Masjid/Gereja/Klenteng/Pura/Vihara sesuai kebutuhan
	Bandara: createIcon(BandaraIcon),
	Gereja: createIcon(GerejaIcon),
	Klenteng: createIcon(KlentengIcon),
	Masjid: createIcon(MasjidIcon),
	Pemerintah: createIcon(PemerintahIcon),
	Perpustakaan: createIcon(PerpustakaanIcon),
	Pura: createIcon(PuraIcon),
	Restoran: createIcon(RestoranIcon),
	Stasiun: createIcon(StasiunIcon),
	Taman: createIcon(TamanIcon),
	Terminal: createIcon(TerminalIcon),
	Toko: createIcon(TokoIcon),
	Vihara: createIcon(ViharaIcon),
	// Tambahkan kategori lain jika ada
	default: createIcon(KesehatanIcon, [28, 28]),
};

// Ikon titik sederhana untuk saat zoom out
const createDotIcon = (color) => {
	return L.divIcon({
		className: "custom-dot-icon",
		html: `<div style="background-color:${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
		iconSize: [12, 12],
		iconAnchor: [6, 6],
	});
};

const getIcon = (type, zoomLevel) => {
	if (zoomLevel < 15) {
		const color =
			{
				Kesehatan: "#ff4444",
				Pendidikan: "#ffdd00",
				Ibadah: "#00aa00",
				Bandara: "#0066cc",
				Gereja: "#4444ff",
				Klenteng: "#ffaa00",
				Masjid: "#00aa00",
				Pemerintah: "#666666",
				Perpustakaan: "#aa44ff",
				Pura: "#00ff44",
				Restoran: "#ff8800",
				Stasiun: "#8800ff",
				Taman: "#00aa00",
				Terminal: "#ff4400",
				Toko: "#ff00aa",
				Vihara: "#aa00ff",
				// Tambahkan kategori lain jika ada
			}[type] || "#666666";
		return createDotIcon(color);
	}
	return icons[type] || icons.default;
};

const FacilityMarker = ({ facility, onSelect }) => {
	const { position, name, type, address, contact, hours } = facility;
	const zoomLevel = useMapZoom();

	return (
		<Marker position={position} icon={getIcon(type, zoomLevel)}>
			<Popup className="custom-popup">
				<div className="font-sans p-2 min-w-[200px]">
					<h3 className="font-bold text-lg mb-2 text-brand-dark-blue m-0">
						{name}
					</h3>
					<div className="space-y-1 text-sm mb-3">
						<p className="m-0">
							<span className="font-semibold">Tipe:</span> {type}
						</p>
						{address && (
							<p className="m-0">
								<span className="font-semibold">Alamat:</span> {address}
							</p>
						)}
						{contact && contact !== "N/A" && (
							<p className="m-0">
								<span className="font-semibold">Kontak:</span> {contact}
							</p>
						)}
						{hours && (
							<p className="m-0">
								<span className="font-semibold">Jam:</span> {hours}
							</p>
						)}
					</div>
					<button
						onClick={() => onSelect(facility)}
						className="w-full px-3 py-2 bg-brand-light-blue text-brand-dark-blue font-semibold rounded-md hover:bg-brand-accent transition-colors text-sm"
					>
						Lihat Detail Lengkap
					</button>
				</div>
			</Popup>
		</Marker>
	);
};

export default FacilityMarker;
