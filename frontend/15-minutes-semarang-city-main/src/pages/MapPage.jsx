import React, { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import api from "../api";
import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import clsx from "clsx";
import * as turf from "@turf/turf";
import CustomAlert from "../components/ui/CustomAlert";

// Import CSS untuk mobile layout
import "../styles/mobile.css";

// Import komponen & data
import SearchBar from "../components/ui/SearchBar";
import SidePanel from "../components/ui/SidePanel";
import FacilityDetailCard from "../components/ui/FacilityDetailCard";
import FacilityMarker from "../components/map/FacilityMarker";
import MapEvents from "../components/map/MapEvents";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
/*import { dummyGeographicInfo } from "../data/dummyData";*/

// Fix ikon default
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
const userPinIcon = L.icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
	iconSize: [60, 60],
	iconAnchor: [30, 60],
});

// Lokasi Default Simpang Lima
const SIMPANG_LIMA_COORDS = [-6.991, 110.423];

// Batas koordinat kota Semarang (approximate bounding box)
	const SEMARANG_BOUNDS = {
		north: -6.85, // Batas utara
		south: -7.15, // Batas selatan
		east: 110.55, // Batas timur
		west: 110.25, // Batas barat
	};

// Fungsi untuk mengecek apakah koordinat berada dalam batas kota Semarang
const isWithinSemarang = (lat, lng) => {
	return (
		lat >= SEMARANG_BOUNDS.south &&
		lat <= SEMARANG_BOUNDS.north &&
		lng >= SEMARANG_BOUNDS.west &&
		lng <= SEMARANG_BOUNDS.east
	);
};

// Fungsi untuk mendapatkan nama kota dari koordinat menggunakan reverse geocoding
const getCityFromCoordinates = async (lat, lng) => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
		);
		const data = await response.json();

		// Cek berbagai level untuk nama kota
		const city =
			data.address?.city ||
			data.address?.town ||
			data.address?.municipality ||
			data.address?.county ||
			data.address?.state;

		return city || data.display_name;
	} catch (error) {
		console.error("Error getting city name:", error);
		return null;
	}
};

// Fungsi untuk mendeteksi browser
const getBrowserInfo = () => {
	const userAgent = navigator.userAgent;

	if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
		return "Chrome";
	} else if (userAgent.includes("Edg")) {
		return "Edge";
	} else if (userAgent.includes("Firefox")) {
		return "Firefox";
	} else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
		return "Safari";
	} else {
		return "Unknown";
	}
};

// Fungsi untuk menghitung jarak antara dua koordinat (dalam km)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
	const R = 6371; // Radius bumi dalam km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;
	return distance.toFixed(2);
};


import semarangGEOJSON from "../assets/semarang.json";

const coordinates = semarangGEOJSON.features[0].geometry.coordinates;

