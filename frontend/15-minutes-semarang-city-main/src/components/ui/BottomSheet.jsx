import React from "react";

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

// Mapping icon berdasarkan tipe fasilitas
const getIconForType = (type) => {
	const iconMap = {
		Kesehatan: KesehatanIcon,
		Pendidikan: PendidikanIcon,
		Ibadah: MasjidIcon, // Jika ingin lebih detail, bisa mapping ke Masjid/Gereja/Klenteng/Pura/Vihara sesuai kebutuhan
		Bandara: BandaraIcon,
		Gereja: GerejaIcon,
		Klenteng: KlentengIcon,
		Masjid: MasjidIcon,
		Pemerintah: PemerintahIcon,
		Perpustakaan: PerpustakaanIcon,
		Pura: PuraIcon,
		Restoran: RestoranIcon,
		Stasiun: StasiunIcon,
		Taman: TamanIcon,
		Terminal: TerminalIcon,
		Toko: TokoIcon,
		Vihara: ViharaIcon,
		// Tambahkan kategori lain jika ada
	};

	return iconMap[type] || KesehatanIcon;
};

const BottomSheet = ({ isVisible, facilities, geoInfo, onFacilitySelect }) => {
	return (
		<div
			className={`absolute bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-2xl transition-transform duration-300 ${
				isVisible ? "translate-y-0" : "translate-y-full"
			}`}
		>
			<div className="bg-white/80 backdrop-blur-md rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
				<div className="w-full py-3 flex justify-center cursor-grab active:cursor-grabbing">
					<div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
				</div>

				<div className="px-6 pb-4 flex-shrink-0">
					<h2 className="text-xl font-bold text-brand-dark-blue">
						{facilities.length} Fasilitas Publik Ditemukan
					</h2>
				</div>

				<div className="overflow-y-auto px-6 flex-grow">
					<ul className="divide-y divide-gray-200">
						{facilities.map((facility, index) => (
							<li key={facility.id} className="py-3">
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										onFacilitySelect(facility);
									}}
									className="group flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
								>
									<span className="flex-shrink-0 w-6 text-center font-semibold text-gray-500">
										{index + 1}.
									</span>
									<img
										src={getIconForType(facility.type)}
										alt={facility.type}
										className="w-6 h-6 object-contain flex-shrink-0"
									/>
									<span className="flex-grow text-blue-600 group-hover:underline font-medium">
										{facility.name}
									</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m8.25 4.5 7.5 7.5-7.5 7.5"
										/>
									</svg>
								</a>
							</li>
						))}
					</ul>
				</div>

				<div className="mt-auto p-6 border-t border-gray-300 bg-brand-accent/30 flex-shrink-0">
					<button className="w-full py-3 px-4 bg-brand-accent text-brand-dark-blue font-semibold rounded-lg shadow-lg mb-4 hover:bg-white transition-colors">
						Detail Informasi Geografis
					</button>
					<div className="text-sm text-gray-700 space-y-1">
						<p>
							<b>Kepadatan Penduduk:</b> {geoInfo.populationDensity}
						</p>
						<p>
							<b>Kelurahan:</b> {geoInfo.kelurahan}
						</p>
						<p>
							<b>Kecamatan:</b> {geoInfo.kecamatan}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BottomSheet;
