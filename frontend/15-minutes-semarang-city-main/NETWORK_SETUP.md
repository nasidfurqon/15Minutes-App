# Network Setup untuk 15 Minutes Semarang City

## 🚀 Cara Menjalankan Aplikasi di Network

### 1. Jalankan Laravel Backend dengan Network Access

```bash
# Masuk ke direktori Laravel backend
cd laravel-backend

# Jalankan server dengan network access
php artisan serve --host=0.0.0.0 --port=8000

# Atau gunakan script yang sudah dibuat
chmod +x start-server.sh
./start-server.sh
```

### 2. Jalankan React Frontend dengan Network Access

```bash
# Di direktori root project
# Jalankan development server
npm run dev

# Atau gunakan script yang sudah dibuat
chmod +x start-dev.sh
./start-dev.sh
```

### 3. Akses dari HP/Device Lain

#### Frontend (React):

- `http://192.168.1.5:5173`
- `http://192.168.100.2:5173`
- `http://192.168.139.1:5173`
- `http://192.168.232.1:5173`

#### Backend (Laravel):

- `http://192.168.1.5:8000/api`
- `http://192.168.100.2:8000/api`
- `http://192.168.139.1:8000/api`
- `http://192.168.232.1:8000/api`

## 🔧 Troubleshooting

### Jika mendapat Network Error:

1. **Pastikan Laravel backend berjalan:**

   ```bash
   cd laravel-backend
   php artisan serve --host=0.0.0.0 --port=8000
   ```

2. **Test API endpoint di browser:**

   - Buka: `http://192.168.1.5:8000/api/districts`
   - Seharusnya muncul JSON response

3. **Periksa firewall:**

   - Pastikan port 8000 dan 5173 tidak diblokir
   - Di Windows: Windows Defender Firewall
   - Di Linux: `sudo ufw allow 8000` dan `sudo ufw allow 5173`

4. **Periksa network connectivity:**
   ```bash
   # Test dari HP ke komputer
   ping 192.168.1.5
   ```

### Jika mendapat CORS Error:

1. **Restart Laravel server** setelah perubahan CORS middleware
2. **Clear browser cache** atau buka di incognito mode
3. **Periksa console browser** (F12) untuk error detail

## 📱 Testing di HP

1. **Pastikan HP dan komputer dalam network yang sama**
2. **Buka browser di HP**
3. **Akses:** `http://192.168.1.5:5173`
4. **Test fitur lokasi dan pencarian fasilitas**

## 🔍 Debug Info

### Console Browser (F12):

- Akan menampilkan API URL yang digunakan
- Error detail jika ada masalah network
- Log lokasi dan akurasi GPS

### Laravel Log:

```bash
cd laravel-backend
tail -f storage/logs/laravel.log
```

## ⚡ Quick Start

```bash
# Terminal 1 - Laravel Backend
cd laravel-backend
php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2 - React Frontend
npm run dev

# Akses dari HP
# http://192.168.1.5:5173
```