const semarangLine = coordinates[0][0].map((coord) => [coord[1], coord[0]]);
``
const MapPage = () => {
	const [mapCenter, setMapCenter] = useState(SIMPANG_LIMA_COORDS);
	const [userPin, setUserPin] = useState(null);
	const [showResults, setShowResults] = useState(false);
	const [facilities, setFacilities] = useState([]);
	const [geoInfo, setGeoInfo] = useState({});
	const [selectedFacility, setSelectedFacility] = useState(null);
	const [activeFilter, setActiveFilter] = useState("all");
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 810);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingLocation, setIsLoadingLocation] = useState(false);
	const [isSearchingRegion, setIsSearchingRegion] = useState(false);
	const [error, setError] = useState(null);
	const [locationMessage, setLocationMessage] = useState(null);
	const [polygonCoords, setPolygonCoords] = useState([]);
	const [districtPolygon, setDistrictPolygon] = useState(null);
	const [kelurahanPolygons, setKelurahanPolygons] = useState([]);
	const [isLandscape, setIsLandscape] = useState(
		window.innerWidth > window.innerHeight
	);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const mapRef = useRef(null);

	const [maximizeConfig, setMaximizeConfig] = useState({
		// buttonSize: "w-12 h-12",
		iconSize: "w-6 h-6",
		buttonPadding: "p-3",
		bottomPosition: "bottom-6",
		rightPosition: "right-6",
		buttonWidth: "40px",
		buttonHeight: "40px",
	});

	// Tambahkan state untuk button styling
	const [buttonConfig, setButtonConfig] = useState({
		fontSize: "text-base",
		padding: "py-4 px-6",
		iconSize: "w-6 h-6",
		buttonWidth: "48px", // ← TAMBAH INI
		buttonHeight: "48px", // ← TAMBAH INI
		height: "60px", // <-- Perbaikan
		width: "300px",
		gap: "gap-3",
		containerStyle: "flex-col gap-3",
	});

	// Tambahkan state untuk header style
	const [headerStyle, setHeaderStyle] = useState({
		fontSize: "clamp(14px, 2vw, 24px)",
		wordBreak: "break-word",
		whiteSpace: "normal",
	});

	useEffect(() => {
		const handleMaximizeResize = () => {
			const width = window.innerWidth;

			if (width <= 375) {
				// 📱 Mobile Small - Tombol BESAR (layar kecil butuh tombol besar)
				setMaximizeConfig({
					iconSize: "w-7 h-7",
					buttonPadding: "p-4",
					buttonWidth: "56px",
					buttonHeight: "56px",
					bottomPosition: "bottom-[calc(env(safe-area-inset-bottom,0px)+60px)]",
					rightPosition: "right-4",
				});
			} else if (width <= 414) {
				// 📱 Mobile Medium - Sedikit lebih kecil
				setMaximizeConfig({
					iconSize: "w-6 h-6",
					buttonPadding: "p-3.5",
					buttonWidth: "48px",
					buttonHeight: "48px",
					bottomPosition: "bottom-[calc(env(safe-area-inset-bottom,0px)+60px)]",
					rightPosition: "right-4",
				});
			} else if (width <= 440) {
				// 📱 Mobile Large - Ukuran sedang
				setMaximizeConfig({
					iconSize: "w-6 h-6",
					buttonPadding: "p-3",
					buttonWidth: "44px",
					buttonHeight: "44px",
					bottomPosition: "bottom-[calc(env(safe-area-inset-bottom,0px)+60px)]",
					rightPosition: "right-5",
				});
			} else if (width <= 884) {
				// 📊 Tablets - Lebih kecil
				setMaximizeConfig({
					iconSize: "w-5 h-5",
					buttonPadding: "p-3",
					buttonWidth: "40px",
					buttonHeight: "40px",
					bottomPosition: "bottom-[calc(env(safe-area-inset-bottom,0px)+60px)]",
					rightPosition: "right-5",
				});
			} else if (width >= 1280) {
				// 💻 Laptops - Tombol KECIL (layar besar butuh tombol kecil)
				setMaximizeConfig({
					iconSize: "w-5 h-5",
					buttonPadding: "p-2.5",
					buttonWidth: "36px",
					buttonHeight: "36px",
					bottomPosition: "bottom-6",
					rightPosition: "right-6",
				});
			} else {
				// Default untuk ukuran diantara tablet dan laptop (885px-1279px)
				setMaximizeConfig({
					iconSize: "w-5 h-5",
					buttonPadding: "p-3",
					buttonWidth: "40px",
					buttonHeight: "40px",
					bottomPosition: "bottom-6",
					rightPosition: "right-6",
				});
			}
		};

		handleMaximizeResize();
		window.addEventListener("resize", handleMaximizeResize);
		return () => window.removeEventListener("resize", handleMaximizeResize);
	}, []);

	// Tambahkan useEffect untuk mengatur font size header
	useEffect(() => {
		const handleHeaderResize = () => {
			const width = window.innerWidth;

			if (width <= 375) {
				// 📱 Mobile Small
				setHeaderStyle({
					fontSize: "clamp(14px, 1.5vw, 18px)",
					wordBreak: "break-word",
				});
			} else if (width <= 414) {
				// 📱 Mobile Medium
				setHeaderStyle({
					fontSize: "clamp(15px, 1.6vw, 19px)",
					wordBreak: "break-word",
				});
			} else if (width <= 440) {
				// 📱 Mobile Large
				setHeaderStyle({
					fontSize: "clamp(16px, 1.7vw, 20px)",
					wordBreak: "break-word",
				});
			} else if (width <= 884) {
				// 📊 Tablets
				setHeaderStyle({
					fontSize: "clamp(20px, 2vw, 24px)",
					wordBreak: "normal",
					whiteSpace: "nowrap",
				});
			} else if (width >= 1280) {
				// 💻 Laptops
				setHeaderStyle({
					fontSize: "clamp(20px, 2vw, 24px)",
					wordBreak: "normal",
					whiteSpace: "nowrap",
				});
			} else {
				// Default untuk ukuran diantara tablet dan laptop (885px-1279px)
				setHeaderStyle({
					fontSize: "clamp(20px, 2vw, 24px)",
					wordBreak: "normal",
					whiteSpace: "nowrap",
				});
			}
		};

		handleHeaderResize();
		window.addEventListener("resize", handleHeaderResize);
		return () => window.removeEventListener("resize", handleHeaderResize);
	}, []);

	// Tambahkan useEffect untuk button styling
	useEffect(() => {
		const handleButtonResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const currentIsLandscape = width > height;

			let newConfig;

			// UPDATE STATE LANDSCAPE DAN MOBILE
			setIsLandscape(currentIsLandscape);
			setIsMobile(width <= 810);

			if (currentIsLandscape && width <= 1024) {
				// Landscape mobile styling
				newConfig = {
					fontSize: "clamp(14px, 1.8vw, 16px)",
					padding: "py-2 px-3",
					iconSize: "w-5 h-5",
					height: "40px",
					width: "220px",
					gap: "gap-2",
					containerStyle: "flex-row justify-center items-center gap-4",
				};
				setButtonConfig(newConfig);
			} else if (width <= 375) {
				// Keep existing mobile styles
				newConfig = {
					fontSize: "text-[16px]",
					padding: "py-2 px-3",
					iconSize: "w-6 h-6",
					height: "45px",
					width: "70vw",
					gap: "gap-1.5",
					containerStyle: "flex-col gap-3",
				};
				setButtonConfig(newConfig);
			} else if (width <= 414) {
				// Keep existing mobile styles
				newConfig = {
					fontSize: "text-[18px]",
					padding: "py-2 px-3",
					iconSize: "w-7 h-7",
					height: "42px",
					width: "70vw",
					gap: "gap-1.5",
					containerStyle: "flex-col gap-3",
				};
				setButtonConfig(newConfig);
			} else {
				// Keep existing desktop styles
				newConfig = {
					fontSize: "text-base",
					padding: "py-4 px-6",
					iconSize: "w-6 h-6",
					height: "60px",
					width: "320px",
					gap: "gap-3",
					containerStyle: "flex-col gap-3",
				};
				setButtonConfig(newConfig);
			}
		};

		handleButtonResize();
		window.addEventListener("resize", handleButtonResize);
		return () => window.removeEventListener("resize", handleButtonResize);
	}, []);

	// Auto-hide location message after 5 seconds
	useEffect(() => {
		if (locationMessage) {
			const timer = setTimeout(() => {
				setLocationMessage(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [locationMessage]);

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
			}, 4000); // ← 4 detik untuk error search

			return () => clearTimeout(timer);
		}
	}, [error]);

	const filteredFacilities = useMemo(() => {
		if (activeFilter === "all") {
			return facilities;
		}
		return facilities.filter((facility) => facility.type === activeFilter);
	}, [activeFilter, facilities]);

	const formatFacilities = (data) => {
		console.log("Raw data from backend:", data); // Debug log
		const formatted = data.map((facility) => ({
			id: facility.id,
			name: facility.name,
			type: facility.category_name, // Ambil dari backend
			position: [facility.lat, facility.lng],
			address: facility.description,
		}));
		console.log("Formatted facilities:", formatted); // Debug log
		return formatted;
	};

	const handleMapClick = (latlng) => {
		if (showResults) return;
		setUserPin(latlng);
		setSelectedFacility(null);
	};

	const handleUseMyLocation = () => {
		setIsLoadingLocation(true);
		setError(null);
		setLocationMessage(null);

		console.log("🌐 Browser:", getBrowserInfo());
		console.log("🌐 User Agent:", navigator.userAgent);
		console.log("🌐 Geolocation supported:", !!navigator.geolocation);
		console.log("🌐 Permissions API supported:", !!navigator.permissions);

		// Cek apakah geolocation tersedia
		if (!navigator.geolocation) {
			setLocationMessage({
				type: "error",
				title: "Geolokasi Tidak Didukung",
				message:
					"Browser Anda tidak mendukung geolokasi. Silakan gunakan browser yang lebih baru atau tandai lokasi secara manual di peta.",
				showMap: false,
			});
			setIsLoadingLocation(false);
			return;
		}

		// Cek izin lokasi terlebih dahulu
		if (navigator.permissions) {
			navigator.permissions
				.query({ name: "geolocation" })
				.then((permissionStatus) => {
					console.log("🔐 Permission status:", permissionStatus.state);

					if (permissionStatus.state === "denied") {
						console.log("❌ Location permission denied");
						setLocationMessage({
							type: "error",
							title: "Akses Lokasi Ditolak",
							message:
								"Akses lokasi ditolak oleh browser. Silakan ikuti langkah berikut untuk mengizinkan akses lokasi:",
							showMap: false,
							showInstructions: true,
						});
						setIsLoadingLocation(false);
						console.log("⚠️ User location set but outside Semarang bounds");
						console.log("⚠️ User location is outside Semarang bounds");
						console.log(
							"⚠️ User location process completed but outside bounds"
						);
						return;
					}

					console.log("✅ Permission granted or prompt, proceeding...");
					// Jika izin granted atau prompt, lanjutkan dengan getCurrentPosition
					getUserLocation();
				})
				.catch((error) => {
					console.log("⚠️ Permissions API error:", error);
					// Fallback jika permissions API tidak tersedia
					getUserLocation();
				});
		} else {
			console.log("⚠️ Permissions API not supported, proceeding directly...");
			// Fallback untuk browser yang tidak mendukung permissions API
			getUserLocation();
		}

		function getUserLocation() {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const myLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};

					console.log("📍 Lokasi user:", myLocation);
					console.log("📍 Akurasi:", position.coords.accuracy, "meter");
					console.log(
						"📍 Timestamp:",
						new Date(position.timestamp).toLocaleString()
					);
					console.log("📍 Altitude:", position.coords.altitude);
					console.log("📍 Heading:", position.coords.heading);
					console.log("📍 Speed:", position.coords.speed);
					console.log(
						"📍 Within Semarang bounds:",
						isWithinSemarang(myLocation.lat, myLocation.lng)
					);
					console.log(
						"📍 Detected coordinates:",
						`${myLocation.lat}, ${myLocation.lng}`
					);
					console.log(
						"📍 Expected coordinates (Randublatung): -7.192993, 111.341835"
					);
					console.log(
						"📍 Distance from expected location:",
						calculateDistance(
							myLocation.lat,
							myLocation.lng,
							-7.192993,
							111.341835
						),
						"km"
					);

					// Cek akurasi lokasi
					const distanceFromExpected = calculateDistance(
						myLocation.lat,
						myLocation.lng,
						-7.192993,
						111.341835
					);
					console.log(
						"📍 Distance from expected location:",
						distanceFromExpected,
						"km"
					);

					if (position.coords.accuracy > 1000) {
						console.log(
							"⚠️ Low accuracy location:",
							position.coords.accuracy,
							"meters"
						);
						setLocationMessage({
							type: "warning",
							title: "Akurasi Lokasi Rendah",
							message: `Akurasi lokasi Anda adalah ${Math.round(
								position.coords.accuracy
							)} meter. Hasil mungkin tidak akurat. Pastikan GPS aktif dan berada di area terbuka.`,
							showMap: false,
							showAccuracyInfo: true,
							accuracy: position.coords.accuracy,
						});
					} else if (distanceFromExpected > 10) {
						console.log(
							"⚠️ Location seems inaccurate - far from expected location:",
							distanceFromExpected,
							"km from expected"
						);
						console.log(
							"⚠️ Expected: Randublatung, Blora (-7.192993, 111.341835)"
						);
						console.log("⚠️ Detected:", `${myLocation.lat}, ${myLocation.lng}`);
						setLocationMessage({
							type: "warning",
							title: "Lokasi Mungkin Tidak Akurat",
							message: `Lokasi terdeteksi ${distanceFromExpected} km dari lokasi yang diharapkan (Randublatung, Blora). GPS mungkin tidak akurat. Silakan gunakan lokasi manual di peta jika diperlukan.`,
							showMap: false,
							showAccuracyInfo: true,
							accuracy: position.coords.accuracy,
							showManualLocationOption: true,
						});
					} else {
						console.log(
							"✅ Good accuracy location:",
							position.coords.accuracy,
							"meters"
						);
						console.log(
							"✅ Location is within reasonable distance from expected"
						);
					}

					// Cek apakah berada dalam batas Semarang
					if (!isWithinSemarang(myLocation.lat, myLocation.lng)) {
						console.log("⚠️ Location outside Semarang bounds");
						// Coba dapatkan nama kota untuk pesan yang lebih informatif
						const cityName = await getCityFromCoordinates(
							myLocation.lat,
							myLocation.lng
						);

						console.log("🌍 Detected city:", cityName);

						const message = cityName
							? `Lokasi Anda terdeteksi di ${cityName}. Aplikasi ini hanya tersedia untuk kota Semarang. Silakan cari fasilitas publik di Semarang atau gunakan lokasi manual di peta.`
							: "Lokasi Anda berada di luar kota Semarang. Aplikasi ini hanya tersedia untuk kota Semarang. Silakan cari fasilitas publik di Semarang dengan menandai lokasi di peta.";

						setLocationMessage({
							type: "warning",
							title: "Lokasi Di Luar Semarang",
							message: message,
							showMap: true,
							showCoordinates: true,
							coordinates: myLocation,
						});

						// Tetap tampilkan lokasi user di peta tapi dengan pesan
						setMapCenter([myLocation.lat, myLocation.lng]);
						setUserPin(myLocation);
						setSelectedFacility(null);

						if (mapRef.current) {
							setTimeout(() => {
								mapRef.current.flyTo([myLocation.lat, myLocation.lng], 12);
							}, 100);
						}
						setIsLoadingLocation(false);
						return;
					}

					// Jika berada di Semarang, lanjutkan seperti biasa
					console.log("✅ Location within Semarang bounds");
					setLocationMessage({
						type: "success",
						title: "Lokasi Ditemukan",
						message:
							"Lokasi Anda berada di Semarang. Silakan cari fasilitas publik di sekitar Anda.",
						showMap: false,
						showCoordinates: true,
						coordinates: myLocation,
					});

					setMapCenter([myLocation.lat, myLocation.lng]);
					setUserPin(myLocation);
					setSelectedFacility(null);

					if (mapRef.current) {
						setTimeout(() => {
							mapRef.current.flyTo([myLocation.lat, myLocation.lng], 16);
						}, 100);
					}
					setIsLoadingLocation(false);
					console.log("✅ Location successfully set on map");
					console.log("✅ Geolocation process completed");
					console.log("✅ User location process finished successfully");
					console.log("✅ User location is within Semarang bounds");
					console.log("✅ User location process completed successfully");
					console.log(
						"✅ Final location coordinates:",
						`${myLocation.lat}, ${myLocation.lng}`
					);
				},
				(error) => {
					console.error("❌ Error getting location:", error);
					console.error("❌ Error code:", error.code);
					console.error("❌ Error message:", error.message);

					let errorMessage = "Gagal mendapatkan lokasi Anda.";
					let errorTitle = "Error Lokasi";
					let showInstructions = false;

					switch (error.code) {
						case error.PERMISSION_DENIED:
							errorTitle = "Akses Lokasi Ditolak";
							errorMessage =
								"Akses lokasi ditolak oleh browser. Silakan ikuti langkah berikut untuk mengizinkan akses lokasi:";
							showInstructions = true;
							break;
						case error.POSITION_UNAVAILABLE:
							errorTitle = "Lokasi Tidak Tersedia";
							errorMessage =
								"Informasi lokasi tidak tersedia. Pastikan GPS aktif dan Anda berada di area dengan sinyal yang baik.";
							break;
						case error.TIMEOUT:
							errorTitle = "Waktu Habis";
							errorMessage =
								"Waktu permintaan lokasi habis. Silakan coba lagi atau gunakan lokasi manual di peta.";
							break;
						default:
							errorTitle = "Error Lokasi";
							errorMessage =
								"Terjadi kesalahan saat mendapatkan lokasi. Silakan coba lagi atau gunakan lokasi manual di peta.";
					}

					setLocationMessage({
						type: "error",
						title: errorTitle,
						message: errorMessage,
						showMap: false,
						showInstructions: showInstructions,
					});

					// Fallback ke Simpang Lima jika gagal mendapatkan lokasi
					console.log("🔄 Falling back to default location (Simpang Lima)");
					const defaultLocation = {
						lat: SIMPANG_LIMA_COORDS[0],
						lng: SIMPANG_LIMA_COORDS[1],
					};
					setMapCenter(SIMPANG_LIMA_COORDS);
					setUserPin(defaultLocation);
					setSelectedFacility(null);

					if (mapRef.current) {
						setTimeout(() => {
							mapRef.current.flyTo(SIMPANG_LIMA_COORDS, 16);
						}, 100);
					}
					setIsLoadingLocation(false);
					console.log("❌ Geolocation process failed");
				},
				{
					enableHighAccuracy: true,
					timeout: 15000, // Tambah timeout menjadi 15 detik
					maximumAge: 30000, // Kurangi maximum age untuk akurasi yang lebih baik
				}
			);
			console.log("🔄 Geolocation request started with 15s timeout");
		}
	};

	const handleCheckFacilities = async () => {
		if (!userPin) {
			setAlertMessage(
				"Silakan tandai lokasi di peta atau gunakan lokasi Anda terlebih dahulu."
			);
			setIsAlertOpen(true);
			return;
		}

		console.log("🚀 Mulai proses pencarian fasilitas...");
		setIsLoading(true);
		setError(null);
		setPolygonCoords([]);
		setFacilities([]); // Reset fasilitas sebelumnya

		try {
			const { lat, lng } = userPin;
			console.log(`📍 Lokasi dipilih: ${lat}, ${lng}`);

			// Coba ambil informasi wilayah terlebih dahulu
			try {
				const regionResponse = await api.post("/region-info", { lat, lng });
				setGeoInfo({
					populationDensity: `${regionResponse.data.population_density} /km²`,
					kecamatan: regionResponse.data.kecamatan,
					kelurahan: regionResponse.data.kelurahan,
					population_percentage: `${regionResponse.data.population_percentage} %`,
				});
				console.log(
					"✅ [Baru] Informasi wilayah diterima:",
					regionResponse.data
				);
			} catch (regionError) {
				console.error(
					"⚠️ Tidak dapat mengambil info wilayah:",
					regionError.response?.data?.message || regionError.message
				);

				// JIKA LOKASI DI LUAR JANGKAUAN, TAMPILKAN ALERT DAN HENTIKAN PROSES
				if (regionError.response?.status === 404) {
					setAlertMessage(
						"Lokasi yang Anda pilih berada di luar area layanan Kota Semarang. Silakan pilih titik di dalam area Semarang."
					);
					setIsAlertOpen(true);
					setIsLoading(false); // Hentikan loading
					return; // Hentikan eksekusi fungsi
				}

				// Untuk error lainnya, set ke N/A dan lanjutkan
				setGeoInfo({
					populationDensity: "N/A",
					kecamatan: "Di luar area",
					kelurahan: "Di luar area",
					population_percentage: "N/A",
				});
			}

			// Lanjutkan proses pencarian fasilitas jika lokasi valid
			console.log("🔍 [1/5] Mengecek cache di database...");
			// ... sisa kode di dalam fungsi ini tetap sama ...
			const checkResult = await api.post("/walkability-zones/check", {
				lat,
				lng,
			});
			console.log("🔍 [2/5] Respons dari DB:", checkResult.data);

			if (checkResult.data.exists && checkResult.data.zone_polygon) {
				const polygon = checkResult.data.zone_polygon.coordinates[0].map(
					([lng, lat]) => [lat, lng]
				);
				setPolygonCoords(polygon);
				console.log("✅ [3/5] Polygon dari DB akan ditampilkan.");

				console.log("📦 [4/5] Mengambil fasilitas dari zona yang ada...");
				const servicesResponse = await api.get(
					`/services/in-zone/${checkResult.data.search_id}`
				);
				setFacilities(formatFacilities(servicesResponse.data));
				console.log(
					`📦 [5/5] Ditemukan ${servicesResponse.data.length} fasilitas.`
				);
			} else {
				console.log("🔄 [3/5] Tidak ada data di DB, mengambil dari ORS...");
				if (!import.meta.env.VITE_ORS_API_KEY) {
					throw new Error(
						"ORS API Key tidak ditemukan. Pastikan ada di file .env"
					);
				}

				const orsResponse = await axios.post(
					"https://api.openrouteservice.org/v2/isochrones/foot-walking",
					{ locations: [[lng, lat]], range: [900], attributes: ["area"] },
					{
						headers: {
							Authorization: import.meta.env.VITE_ORS_API_KEY,
							"Content-Type": "application/json",
						},
					}
				);
				console.log("🌐 [4/5] Respons dari ORS diterima.");

				const newCoords =
					orsResponse.data.features[0].geometry.coordinates[0].map(
						([lng, lat]) => [lat, lng]
					);
				setPolygonCoords(newCoords);

				console.log("💾 [5/5] Menyimpan data baru ke backend...");
				const searchResponse = await api.post("/user-searches", { lat, lng });
				const searchId = searchResponse.data.id;
				console.log("💾 -> ID Pencarian baru:", searchId);

				if (searchId) {
					const geojson = {
						type: "Polygon",
						coordinates: [newCoords.map(([lat, lng]) => [lng, lat])],
					};
					await api.post("/walkability-zones", {
						search_id: searchId,
						polygon: geojson,
						zone_type: "walking",
						travel_time: 15,
					});
					console.log("💾 -> Polygon berhasil disimpan.");

					const servicesResponse = await api.get(
						`/services/in-zone/${searchId}`
					);
					setFacilities(formatFacilities(servicesResponse.data));
					console.log(
						`📦 Ditemukan ${servicesResponse.data.length} fasilitas dari data baru.`
					);
				}
			}
			setShowResults(true);
			console.log("✅ Proses selesai!");
		} catch (err) {
			console.error("❌ Terjadi Error:", {
				message: err.message,
				response: err.response?.data,
				status: err.response?.status,
				config: err.config,
			});

			let errorMessage = "Gagal memproses data";

			if (
				err.code === "NETWORK_ERROR" ||
				err.message.includes("Network Error")
			) {
				errorMessage =
					"Network Error: Pastikan backend Laravel berjalan dan dapat diakses dari network.";
			} else if (err.response?.status === 404) {
				errorMessage =
					"API endpoint tidak ditemukan. Pastikan backend Laravel berjalan.";
			} else if (err.response?.status === 500) {
				errorMessage = "Server error. Periksa log Laravel backend.";
			} else {
				errorMessage = `${err.response?.data?.message || err.message}`;
			}

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFacilitySelect = (facility) => {
		setSelectedFacility(facility);
		setMapCenter(facility.position);
	};

	const resetView = () => {
		setShowResults(false);
		setSelectedFacility(null);
		setActiveFilter("all");
		setFacilities([]);
		setPolygonCoords([]);
	};

	const handleSearch = async (query) => {
		if (!query) return;

		setIsSearchingRegion(true);
		setError(null);
		setDistrictPolygon(null);
		setKelurahanPolygons([]);

		let districtFound = false;

		// --- PRIORITAS 1: MENCARI KECAMATAN ---
		try {
			// Log URL yang akan dipanggil untuk Kecamatan
			console.log(
				`[DEBUG] Mencoba memanggil API Kecamatan: /districts/${query}`
			);
			const districtResponse = await api.get(`/districts/${query}`);
			console.log(
				"[DEBUG] Panggilan API Kecamatan berhasil.",
				districtResponse
			);

			if (districtResponse.data && districtResponse.data.polygon) {
				districtFound = true;
				const districtData = districtResponse.data;

				let districtCoords;
				if (districtData.polygon.type === "MultiPolygon") {
					districtCoords = districtData.polygon.coordinates[0][0].map(
						([lng, lat]) => {
							return [lat, lng]; // Flip ke [lat, lng] untuk Leaflet
						}
					);
				} else {
					districtCoords = districtData.polygon.coordinates[0].map(
						([lng, lat]) => {
							return [lat, lng]; // Flip ke [lat, lng] untuk Leaflet
						}
					);
				}
				setDistrictPolygon(districtCoords);

				const geoJsonPolygon = turf.polygon([
					districtCoords.map(([lat, lng]) => [lng, lat]),
				]);
				const centroid = turf.centroid(geoJsonPolygon);
				const centerPoint = {
					lat: centroid.geometry.coordinates[1],
					lng: centroid.geometry.coordinates[0],
				};

				console.log("[DEBUG] District centroid:", centerPoint);
				setUserPin(centerPoint);
				setMapCenter([centerPoint.lat, centerPoint.lng]);

				const kelurahanCoords = districtData.kelurahans.map((k, index) => {
					let coords;
					if (k.polygon.type === "MultiPolygon") {
						const outerRing = k.polygon.coordinates[0][0];
						coords = outerRing.map(([lng, lat]) => {
							return [lat, lng]; // Flip ke [lat, lng] untuk Leaflet
						});
					} else {
						coords = k.polygon.coordinates[0].map(([lng, lat]) => {
							return [lat, lng]; // Flip ke [lat, lng] untuk Leaflet
						});
					}

					return coords;
				});

				setKelurahanPolygons(kelurahanCoords);

				if (mapRef.current) {
					const bounds = L.latLngBounds(districtCoords);
					mapRef.current.flyToBounds(bounds);
				}
			}
		} catch (error) {
			// Log error yang terjadi
			console.error("[DEBUG] Error saat mencari Kecamatan:", error);

			if (error.response && error.response.status === 404) {
				console.log(
					`[DEBUG] Kecamatan "${query}" tidak ditemukan (404), melanjutkan ke pencarian kelurahan...`
				);
			} else {
				setError("Terjadi kesalahan pada server saat mencari kecamatan.");
				setIsSearchingRegion(false);
				return;
			}
		}

		if (districtFound) {
			console.log("[DEBUG] Kecamatan ditemukan, proses pencarian dihentikan.");
			setIsSearchingRegion(false);
			return;
		}

		// --- PRIORITAS 2: MENCARI KELURAHAN ---
		try {
			const kelurahanResponse = await api.get(`/kelurahans/${query}`);

			if (kelurahanResponse.data && kelurahanResponse.data.polygon) {
				let kelurahanCoords;
				if (kelurahanResponse.data.polygon.type === "MultiPolygon") {
					kelurahanCoords =
						kelurahanResponse.data.polygon.coordinates[0][0].map(
							([lng, lat]) => {
								return [lat, lng]; // Flip ke [lat, lng] untuk Leaflet
							}
						);
				} else {
					kelurahanCoords = kelurahanResponse.data.polygon.coordinates[0].map(
						([lng, lat]) => {
							return [lat, lng]; // Flip ke [lat, lng] untuk Leaflet
						}
					);
				}

				setKelurahanPolygons([kelurahanCoords]);
				setDistrictPolygon(null);

				const geoJsonPolygon = turf.polygon([
					kelurahanCoords.map(([lat, lng]) => [lng, lat]),
				]);
				const centroid = turf.centroid(geoJsonPolygon);
				const centerPoint = {
					lat: centroid.geometry.coordinates[1],
					lng: centroid.geometry.coordinates[0],
				};

				console.log("[DEBUG] Kelurahan centroid:", centerPoint);
				setUserPin(centerPoint);
				setMapCenter([centerPoint.lat, centerPoint.lng]);

				if (mapRef.current) {
					const bounds = L.latLngBounds(kelurahanCoords);
					mapRef.current.flyToBounds(bounds);
				}
			}
		} catch (error) {
			console.error("[DEBUG] Error saat mencari Kelurahan:", error);
			setError(
				"Kecamatan/Kelurahan tidak valid, pastikan memasukan yang ada di Kota Semarang"
			);
		} finally {
			setIsSearchingRegion(false);
		}
	};

	const generateRandomKelurahanColor = () => {
		let hue, saturation, lightness;
		do {
			// Generate HSL random
			hue = Math.floor(Math.random() * 360);
			saturation = Math.floor(Math.random() * 40) + 60; // 60-100% untuk warna yang vibrant
			lightness = Math.floor(Math.random() * 20) + 45; // 45-65% untuk tidak terlalu terang/gelap
		} while (
			// Hindari range merah (340-20 derajat)
			hue >= 340 ||
			hue <= 20 ||
			// Hindari range merah muda/pink (300-340 derajat)
			(hue >= 300 && hue <= 340) ||
			// Hindari range hijau (80-160 derajat)
			(hue >= 80 && hue <= 160) ||
			// Hindari lightness tinggi yang mendekati putih (> 70%)
			lightness > 70 ||
			// Hindari saturation rendah yang mendekati abu-abu/putih (< 50%)
			saturation < 50
		);

		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	};

	return (
		<div className="h-screen w-screen flex flex-col font-sans">
			<header
				className="mappage-header relative shadow-md z-30 flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12"
				style={{
					backgroundColor: "#213448",
					height: "clamp(65px, 9vh, 110px)",
					boxSizing: "border-box",
				}}
			>
				<div
					className="w-full flex items-center justify-between"
					style={{ gap: "clamp(16px, 2.78vw, 40px)" }}
				>
					<h1
						className="font-bold flex items-center font-poppins flex-shrink-0"
						style={{
							fontWeight: "700",
							color: "#ECEFCA",
							lineHeight: "1",
							fontSize: headerStyle.fontSize,
							width: "clamp(240px, 15vw, 400px)",
							wordBreak: headerStyle.wordBreak,
							whiteSpace: headerStyle.whiteSpace,
						}}
					>
						15 Minute's Semarang City
					</h1>

					<div
						className="flex-shrink-0"
						style={{
							width: "clamp(200px, 52.78vw, 760px)",
							maxWidth: "760px",
							minWidth: "200px",
						}}
					>
						<SearchBar
							onSearch={handleSearch}
							onClear={() => {
								setDistrictPolygon(null);
								setKelurahanPolygons([]);
							}}
						/>
					</div>
				</div>
			</header>

			<main className="relative flex-grow">
				<CustomAlert
					isOpen={isAlertOpen}
					onClose={() => setIsAlertOpen(false)}
					title="Pilih Lokasi"
				>
					{alertMessage}
				</CustomAlert>
				{isLoading && (
					<div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
						<div className="flex flex-col items-center gap-4">
							<div className="w-24 h-24">
								<DotLottieReact
									src="https://lottie.host/0e9cf3ae-c8a4-45d7-98c7-91a6299984f4/LeOjdk2d4g.lottie"
									loop
									autoplay
								/>
							</div>
							<p className="text-white text-xl font-bold">
								Mencari Fasilitas...
							</p>
						</div>
					</div>
				)}
				{isSearchingRegion && (
					<div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
						<div className="flex flex-col items-center gap-4">
							<div className="w-24 h-24">
								<DotLottieReact
									src="https://lottie.host/0e9cf3ae-c8a4-45d7-98c7-91a6299984f4/LeOjdk2d4g.lottie"
									loop
									autoplay
								/>
							</div>
							<p className="text-white text-xl font-bold">Mencari Wilayah...</p>
						</div>
					</div>
				)}
				{error && (
					<div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg z-50 shadow-lg">
						<p>{error}</p>
					</div>
				)}
				{locationMessage && (
					<div
						className={`absolute top-20 left-1/2 -translate-x-1/2 p-4 rounded-lg z-50 shadow-lg max-w-md ${
							locationMessage.type === "warning"
								? "bg-yellow-500 text-white"
								: locationMessage.type === "error"
								? "bg-red-500 text-white"
								: "bg-green-500 text-white"
						}`}
					>
						<div className="flex items-start gap-3">
							<div className="flex-shrink-0">
								{locationMessage.type === "warning" ? (
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								) : locationMessage.type === "error" ? (
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-sm">
									{locationMessage.title}
								</h3>
								<p className="text-sm mt-1">{locationMessage.message}</p>
								{locationMessage.showMap && (
									<p className="text-xs mt-2 opacity-90">
										Peta akan menampilkan lokasi Anda. Anda dapat mencari
										fasilitas di Semarang dengan menandai lokasi di peta.
									</p>
								)}
								{locationMessage.showCoordinates && (
									<div className="mt-3 p-3 bg-green-600 bg-opacity-30 rounded-lg">
										<h4 className="font-semibold text-sm mb-2">
											Koordinat Lokasi Anda:
										</h4>
										<div className="text-xs space-y-1 font-mono">
											<p>
												Latitude: {locationMessage.coordinates.lat.toFixed(6)}
											</p>
											<p>
												Longitude: {locationMessage.coordinates.lng.toFixed(6)}
											</p>
										</div>
									</div>
								)}
								{locationMessage.showAccuracyInfo && (
									<div className="mt-3 p-3 bg-yellow-600 bg-opacity-30 rounded-lg">
										<h4 className="font-semibold text-sm mb-2">
											Tips Meningkatkan Akurasi:
										</h4>
										<div className="text-xs space-y-1">
											<p>• Pastikan GPS aktif di perangkat</p>
											<p>• Berada di area terbuka (tidak di dalam gedung)</p>
											<p>
												• Tunggu beberapa detik untuk akurasi yang lebih baik
											</p>
											<p>• Coba refresh halaman jika akurasi masih rendah</p>
										</div>
									</div>
								)}
								{locationMessage.showManualLocationOption && (
									<div className="mt-3 p-3 bg-blue-600 bg-opacity-30 rounded-lg">
										<h4 className="font-semibold text-sm mb-2">
											Opsi Lokasi Manual:
										</h4>
										<div className="text-xs space-y-1">
											<p>• Klik di peta untuk menandai lokasi yang benar</p>
											<p>• Gunakan search bar untuk mencari alamat</p>
											<p>
												• Atau gunakan lokasi terdeteksi jika sudah cukup akurat
											</p>
										</div>
									</div>
								)}
								{locationMessage.showInstructions && (
									<div className="mt-3 p-3 bg-black bg-opacity-30 rounded-lg">
										<h4 className="font-semibold text-sm mb-2">
											Cara Mengizinkan Akses Lokasi:
										</h4>
										<div className="text-xs space-y-1">
											{(() => {
												const browser = getBrowserInfo();
												switch (browser) {
													case "Chrome":
													case "Edge":
														return (
															<>
																<p>
																	<strong>Chrome/Edge:</strong>
																</p>
																<p>1. Klik ikon 🔒 di address bar</p>
																<p>2. Pilih "Allow" untuk lokasi</p>
																<p>3. Refresh halaman</p>
															</>
														);
													case "Firefox":
														return (
															<>
																<p>
																	<strong>Firefox:</strong>
																</p>
																<p>1. Klik ikon 🛡️ di address bar</p>
																<p>2. Pilih "Allow" untuk lokasi</p>
																<p>3. Refresh halaman</p>
															</>
														);
													case "Safari":
														return (
															<>
																<p>
																	<strong>Safari:</strong>
																</p>
																<p>1. Safari → Preferences → Privacy</p>
																<p>2. Pilih "Allow" untuk lokasi</p>
																<p>3. Refresh halaman</p>
															</>
														);
													default:
														return (
															<>
																<p>
																	<strong>Browser Umum:</strong>
																</p>
																<p>1. Cari ikon 🔒 atau 🛡️ di address bar</p>
																<p>2. Pilih "Allow" untuk lokasi</p>
																<p>3. Refresh halaman</p>
															</>
														);
												}
											})()}
										</div>
										<button
											onClick={() => {
												setLocationMessage(null);
												setTimeout(() => handleUseMyLocation(), 500);
											}}
											className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors duration-200"
										>
											Coba Lagi Setelah Mengatur Izin
										</button>
									</div>
								)}
								{locationMessage.showMap && (
									<div className="mt-3 p-3 bg-blue-600 bg-opacity-30 rounded-lg">
										<h4 className="font-semibold text-sm mb-2">Alternatif:</h4>
										<div className="text-xs space-y-1">
											<p>Anda dapat mencari fasilitas di Semarang dengan:</p>
											<p>• Klik di peta untuk menandai lokasi</p>
											<p>• Gunakan search bar untuk mencari alamat</p>
										</div>
									</div>
								)}
							</div>
							<button
								onClick={() => setLocationMessage(null)}
								className="flex-shrink-0 text-white hover:text-gray-200"
							>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				)}	

				<MapContainer
					center={mapCenter}
					zoom={15}
					scrollWheelZoom={true}
					className="h-full w-full z-0"
					ref={mapRef}
				>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<MapEvents onMapClick={handleMapClick} />
					<Polygon positions={semarangLine} pathOptions={{ color: 'red', weight: 5, fill: false }} />
					{userPin && <Marker position={userPin} icon={userPinIcon} />}

					{showResults && (
						<>
							{polygonCoords.length > 0 && (
								<Polygon
									pathOptions={{
										color: "orange",
										fillColor: "orange",
										fillOpacity: 0.2,
									}}
									positions={polygonCoords}
								/>
							)}
							{filteredFacilities.map((facility) => (
								<FacilityMarker
									key={facility.id}
									facility={facility}
									onSelect={handleFacilitySelect}
								/>
							))}
						</>
					)}

					{districtPolygon && (
						<Polygon
							pathOptions={{
								color: "red",
								weight: 4,
								fillColor: "red",
								fillOpacity: 0.1,
								opacity: 1,
							}}
							positions={districtPolygon}
							zIndex={1000}
						/>
					)}
					{kelurahanPolygons.map((kelurahan, index) => {
						const randomColor = generateRandomKelurahanColor();

						return (
							<Polygon
								key={index}
								pathOptions={{
									color: randomColor,
									weight: 2,
									fillColor: randomColor,
									fillOpacity: 0.15,
									opacity: 0.8,
								}}
								positions={kelurahan}
								zIndex={500}
							/>
						);
					})}
				</MapContainer>

				<div
					className={clsx(
						"absolute left-1/2 -translate-x-1/2 z-20 flex transition-opacity duration-300",
						buttonConfig.containerStyle,
						{ "opacity-0 pointer-events-none": showResults }
					)}
					style={{
						bottom:
							isLandscape && window.innerWidth <= 1024
								? "calc(env(safe-area-inset-bottom, 0px) + 60px)"
								: "clamp(40px, 10vh, 80px)",
					}}
				>
					<button
						onClick={handleUseMyLocation}
						disabled={isLoadingLocation}
						className={clsx(
							"bg-brand-light-blue text-brand-dark-blue font-semibold rounded-xl shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center font-poppins whitespace-nowrap",
							buttonConfig.padding,
							buttonConfig.fontSize,
							buttonConfig.gap,
							{ "opacity-50 cursor-not-allowed": isLoadingLocation }
						)}
						style={{
							height: buttonConfig.height,
							width: buttonConfig.width,
						}}
					>
						{isLoadingLocation ? (
							<>
								<div className="w-10 h-10 -ml-1 mr-1">
									{" "}
									{/* Ukuran disesuaikan agar pas */}
									<DotLottieReact
										src="https://lottie.host/0e9cf3ae-c8a4-45d7-98c7-91a6299984f4/LeOjdk2d4g.lottie"
										loop
										autoplay
									/>
								</div>
								<span>Mengambil Lokasi...</span>
							</>
						) : (
							<>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={buttonConfig.iconSize}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
									/>
								</svg>
								Gunakan Lokasi Saya
							</>
						)}
					</button>
					<button
						onClick={handleCheckFacilities}
						className={clsx(
							"bg-brand-accent text-brand-dark-blue font-semibold rounded-xl shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center font-poppins whitespace-nowrap",
							buttonConfig.padding,
							buttonConfig.fontSize,
							buttonConfig.gap
						)}
						style={{
							height: buttonConfig.height,
							width: buttonConfig.width,
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className={buttonConfig.iconSize}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
						Cari Fasilitas Publik
					</button>
				</div>

				<FacilityDetailCard
					facility={selectedFacility}
					onClose={() => setSelectedFacility(null)}
				/>

				{/* Tombol Maximize untuk Mobile */}
				{isMobile && showResults && !selectedFacility && (
					<button
						className={clsx(
							"fixed z-30 bg-brand-accent text-brand-dark-blue rounded-full shadow-lg hover:bg-brand-light-blue transition-all duration-200 flex items-center justify-center",
							maximizeConfig.buttonPadding,
							maximizeConfig.bottomPosition,
							maximizeConfig.rightPosition
						)}
						style={{
							width: maximizeConfig.buttonWidth,
							height: maximizeConfig.buttonHeight,
						}}
						onClick={() => setSelectedFacility(null)}
						aria-label="Tampilkan daftar fasilitas"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className={clsx(maximizeConfig.iconSize, "text-brand-dark-blue")}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
							/>
						</svg>
					</button>
				)}

				<SidePanel
					isVisible={showResults && !selectedFacility}
					facilities={filteredFacilities}
					geoInfo={geoInfo}
					onFacilitySelect={handleFacilitySelect}
					onClose={resetView}
				/>
			</main>
		</div>
	);
};

export default MapPage;
