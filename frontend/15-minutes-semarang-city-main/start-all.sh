#!/bin/bash

# Script untuk menjalankan Laravel backend dan React frontend sekaligus

echo "🚀 Starting 15 Minutes Semarang City Application..."
echo ""

# Fungsi untuk menjalankan Laravel backend
start_laravel() {
    echo "📡 Starting Laravel Backend..."
    cd laravel-backend
    php artisan serve --host=0.0.0.0 --port=8000
}

# Fungsi untuk menjalankan React frontend
start_react() {
    echo "🌐 Starting React Frontend..."
    npm run dev
}

# Jalankan kedua server dalam background
echo "🔄 Starting servers in background..."
echo ""

# Jalankan Laravel backend
start_laravel &
LARAVEL_PID=$!

# Tunggu sebentar agar Laravel siap
sleep 3

# Jalankan React frontend
start_react &
REACT_PID=$!

echo ""
echo "✅ Servers started successfully!"
echo ""
echo "🌐 Frontend URLs:"
echo "   - http://localhost:5173"
echo "   - http://192.168.1.5:5173"
echo "   - http://192.168.100.2:5173"
echo "   - http://192.168.139.1:5173"
echo "   - http://192.168.232.1:5173"
echo ""
echo "🔧 Backend URLs:"
echo "   - http://localhost:8000/api"
echo "   - http://192.168.1.5:8000/api"
echo "   - http://192.168.100.2:8000/api"
echo "   - http://192.168.139.1:8000/api"
echo "   - http://192.168.232.1:8000/api"
echo ""
echo "📱 Test dari HP: http://192.168.1.5:5173"
echo ""
echo "🛑 Press Ctrl+C to stop all servers"

# Tunggu sampai user tekan Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $LARAVEL_PID $REACT_PID; exit" INT
wait 