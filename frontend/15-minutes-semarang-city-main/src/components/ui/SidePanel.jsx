import React, { useState, useEffect } from "react";
import clsx from "clsx";

// Import icon minimize/maximize dari folder assets
import MinimizeIcon from "../../assets/icons/Minimize-Icon.svg";
import MaximizeIcon from "../../assets/icons/Maximize-Icon.svg";

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
	console.log('Category name received in SidePanel:', type); // Debug log
	const iconMap = {
		Kesehatan: KesehatanIcon,
		Pendidikan: PendidikanIcon,
		Ibadah: MasjidIcon,
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
	};
	const selectedIcon = iconMap[type] || KesehatanIcon;
	console.log('Selected icon for', type, ':', selectedIcon); // Debug log
	return selectedIcon;
};

const SidePanel = ({
	isVisible,
	facilities,
	geoInfo,
	onFacilitySelect,
	onClose,
}) => {
	const [isMinimized, setIsMinimized] = useState(false);
	const [responsiveConfig, setResponsiveConfig] = useState({
		minimizeIconSize: "w-5 h-5",
		maximizeIconSize: "w-6 h-6",
		minimizePadding: "p-2",
		maximizePadding: "p-2",
		minimizedButtonSize: "60px",
		headerFontSize: "text-base",
		listFontSize: "text-sm",
		infoFontSize: "text-sm",
	});
    // Menambah state untuk membedakan mobile portrait dan landscape
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight && window.innerWidth < 1024);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
            const currentIsLandscape = width > height;
            
            setIsMobile(width <= 767);
			setIsLandscape(currentIsLandscape && width < 1024); // Anggap landscape hanya untuk lebar di bawah 1024

			if (currentIsLandscape && width <= 926) {
				setResponsiveConfig({
					minimizeIconSize: "w-4 h-4",
					maximizeIconSize: "w-4 h-4",
					minimizePadding: "p-2",
					maximizePadding: "p-2",
					minimizedButtonSize: "40px",
					headerFontSize: "text-[12px]",
					listFontSize: "text-[11px]",
					infoFontSize: "text-[11px]",
					topPosition: "clamp(65px, 9vh, 75px)",
					marginTop: "8px",
				});
			} else if (width <= 375) {
				setResponsiveConfig({
					minimizeIconSize: "w-5 h-5",
					maximizeIconSize: "w-5 h-5",
					minimizePadding: "p-1",
					maximizePadding: "p-1",
					topPosition: "75px",
					marginTop: "10px",
					minimizedButtonSize: "50px",
					headerFontSize: "text-[11px]",
					listFontSize: "text-[10px]",
					infoFontSize: "text-[10px]",
				});
			} else if (width <= 414) {
				setResponsiveConfig({
					minimizeIconSize: "w-6 h-6",
					maximizeIconSize: "w-7 h-7",
					minimizePadding: "p-1",
					maximizePadding: "p-1",
					topPosition: "clamp(75px, 10vh, 75px)",
					marginTop: "clamp(10px, 1.5vh, 10px)",
					minimizedButtonSize: "60px",
					headerFontSize: "text-[12px]",
					listFontSize: "text-[11px]",
					infoFontSize: "text-[11px]",
				});
			} else {
				setResponsiveConfig({
					minimizeIconSize: "w-5 h-5",
					maximizeIconSize: "w-6 h-6",
					minimizePadding: "p-2",
					maximizePadding: "p-2",
					minimizedButtonSize: "60px",
					headerFontSize: "text-base",
					listFontSize: "text-sm",
					infoFontSize: "text-sm",
					topPosition: "clamp(65px, 9vh, 110px)",
					marginTop: "clamp(8px, 1vh, 16px)",
				});
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
		if (!isVisible) {
			setIsMinimized(false);
		}
	};

	useEffect(() => {
		if (!isVisible) {
			setIsMinimized(false);
		}
	}, [isVisible]);

    const renderHeader = () => (
        <div className="relative bg-[#213448] rounded-tl-2xl px-4 py-3 flex items-center justify-center flex-shrink-0">
            <span className={`text-white font-bold text-center ${responsiveConfig.headerFontSize}`}>
                Informasi Area
            </span>
            <button onClick={toggleMinimize} className="p-2 rounded-full hover:bg-white/20 transition-colors absolute right-4" title="Minimize">
                <img src={MinimizeIcon} alt="Minimize" style={{ width: 20, height: 20, filter: "brightness(0) invert(1)" }} />
            </button>
        </div>
    );

    const renderTitle = () => (
        <div className="flex-shrink-0 mx-14 px-4 pt-4 pb-1">
            <div className="flex justify-center">
                <div className="p-3 rounded-lg mb-3 bg-brand-accent inline-block">
                    <h2 className={`font-bold text-brand-dark-blue text-center whitespace-nowrap ${responsiveConfig.headerFontSize}`}>
                        {facilities.length} Fasilitas Publik Ditemukan
                    </h2>
                </div>
            </div>
        </div>
    );

    const renderFacilityList = () => (
        <div className="flex-grow min-h-0 overflow-y-auto px-4 pb-1">
            <ul className="space-y-2">
                {facilities.map((facility, index) => (
                    <li key={facility.id}>
                        <button onClick={() => onFacilitySelect(facility)} className="group flex items-center gap-3 hover:bg-white/50 p-3 rounded-lg transition-colors w-full text-left">
                            <span className={`flex-shrink-0 w-6 text-center font-semibold text-brand-dark-blue ${responsiveConfig.listFontSize}`}>
                                {index + 1}.
                            </span>
                            <img src={getIconForType(facility.type)} alt={facility.type} className="w-6 h-6 object-contain flex-shrink-0" />
                            <span className={`flex-grow font-medium group-hover:underline text-brand-dark-blue ${responsiveConfig.listFontSize}`}>
                                {facility.name}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderGeoInfo = () => (
        <div className="flex-shrink-0">
            <div className="mx-14 px-4 pt-4 pb-1">
                <div className="flex justify-center">
                    <div className="p-3 rounded-lg mb-2 bg-brand-accent inline-block">
                        <h3 className={`font-semibold text-brand-dark-blue text-center whitespace-nowrap ${responsiveConfig.headerFontSize}`}>
                            Detail Informasi Geografis
                        </h3>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-4">
                <div className={`text-brand-dark-blue ${responsiveConfig.infoFontSize}`}>
                    <div className="grid gap-1" style={{ gridTemplateColumns: "1rem auto auto 1fr", alignItems: "center" }}>
                        <span></span><span className="font-bold">Kepadatan Penduduk /km²</span><span className="font-bold">:</span><span className="ml-1">{geoInfo.populationDensity}</span>
                        <span></span><span className="font-bold">Kecamatan</span><span className="font-bold">:</span><span className="ml-1">{geoInfo.kecamatan}</span>
                        <span></span><span className="font-bold">Kelurahan</span><span className="font-bold">:</span><span className="ml-1">{geoInfo.kelurahan}</span>
                        <span></span><span className="font-bold">Persentase Penduduk</span><span className="font-bold">:</span><span className="ml-1">{geoInfo.population_percentage}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDesktopContent = () => (
        <div className="flex flex-col h-full relative">
            {renderHeader()}
            {renderTitle()}
            {renderFacilityList()}
            {renderGeoInfo()}
        </div>
    );

    const renderMobileLandscapeContent = () => (
        <div className="flex flex-col h-full relative">
            {renderHeader()}
            {renderTitle()}
            <div className="flex-grow min-h-0 overflow-y-auto">
                <div className="px-4 pb-1">
                    <ul className="space-y-2">
                        {facilities.map((facility, index) => (
                           <li key={facility.id}>
                               <button onClick={() => onFacilitySelect(facility)} className="group flex items-center gap-3 hover:bg-white/50 p-3 rounded-lg transition-colors w-full text-left">
                                   <span className={`flex-shrink-0 w-6 text-center font-semibold text-brand-dark-blue ${responsiveConfig.listFontSize}`}>
                                       {index + 1}.
                                   </span>
                                   <img src={getIconForType(facility.type)} alt={facility.type} className="w-6 h-6 object-contain flex-shrink-0" />
                                   <span className={`flex-grow font-medium group-hover:underline text-brand-dark-blue ${responsiveConfig.listFontSize}`}>
                                       {facility.name}
                                   </span>
                               </button>
                           </li>
                        ))}
                    </ul>
                </div>
                {renderGeoInfo()}
            </div>
        </div>
    );

	const renderMainContent = () => {
		// Kondisi Mobile Portrait
		if (isMobile && !isLandscape) {
			return renderDesktopContent(); // Mobile portrait menggunakan layout desktop dengan footer tetap
		}
		// Kondisi Mobile Landscape
		else if (isLandscape) {
			return renderMobileLandscapeContent(); // Hanya mobile landscape yang geo-info nya ikut scroll
		}
		// Kondisi Desktop & Tablet
		else {
			return renderDesktopContent(); // Desktop & tablet menggunakan layout footer tetap
		}
	};


	return (
		<>
			{isVisible && !isMinimized && (
				<div
					className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
					onClick={onClose}
				/>
			)}
			<div
				className={`fixed right-0 z-50 shadow-2xl transition-all duration-300 ease-in-out ${
					isVisible ? "translate-x-0" : "translate-x-full"
				}`}
				style={{
					top: responsiveConfig.topPosition || "clamp(65px, 9vh, 110px)",
					width: isMinimized ? responsiveConfig.minimizedButtonSize : "33.33vw",
					backgroundColor: isMinimized ? "#2A3A4E" : "#9DB2C8",
					borderRadius: isMinimized ? "50%" : "32px 0 0 32px",
					marginTop: isMinimized ? "20px" : responsiveConfig.marginTop || "clamp(8px, 1vh, 16px)",
					marginRight: isMinimized ? "20px" : "0",
					minWidth: isMinimized ? responsiveConfig.minimizedButtonSize : "280px",
					maxWidth: isMinimized ? responsiveConfig.minimizedButtonSize : "600px",
					aspectRatio: isMinimized ? "1/1" : "auto",
					height: isMinimized ? responsiveConfig.minimizedButtonSize : `calc(100vh - ${responsiveConfig.topPosition || "clamp(65px, 9vh, 110px)"})`,
					flexShrink: isMinimized ? 0 : "auto",
				}}
			>
				{!isMinimized && renderMainContent()}

				{isMinimized && (
					<div className="flex items-center justify-center h-full w-full">
						<button onClick={toggleMinimize} className={`${responsiveConfig.maximizePadding} hover:bg-white/30 rounded-full transition-colors`} title="Maximize">
							<img src={MaximizeIcon} alt="Maximize" className={responsiveConfig.maximizeIconSize} style={{ filter: "brightness(0) invert(1)" }}/>
						</button>
					</div>
				)}
			</div>
		</>
	);
};

export default SidePanel;