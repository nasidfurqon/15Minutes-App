import React, { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import semarangBg from "../assets/images/semarang-background.jpg";

const MainPage = ({ onCheckLocation }) => {
	// State untuk menyimpan semua konfigurasi styling
	const [styles, setStyles] = useState({
		header: {
			fontSize: "clamp(16px, 4vw, 56px)",
			top: "clamp(75px, 10vh, 140px)",
			marginX: "clamp(20px, 8.3vw, 120px)",
			textShadow: `
				-1px -1px 0 #F0EAD6,
				1px -1px 0 #F0EAD6,
				-1px 1px 0 #F0EAD6,
				1px 1px 0 #F0EAD6`,
		},
		description: {
			fontSize: "clamp(12px, 1.8vw, 26px)",
			padding: "clamp(28px, 3.5vw, 48px)",
			marginX: "clamp(20px, 8.3vw, 120px)",
			top: "clamp(240px, 30vh, 360px)",
			gap: "clamp(32px, 5vh, 52px)",
		},
		button: {
			fontSize: "clamp(14px, 1.25vw, 18px)",
			height: "clamp(50px, 5.56vh, 80px)",
			padding: "clamp(24px, 2.5vw, 40px)",
			iconSize: "clamp(20px, 2.5vw, 35px)",
			width: "auto",
		},
	});

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const isLandscape = width > height;
			let newStyles = { ...styles };

			if (isLandscape && width <= 926) {
				newStyles = {
					header: {
						fontSize: "clamp(28px, 4vw, 32px)", // Increased from 18px
						top: "clamp(20px, 3vh, 25px)", // Reduced from 30px-40px to 20px-25px
						marginX: "clamp(20px, 4vw, 30px)",
						textShadow: `-1px -1px 0 #F0EAD6, 1px -1px 0 #F0EAD6, -1px 1px 0 #F0EAD6, 1px 1px 0 #F0EAD6`,
					},
					description: {
						fontSize: "clamp(16px, 2vw, 18px)", // Increased from 12px
						padding: "clamp(16px, 2.5vw, 20px)",
						marginX: "clamp(20px, 4vw, 30px)",
						top: "clamp(110px, 22vh, 130px)", // Adjusted to create more space from header
						gap: "clamp(16px, 2.5vh, 20px)", // Slightly reduced gap to maintain button position
					},
					button: {
						fontSize: "clamp(16px, 2vw, 18px)", // Increased from 12px
						height: "clamp(44px, 10vh, 48px)", // Increased height
						padding: "clamp(20px, 3vw, 24px)",
						iconSize: "clamp(20px, 2.5vw, 24px)", // Increased icon size
						width: "auto",
					},
				};
			} else if (width <= 320) {
				// 📱 Mobile Extra Small (<=320px)
				newStyles = {
					header: {
						fontSize: "20px",
						top: "40px",
						marginX: "16px",
						textShadow: `
							-0.5px -0.5px 0 #F0EAD6,
							0.5px -0.5px 0 #F0EAD6,
							-0.5px 0.5px 0 #F0EAD6,
							0.5px 0.5px 0 #F0EAD6`,
					},
					description: {
						fontSize: "14px",
						padding: "16px",
						marginX: "16px",
						top: "140px",
						gap: "30px",
					},
					button: {
						fontSize: "14px",
						height: "40px",
						padding: "20px",
						iconSize: "16px",
						width: "100%", // Full width untuk mobile
					},
				};
			} else if (width <= 375) {
				// 📱 Mobile Small (<=375px)
				newStyles = {
					header: {
						fontSize: "20px",
						top: "40px",
						marginX: "16px",
						textShadow: `
							-0.5px -0.5px 0 #F0EAD6,
							0.5px -0.5px 0 #F0EAD6,
							-0.5px 0.5px 0 #F0EAD6,
							0.5px 0.5px 0 #F0EAD6`,
					},
					description: {
						fontSize: "14px",
						padding: "16px",
						marginX: "16px",
						top: "160px",
						gap: "30px",
					},
					button: {
						fontSize: "14px",
						height: "40px",
						padding: "20px",
						iconSize: "16px",
						width: "100%", // Full width untuk mobile
					},
				};
			} else if (width <= 414) {
				// 📱 Mobile Medium (375px-414px)
				newStyles = {
					header: {
						fontSize: "25px",
						top: "50px",
						marginX: "20px",
						textShadow: `
							-0.75px -0.75px 0 #F0EAD6,
							0.75px -0.75px 0 #F0EAD6,
							-0.75px 0.75px 0 #F0EAD6,
							0.75px 0.75px 0 #F0EAD6`,
					},
					description: {
						fontSize: "14px",
						padding: "20px",
						marginX: "20px",
						top: "160px",
						gap: "30px",
					},
					button: {
						fontSize: "14px",
						height: "45px",
						padding: "20px",
						iconSize: "18px",
						width: "100%", // Full width untuk mobile
					},
				};
			} else if (width <= 767) {
				// 📱 Mobile Large (414px-767px)
				newStyles = {
					header: {
						fontSize: "clamp(26px, 4vw, 32px)",
						top: "clamp(60px, 8vh, 75px)",
						marginX: "clamp(24px, 4vw, 32px)",
						textShadow: `
							-1px -1px 0 #F0EAD6,
							1px -1px 0 #F0EAD6,
							-1px 1px 0 #F0EAD6,
							1px 1px 0 #F0EAD6,
							-1.5px -1.5px 0 #F0EAD6,
							1.5px -1.5px 0 #F0EAD6,
							-1.5px 1.5px 0 #F0EAD6,
							1.5px 1.5px 0 #F0EAD6`,
					},
					description: {
						fontSize: "clamp(15px, 2.5vw, 18px)",
						padding: "clamp(24px, 3vw, 32px)",
						marginX: "clamp(24px, 4vw, 32px)",
						top: "clamp(180px, 25vh, 220px)",
						gap: "clamp(24px, 3vh, 32px)",
					},
					button: {
						fontSize: "clamp(15px, 2.2vw, 17px)",
						height: "clamp(50px, 7vh, 60px)",
						padding: "clamp(24px, 3vw, 32px)",
						iconSize: "clamp(20px, 3vw, 26px)",
						width: "100%", // Full width untuk mobile
					},
				};
			} else if (width <= 884) {
				// 📊 Tablets (768px-884px)
				newStyles = {
					header: {
						fontSize: "48px",
						top: "100px", // Tambah jarak dari atas
						marginX: "50px",
						textShadow: `
							-1.25px -1.25px 0 #F0EAD6,
							1.25px -1.25px 0 #F0EAD6,
							-1.25px 1.25px 0 #F0EAD6,
							1.25px 1.25px 0 #F0EAD6,
							-2px -2px 0 #F0EAD6,
							2px -2px 0 #F0EAD6,
							-2px 2px 0 #F0EAD6,
							2px 2px 0 #F0EAD6`,
					},
					description: {
						fontSize: "22px", // Perbesar font description
						padding: "40px",
						marginX: "50px",
						top: "280px", // Tambah jarak dari header
						gap: "50px", // Tambah gap antara description dan button
					},
					button: {
						fontSize: "20px", // Perbesar font button
						height: "75px", // Perbesar tinggi button
						padding: "45px", // Perbesar padding
						iconSize: "32px", // Perbesar icon
						width: "auto",
					},
				};
			} else {
				// 💻 Laptops (1280px+)
				newStyles = {
					header: {
						fontSize: "clamp(45px, 4vw, 56px)",
						top: "clamp(75px, 10vh, 140px)",
						marginX: "clamp(20px, 8.3vw, 120px)",
						textShadow: `
							-2px -2px 0 #F0EAD6,
							2px -2px 0 #F0EAD6,
							-2px 2px 0 #F0EAD6,
							2px 2px 0 #F0EAD6,
							-3px -3px 0 #F0EAD6,
							3px -3px 0 #F0EAD6,
							-3px 3px 0 #F0EAD6,
							3px 3px 0 #F0EAD6`,
					},
					description: {
						fontSize: "clamp(12px, 1.8vw, 26px)",
						padding: "clamp(28px, 3.5vw, 48px)",
						marginX: "clamp(20px, 8.3vw, 120px)",
						top: "clamp(240px, 30vh, 360px)",
						gap: "clamp(32px, 5vh, 52px)",
					},
					button: {
						fontSize: "clamp(14px, 1.25vw, 18px)",
						height: "clamp(50px, 5.56vh, 80px)",
						padding: "clamp(24px, 2.5vw, 40px)",
						iconSize: "clamp(20px, 2.5vw, 35px)",
						width: "auto",
					},
				};
			}

			setStyles(newStyles);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div
			style={{ backgroundImage: `url(${semarangBg})` }}
			className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden main-page-container no-horizontal-scroll viewport-safe"
		>
			<div className="absolute inset-0 bg-black/50"></div>

			<div className="relative z-10 w-full min-h-screen">
				<h1
					className="font-bold text-left font-poppins leading-tight"
					style={{
						position: "absolute",
						fontWeight: "700",
						color: "#213448",
						top: styles.header.top,
						left: styles.header.marginX,
						width: "clamp(300px, 45vw, 600px)",
						lineHeight: "1.2",
						textAlign: "left",
						minWidth: "250px",
						fontSize: styles.header.fontSize,
						textShadow: styles.header.textShadow,
					}}
				>
					<div style={{ whiteSpace: "nowrap" }}>15 Minutes</div>
					<div style={{ whiteSpace: "nowrap" }}>Semarang City</div>
				</h1>

				<div
					style={{
						position: "absolute",
						top: styles.description.top,
						left: styles.description.marginX,
						right: styles.description.marginX,
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: styles.description.gap,
					}}
				>
					<div
						className="w-full rounded-lg shadow-xl font-poppins"
						style={{
							backgroundColor: "rgba(148, 180, 193, 0.75)",
							padding: styles.description.padding,
							boxSizing: "border-box",
						}}
					>
						<p
							className="text-justify leading-relaxed"
							style={{
								fontWeight: "500",
								color: "#213448",
								textShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
								lineHeight: "1.5",
								fontSize: styles.description.fontSize,
								fontFamily:
									"system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
							}}
						>
							Program Kota 15-Menit Semarang adalah platform strategis untuk
							menganalisis kemudahan warga dalam mengakses fasilitas krusial
							dalam 15 menit dengan berjalan kaki. Data yang dihasilkan dari
							pemetaan ini bertujuan untuk mendukung perumusan kebijakan tata
							ruang yang lebih efektif demi meningkatkan konektivitas dan
							kualitas hidup masyarakat.
						</p>
					</div>

					<div style={{ width: styles.button.width }}>
						<button
							onClick={onCheckLocation}
							className="flex items-center justify-center gap-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 font-poppins"
							style={{
								backgroundColor: "#547792",
								color: "#ECEFCA",
								fontWeight: "700",
								fontSize: styles.button.fontSize,
								boxShadow:
									"inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)",
								cursor: "pointer",
								whiteSpace: "nowrap",
								padding: `0 ${styles.button.padding}`,
								height: styles.button.height,
								width: "100%",
								fontFamily:
									"system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
							}}
						>
							Periksa Lokasi Saya
							<ArrowRightIcon
								className="ml-2 flex-shrink-0"
								style={{
									width: styles.button.iconSize,
									height: styles.button.iconSize,
									strokeWidth: "3",
									filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
								}}
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainPage;
