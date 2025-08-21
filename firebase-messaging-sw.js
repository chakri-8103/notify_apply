importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

/* Initialize Firebase (mee credentials) */
firebase.initializeApp({
  apiKey: "AIzaSyDNn6mTQSSziK0euwazJYp7vQPZoT3ZEPo",
  authDomain: "callwebview-61c3a.firebaseapp.com",
  projectId: "callwebview-61c3a",
  messagingSenderId: "440935657909",
  appId: "1:440935657909:web:86f4e12e35802f8d91a9fc"
});

/* Initialize Messaging */
const messaging = firebase.messaging();

/* Background Notifications */
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: payload.notification?.icon || payload.data?.logoUrl || "/logo.png",
    image: payload.notification?.image || payload.data?.imageUrl || null,
    data: payload.data || {},
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

/* ✅ Force service worker to activate immediately */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

/* ✅ Ensure new service worker takes control without refresh */
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* ✅ Handle Notification Clicks */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const clickAction = event.notification.data?.click_action || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === clickAction && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});