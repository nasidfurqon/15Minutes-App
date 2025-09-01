import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";

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
	return iconMap[type] || KesehatanIcon;
};

const FacilityDetailCard = ({ facility, onClose }) => {
	const [isOpen, setIsOpen] = useState(!!facility);
	const [startY, setStartY] = useState(0);
	const [currentY, setCurrentY] = useState(0);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 810);
	const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight && window.innerWidth < 1024);
	const [isLoadingRoute, setIsLoadingRoute] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const sheetRef = useRef(null);

	useEffect(() => {
		setIsOpen(!!facility);
		if (facility) {
			console.log("📋 Facility detail card opened for:", facility.name);
			console.log("📍 Facility position:", facility.position);
			console.log("🏷️ Facility type:", facility.type);
		}
		return () => {
			if (facility) {
				console.log("👋 Facility detail card unmounting for:", facility.name);
			}
		};
	}, [facility]);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			setIsMobile(width <= 767);
			setIsLandscape(width > height && width < 1024);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			console.log("🧹 Cleaning up facility detail card resize listener");
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	if (!facility) {
		console.log("📋 Facility detail card: no facility data");
		return null;
	}

	const { name, type, description, address, opening_hours: openingHours, website, phone, email } = facility;
	const facilityIcon = getIconForType(type);

    console.log("📋 Facility detail card rendering with data:", { name, type, address, openingHours, phone, website, position: facility.position, icon: facilityIcon });

	const displayValue = (value) => value && value !== "N/A" && value.trim() !== "" ? value : "-";

	const formatOpeningHours = (hours) => {
		if (!hours || hours === "N/A") return "-";
		try {
			const parsed = typeof hours === 'string' ? JSON.parse(hours) : hours;
			if (typeof parsed === "object") {
				return Object.entries(parsed).map(([day, time]) => `${day}: ${time}`).join(", ");
			}
			return hours;
		} catch (e) {
			return hours;
		}
	};

	const getUserLocation = () => {
        console.log("📍 Getting user location...");
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
                console.error("❌ Geolocation tidak didukung");
				return reject(new Error("Geolocation tidak didukung"));
            }
            console.log("📍 Requesting geolocation...");
			navigator.geolocation.getCurrentPosition(
				(position) => {
                    console.log("✅ User location obtained:", { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy, });
                    console.log("✅ User location accuracy:", position.coords.accuracy, "meters");
                    resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
				(error) => {
                    console.error("❌ Geolocation error:", error);
                    console.error("❌ Error code:", error.code);
                    console.error("❌ Error message:", error.message);
                    reject(error);
                },
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
			);
		});
	};

	const handleOpenRoute = async () => {
		setIsLoadingRoute(true);
		setErrorMessage(null);
        console.log("🗺️ Opening route to facility:", facility.name);
        console.log("📍 Facility address:", facility.address);
        console.log("📍 Facility type:", facility.type);
		const destination = encodeURIComponent(`${facility.name}, ${facility.address || ""}`);
		try {
			const userLocation = await getUserLocation();
            console.log("📍 User location for route:", userLocation);
			const origin = `${userLocation.lat},${userLocation.lng}`;
            console.log("📍 Route origin (user location):", origin);
            console.log("📍 Route destination (facility):", destination);
			const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
            console.log("🔗 Opening Google Maps URL:", url);
            console.log("✅ Opening route with user location and facility name");
			window.open(url, "_blank");
		} catch (error) {
            console.error("❌ Error getting user location:", error);
			setErrorMessage("Gagal mengambil lokasi Anda. Silakan pastikan GPS Anda aktif.");
            console.log("📍 Fallback route destination (facility):", destination);
			const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
            console.log("🔄 Fallback - Opening Google Maps URL:", url);
            console.log("⚠️ Opening route without user location (fallback)");
			window.open(url, "_blank");
		} finally {
			setIsLoadingRoute(false);
            console.log("✅ Route opening process completed");
		}
	};

	const handleOpenMaps = () => {
        console.log("🗺️ Opening Maps for facility:", facility.name);
        console.log("📍 Facility address:", facility.address);
        console.log("📍 Facility type:", facility.type);
		const searchQuery = encodeURIComponent(`${facility.name}, ${facility.address || ""}`);
		const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        console.log("🔗 Opening Google Maps URL:", url);
        console.log("✅ Opening Maps with facility name and address");
        console.log("✅ Maps opening process completed");
		window.open(url, "_blank");
	};
    
	const handleTouchStart = (e) => setStartY(e.touches[0].clientY);
	const handleTouchMove = (e) => {
		const newY = e.touches[0].clientY;
		setCurrentY(newY);
		const deltaY = newY - startY;
		if (deltaY > 0 && sheetRef.current) {
			sheetRef.current.style.transform = `translateY(${deltaY}px)`;
		}
	};
	const handleTouchEnd = () => {
		const deltaY = currentY - startY;
		if (deltaY > 100) {
            console.log("👋 Facility detail card closed by swipe");
            onClose();
        }
		else if (sheetRef.current) sheetRef.current.style.transform = "";
		setStartY(0);
		setCurrentY(0);
	};

	// Fungsi untuk merender daftar informasi (tampilan mobile)
	const renderInfoList = (iconSize = "w-5 h-5 sm:w-5 sm:h-5", textSize = "text-xs sm:text-sm") => (
		<div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Deskripsi</p><p className={`${textSize} text-gray-800`}>{displayValue(description)}</p></div></div>
			<div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Alamat</p><p className={`${textSize} text-gray-800`}>{displayValue(address)}</p></div></div>
			<div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Jam Operasional</p><p className={`${textSize} text-gray-800`}>{formatOpeningHours(openingHours)}</p></div></div>
			<div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M12 2.25c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9c2.485 0 4.5-4.03 4.5-9s-2.015-9-4.5-9Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Website</p>{website && website !== "N/A" && website.trim() !== "" ? (<a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className={`${textSize} text-blue-600 hover:text-blue-800 underline break-all`}>{website}</a>) : (<p className={`${textSize} text-gray-800`}>-</p>)}</div></div>
			<div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Telepon</p>{phone && phone !== "N/A" && phone.trim() !== "" ? (<a href={`tel:${phone}`} className={`${textSize} text-blue-600 hover:text-blue-800`}>{phone}</a>) : (<p className={`${textSize} text-gray-800`}>-</p>)}</div></div>
			<div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m21.75 0-9-5.25L3 6.75m21.75 0-9 5.25-9-5.25" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Email</p>{email && email !== "N/A" && email.trim() !== "" ? (<a href={`mailto:${email}`} className={`${textSize} text-blue-600 hover:text-blue-800 break-all`}>{email}</a>) : (<p className={`${textSize} text-gray-800`}>-</p>)}</div></div>
		</div>
	);

	// Fungsi untuk merender grid informasi
	const renderInfoGrid = (iconSize = "w-5 h-5", textSize = "text-sm") => (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-4"><div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Deskripsi</p><p className={`${textSize} text-gray-800`}>{displayValue(description)}</p></div></div><div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Alamat</p><p className={`${textSize} text-gray-800`}>{displayValue(address)}</p></div></div><div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Jam Operasional</p><p className={`${textSize} text-gray-800`}>{formatOpeningHours(openingHours)}</p></div></div></div>
			<div className="space-y-4"><div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M12 2.25c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9c2.485 0 4.5-4.03 4.5-9s-2.015-9-4.5-9Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Website</p>{website && website !== "N/A" && website.trim() !== "" ? (<a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className={`${textSize} text-blue-600 hover:text-blue-800 underline break-all`}>{website}</a>) : (<p className={`${textSize} text-gray-800`}>-</p>)}</div></div><div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Telepon</p>{phone && phone !== "N/A" && phone.trim() !== "" ? (<a href={`tel:${phone}`} className={`${textSize} text-blue-600 hover:text-blue-800`}>{phone}</a>) : (<p className={`${textSize} text-gray-800`}>-</p>)}</div></div><div className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSize} text-brand-medium-blue mt-0.5 flex-shrink-0`}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m21.75 0-9-5.25L3 6.75m21.75 0-9 5.25-9-5.25" /></svg><div><p className={`${textSize} font-semibold text-gray-600`}>Email</p>{email && email !== "N/A" && email.trim() !== "" ? (<a href={`mailto:${email}`} className={`${textSize} text-blue-600 hover:text-blue-800 break-all`}>{email}</a>) : (<p className={`${textSize} text-gray-800`}>-</p>)}</div></div></div>
		</div>
	);

	// Tampilan untuk mobile portrait
	const renderMobileContent = () => (
		<div ref={sheetRef} className={clsx("facility-detail-mobile", { open: isOpen })} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
			<div className="facility-detail-content px-6">
				<div className="relative bg-white pt-4 pb-1 mb-2">
					<button onClick={() => { console.log("👋 Facility detail card closed by button (mobile)"); onClose(); }} className="absolute top-0 -right-2 p-1.5 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-dark-blue"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
				</div>
				<div className="flex justify-center mb-3"><p className="text-sm sm:text-base md:text-lg text-brand-dark-blue bg-[#F0EAD6] py-1.5 px-6 rounded-lg font-semibold inline-block font-poppins">Detail Informasi Fasilitas</p></div>
				<div className="flex items-center justify-between mb-4 pt-2"><div className="flex items-center gap-2 sm:gap-3"><img src={facilityIcon} alt={type} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" /><h2 className="text-base sm:text-lg font-bold text-brand-dark-blue">{name}</h2></div></div>
				{renderInfoList()}
				{errorMessage && (<div className="text-red-500 text-xs mt-2">{errorMessage}</div>)}
				<div className="flex gap-2 mt-3 sm:mt-4">
                    <button onClick={handleOpenRoute} disabled={isLoadingRoute} className="flex-1 bg-brand-dark-blue text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoadingRoute ? (<svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>)}
                        {isLoadingRoute ? "Mengambil Lokasi..." : "Rute"}
                    </button>
                    <button onClick={handleOpenMaps} className="flex-1 bg-white border-2 border-brand-dark-blue text-brand-dark-blue py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>Maps</button>
                </div>
			</div>
		</div>
	);

	// Tampilan untuk desktop, tablet, dan mobile landscape
	const renderDesktopAndLandscapeContent = (isLandscapeView = false) => {
        const iconSize = isLandscapeView ? "w-4 h-4" : "w-5 h-5 sm:w-6 sm:h-6";
        const textSize = isLandscapeView ? "text-xs" : "text-sm";
        const titleSize = isLandscapeView ? "text-sm sm:text-base" : "text-base sm:text-lg";
        const containerWidth = isLandscapeView ? "w-full max-w-lg" : "w-[520px] max-w-[95vw]";
        const cardMaxHeight = isLandscapeView ? "max-h-[90vh]" : "max-h-[85vh]";

        return (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 ${containerWidth}`}>
                <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${cardMaxHeight} flex flex-col`}>
                    
                    <div className="relative bg-white pt-4 pb-1 flex-shrink-0">
                        <button onClick={() => { console.log("👋 Facility detail card closed by button (desktop/landscape)"); onClose(); }} className="absolute top-2 right-4 p-1.5 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-dark-blue"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="overflow-y-auto">
                        <div className="flex justify-center mb-3 px-6">
                            <p className="text-sm sm:text-base md:text-lg text-brand-dark-blue bg-[#F0EAD6] py-1.5 px-6 rounded-lg font-semibold inline-block font-poppins">Detail Informasi Fasilitas</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 pt-2 px-6">
                            <img src={facilityIcon} alt={type} className={iconSize} />
                            <h2 className={`${titleSize} font-bold text-brand-dark-blue text-center`}>{name}</h2>
                        </div>

                        <div className="px-6">
                            {renderInfoGrid(iconSize, textSize)}
                            {errorMessage && (<div className="text-red-500 text-xs mt-2">{errorMessage}</div>)}
                        </div>
                        
                        <div className="border-t border-gray-200 bg-white px-6 py-4 mt-4">
                            <div className="flex gap-2 mt-3 sm:mt-4">
                                <button onClick={handleOpenRoute} disabled={isLoadingRoute} className="flex-1 bg-brand-dark-blue text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoadingRoute ? (<svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>)}
                                    {isLoadingRoute ? "Mengambil Lokasi..." : "Rute"}
                                </button>
                                <button onClick={handleOpenMaps} className="flex-1 bg-white border-2 border-brand-dark-blue text-brand-dark-blue py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>Maps</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

	return (
		<>
			{/* Overlay */}
			{!isMobile && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => { console.log("👋 Facility detail card closed by overlay click"); onClose(); }} />
			)}

			{/* Render content based on screen size */}
			{(() => {
                console.log("📱 Rendering facility detail card:", { isMobile, isLandscape, screenWidth: window.innerWidth, screenHeight: window.innerHeight, facilityName: facility.name });
				if (isMobile && !isLandscape) {
					return renderMobileContent();
				} else {
					return renderDesktopAndLandscapeContent(isLandscape);
				}
			})()}
		</>
	);
};

export default FacilityDetailCard;