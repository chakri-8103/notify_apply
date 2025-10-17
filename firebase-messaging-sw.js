importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC2KIl4oI-3RHlOfQ4sEqQ_jto1djRjbC8",
    authDomain: "abbhyass-f73ce.firebaseapp.com",
    projectId: "abbhyass-f73ce",
    messagingSenderId: "377862942950",
    appId: "1:377862942950:web:9a5e1cd734c16adfe0cb27"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'New Message';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || 'You have a new notification',
        icon: payload.notification?.icon || payload.data?.logoUrl || '/icon.png',
        data: payload.data || {} // keep extra data if needed
    };

    // Show the notification
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle click event on notification
self.addEventListener('notificationclick', function(event) {
    console.log('[firebase-messaging-sw.js] Notification click Received.', event.notification);
    event.notification.close();

    // Open a specific URL or focus the tab
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});
