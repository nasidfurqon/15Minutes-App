// Data dummy ini mensimulasikan fasilitas yang ditemukan dalam radius 15 menit
// Koordinat berpusat di sekitar Simpang Lima Semarang (-6.9929, 110.4253)
export const dummyFacilities = [
	// KESEHATAN
	{
		id: 1,
		name: "RS St. Elisabeth Semarang",
		type: "kesehatan",
		position: [-6.991, 110.423],
		address: "Jl. Kawi No.1, Tegalsari",
		contact: "(024) 8310035",
		hours: "24 Jam",
	},
	{
		id: 2,
		name: "Puskesmas Karangkidul",
		type: "kesehatan",
		position: [-6.994, 110.428],
		address: "Jl. Karangkidul No.15",
		contact: "(024) 8502341",
		hours: "07:00 - 21:00",
	},
	{
		id: 3,
		name: "RSUD K.R.M.T Wongsonegoro",
		type: "kesehatan",
		position: [-6.996, 110.432],
		address: "Jl. Fatmawati No.1",
		contact: "(024) 6710081",
		hours: "24 Jam",
	},

	// GEREJA
	{
		id: 4,
		name: "Gereja Katedral Semarang",
		type: "gereja",
		position: [-6.9895, 110.4248],
		address: "Jl. Pandanaran No.15",
		contact: "(024) 8314578",
		hours: "05:00 - 20:00",
	},
	{
		id: 5,
		name: "Gereja Blenduk",
		type: "gereja",
		position: [-6.987, 110.421],
		address: "Jl. Letjen Suprapto No.32",
		contact: "(024) 3541876",
		hours: "06:00 - 19:00",
	},

	// MASJID
	{
		id: 6,
		name: "Masjid Agung Jawa Tengah",
		type: "masjid",
		position: [-6.985, 110.425],
		address: "Jl. Gajah Raya, Gayamsari",
		contact: "(024) 7605123",
		hours: "24 Jam",
	},
	{
		id: 7,
		name: "Masjid Al-Ma'ruf",
		type: "masjid",
		position: [-6.993, 110.427],
		address: "Jl. Imam Bonjol No.45",
		contact: "(024) 8415632",
		hours: "24 Jam",
	},

	// KLENTENG
	{
		id: 8,
		name: "Klenteng Tek Hay Kiong",
		type: "klenteng",
		position: [-6.9902, 110.4265],
		address: "Jl. Gang Lombok No.32",
		contact: "(024) 3564233",
		hours: "06:00 - 18:00",
	},
	{
		id: 9,
		name: "Klenteng Tay Kak Sie",
		type: "klenteng",
		position: [-6.992, 110.424],
		address: "Jl. Gang Pinggir No.74",
		contact: "(024) 3555512",
		hours: "06:00 - 18:00",
	},

	// PURA
	{
		id: 10,
		name: "Pura Giri Natha",
		type: "pura",
		position: [-6.995, 110.42],
		address: "Jl. Pandanaran No.89",
		contact: "(024) 8441230",
		hours: "05:00 - 19:00",
	},
	{
		id: 11,
		name: "Pura Agung Girinatha",
		type: "pura",
		position: [-6.9925, 110.4235],
		address: "Jl. Simongan Raya No.45",
		contact: "(024) 7472156",
		hours: "05:00 - 19:00",
	},

	// VIHARA
	{
		id: 12,
		name: "Vihara Buddhagaya Watugong",
		type: "vihara",
		position: [-6.988, 110.429],
		address: "Jl. Watugong No.12",
		contact: "(024) 7605432",
		hours: "05:00 - 18:00",
	},
	{
		id: 13,
		name: "Vihara Mahavira",
		type: "vihara",
		position: [-6.9915, 110.4255],
		address: "Jl. Pemuda No.156",
		contact: "(024) 3520987",
		hours: "05:00 - 18:00",
	},

	// RESTORAN
	{
		id: 14,
		name: "Ayam Goreng & Sop Buntut Daging Sapi",
		type: "restoran",
		position: [-6.9895, 110.4248],
		address: "Jl. Pahlawan No. 7, Simpang Lima",
		contact: "08123456789",
		hours: "10:00 - 22:00",
	},
	{
		id: 15,
		name: "LCM (Lunpia Cik Me Me)",
		type: "restoran",
		position: [-6.9902, 110.4265],
		address: "Jl. Gajahmada No. 107",
		contact: "(024) 3564233",
		hours: "07:00 - 21:00",
	},
	{
		id: 16,
		name: "Warung Gudeg Yu Djum",
		type: "restoran",
		position: [-6.9875, 110.4235],
		address: "Jl. Pemuda No.123",
		contact: "(024) 8415678",
		hours: "08:00 - 20:00",
	},

	// TOKO
	{
		id: 17,
		name: "Indomaret Simpang Lima",
		type: "toko",
		position: [-6.9925, 110.4245],
		address: "Jl. Ahmad Yani No.88",
		contact: "(024) 3571234",
		hours: "24 Jam",
	},
	{
		id: 18,
		name: "Alfamart Pandanaran",
		type: "toko",
		position: [-6.9885, 110.4275],
		address: "Jl. Pandanaran No.67",
		contact: "(024) 8429876",
		hours: "24 Jam",
	},
	{
		id: 19,
		name: "Toko Oen Semarang",
		type: "toko",
		position: [-6.9905, 110.4215],
		address: "Jl. Pemuda No.52",
		contact: "(024) 3543210",
		hours: "09:00 - 22:00",
	},

	// TAMAN
	{
		id: 20,
		name: "Taman Pandanaran",
		type: "taman",
		position: [-6.995, 110.42],
		address: "Jl. Pandanaran, Pekunden",
		contact: "N/A",
		hours: "24 Jam",
	},
	{
		id: 21,
		name: "Taman KB",
		type: "taman",
		position: [-6.9945, 110.4265],
		address: "Jl. Kartini No.1",
		contact: "N/A",
		hours: "05:00 - 21:00",
	},

	// PENDIDIKAN
	{
		id: 22,
		name: "UNDIP Fakultas Hukum",
		type: "pendidikan",
		position: [-6.986, 110.4225],
		address: "Jl. Imam Bardjo, S.H. No.5",
		contact: "(024) 8453708",
		hours: "07:00 - 17:00",
	},
	{
		id: 23,
		name: "SMA Negeri 3 Semarang",
		type: "pendidikan",
		position: [-6.9875, 110.4285],
		address: "Jl. Pemuda No.149",
		contact: "(024) 3540024",
		hours: "07:00 - 15:00",
	},
	{
		id: 24,
		name: "SD Negeri Karangkidul 01",
		type: "pendidikan",
		position: [-6.9935, 110.4275],
		address: "Jl. Karangkidul Raya No.23",
		contact: "(024) 8506789",
		hours: "07:00 - 13:00",
	},

	// PERPUSTAKAAN
	{
		id: 25,
		name: "Perpustakaan Kota Semarang",
		type: "perpustakaan",
		position: [-6.9915, 110.4235],
		address: "Jl. Menteri Supeno No.31",
		contact: "(024) 3543567",
		hours: "08:00 - 16:00",
	},
	{
		id: 26,
		name: "Perpustakaan Daerah Jawa Tengah",
		type: "perpustakaan",
		position: [-6.9865, 110.4255],
		address: "Jl. Sriwijaya No.1",
		contact: "(024) 3520147",
		hours: "08:00 - 15:00",
	},

	// PEMERINTAH
	{
		id: 27,
		name: "Balai Kota Semarang",
		type: "pemerintah",
		position: [-6.9885, 110.4245],
		address: "Jl. Pemuda No.148",
		contact: "(024) 3580000",
		hours: "07:30 - 16:00",
	},
	{
		id: 28,
		name: "Kantor Kecamatan Semarang Tengah",
		type: "pemerintah",
		position: [-6.9895, 110.4225],
		address: "Jl. Veteran No.25",
		contact: "(024) 3541289",
		hours: "07:30 - 16:00",
	},

	// STASIUN
	{
		id: 29,
		name: "Stasiun Semarang Tawang",
		type: "stasiun",
		position: [-6.985, 110.42],
		address: "Jl. Taman Tawang No.1",
		contact: "(024) 3543216",
		hours: "04:00 - 24:00",
	},

	// TERMINAL
	{
		id: 30,
		name: "Terminal Terboyo",
		type: "terminal",
		position: [-6.999, 110.435],
		address: "Jl. Setiabudi No.1",
		contact: "(024) 7605432",
		hours: "05:00 - 22:00",
	},

	// BANDARA (mungkin agak jauh tapi bisa dimasukkan)
	{
		id: 31,
		name: "Ahmad Yani International Airport",
		type: "bandara",
		position: [-6.9715, 110.3755],
		address: "Jl. Raya Airport",
		contact: "(024) 8666888",
		hours: "24 Jam",
	},
];

export const dummyGeographicInfo = {
	populationDensity: "Tinggi",
	kelurahan: "Mugassari",
	kecamatan: "Semarang Selatan",
};

// Contoh polygon untuk area 15 menit berjalan kaki (sekitar 1.2 km radius)
// Ini adalah bentuk kasar dan idealnya didapat dari API isochrone
export const dummyIsochrone = [
	[
		[-6.9995, 110.4253],
		[-6.9975, 110.431],
		[-6.9929, 110.434],
		[-6.988, 110.431],
		[-6.9863, 110.4253],
		[-6.988, 110.419],
		[-6.9929, 110.416],
		[-6.9975, 110.419],
		[-6.9995, 110.4253],
	],
];
