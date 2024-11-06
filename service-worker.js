const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css', // Ganti dengan file CSS Anda
    '/script.js',  // Ganti dengan file JS Anda
    '/manifest.json',
    '/images/portofolio.jpg', // Ganti dengan gambar yang Anda gunakan
     'images/foto.jpg',
    '/images/icon-192x192.png',
    '/assets/CV_Nurul_Khafidoh.pdf',
];

// Install Service Worker dan cache file
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Menghapus cache lama saat mengaktifkan Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Hapus cache yang tidak lagi digunakan
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Ambil file dari cache jika tersedia, jika tidak, ambil dari jaringan
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Kembalikan file dari cache jika ada
                if (response) {
                    return response; // Kembalikan response dari cache
                }

                // Jika tidak ada di cache, ambil dari jaringan
                return fetch(event.request).catch(() => {
                    // Jika terjadi kesalahan saat fetch (misalnya offline), kembalikan response 404
                    return new Response('Resource tidak tersedia di cache dan tidak dapat diambil dari jaringan.', {
                        status: 404,
                        statusText: 'Not Found'
                    });
                });
            })
    );
});

