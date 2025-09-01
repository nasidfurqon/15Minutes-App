import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch, onClear }) => {
	const [query, setQuery] = useState("");
	const [styles, setStyles] = useState({
		height: "clamp(40px, 4.5vh, 60px)",
		fontSize: "clamp(16px, 1.2vw, 20px)",
		iconSize: "clamp(16px, 1.5vw, 24px)",
		strokeWidth: 1.5,
	});

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width >= 811 && width <= 1167) {
				setStyles({
					height: "clamp(30px, 3.8vh, 35px)",
					fontSize: "clamp(14px, 1vw, 16px)",
					iconSize: "clamp(14px, 1.2vw, 20px)",
					strokeWidth: 2,
				});
			} else {
				setStyles({
					height: "clamp(40px, 4.5vh, 60px)",
					fontSize: "clamp(16px, 1.2vw, 20px)",
					iconSize: "clamp(16px, 1.5vw, 24px)",
					strokeWidth: 1.5,
				});
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSearch(query);
	};

	const handleClear = () => {
		setQuery("");
		if (onClear) onClear();
	};

	return (
		<form onSubmit={handleSubmit} className="relative w-1/2 max-w-full ml-auto">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder={query ? "" : "Telusuri Lokasi"}
				className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light-blue focus:ring-opacity-50 transition-all duration-200 font-poppins"
				style={{
					height: styles.height,
					backgroundColor: "#ECEFCA",
					color: "#213448",
					fontWeight: "500",
					fontSize: styles.fontSize,
					paddingLeft: "clamp(20px, 1.5vw, 32px)",
					paddingRight: query
						? "clamp(80px, 7vw, 100px)"
						: "clamp(50px, 4.2vw, 60px)",
					border: "none",
					outline: "none",
					opacity: "1",
				}}
			/>
			<div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4">
				{query && (
					<button
						type="button"
						onClick={handleClear}
						className="text-gray-600 hover:text-brand-dark-blue transition-colors duration-200 mr-2 md:mr-3"
						style={{
							width: styles.iconSize,
							height: styles.iconSize,
							padding: "0",
						}}
						aria-label="Clear search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={styles.strokeWidth}
							stroke="currentColor"
							className="w-full h-full"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
				<button
					type="submit"
					className="text-gray-600 hover:text-brand-dark-blue transition-colors duration-200"
					style={{
						width: styles.iconSize,
						height: styles.iconSize,
						padding: "0",
					}}
					aria-label="Search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={styles.strokeWidth}
						stroke="currentColor"
						className="w-full h-full"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</button>
			</div>
		</form>
	);
};

export default SearchBar;
