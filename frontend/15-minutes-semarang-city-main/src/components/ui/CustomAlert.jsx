import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomAlert = ({ isOpen, onClose, title, children }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={onClose}
					/>

					{/* Konten Alert */}
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						transition={{ duration: 0.2 }}
						className="relative z-10 w-full max-w-sm rounded-2xl bg-brand-accent p-6 shadow-2xl text-center"
					>
						<div className="flex justify-center mb-4">
							<div className="w-12 h-12 rounded-full bg-brand-light-blue flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-7 h-7 text-brand-dark-blue"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
									/>
								</svg>
							</div>
						</div>
						<h3 className="text-xl font-bold text-brand-dark-blue mb-2 font-poppins">
							{title || "Perhatian"}
						</h3>
						<p className="text-brand-dark-blue/80 text-base">{children}</p>
						<button
							onClick={onClose}
							className="mt-6 w-full rounded-lg bg-brand-dark-blue px-4 py-2.5 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
						>
							Mengerti
						</button>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default CustomAlert;