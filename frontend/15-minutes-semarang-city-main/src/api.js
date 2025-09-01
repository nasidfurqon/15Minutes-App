// src/api.js
import axios from "axios";
const API_BASE_URL = "/api"
// Fungsi untuk mendapatkan base URL API berdasarkan host
const getApiBaseUrl = () => {
	return API_BASE_URL;
};

// Buat instance axios
const api = axios.create({
	baseURL: getApiBaseUrl(),
	headers: {
		"Content-Type": "application/json",
		// Authorization bisa ditambahkan jika pakai token nanti
	},
});

// Contoh interceptor error (optional)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error?.response || error);
		console.error("API URL:", error?.config?.url);
		console.error("API Base URL:", getApiBaseUrl());
		return Promise.reject(error);
	}
);

export default api;