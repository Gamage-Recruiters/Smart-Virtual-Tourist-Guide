// Give the service worker access to Firebase Messaging.
// Note that you can use any version of Firebase v10+ (compat scripts are supported for SW)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
firebase.initializeApp({
  apiKey: "AIzaSyDluUWal5PSKJ4QdyU2MN6p8CD1dvZZvHo",
  authDomain: "svtg-8eac2.firebaseapp.com",
  projectId: "svtg-8eac2",
  storageBucket: "svtg-8eac2.firebasestorage.app",
  messagingSenderId: "199046139944",
  appId: "1:199046139944:web:b29ca2b85a429b6b90251d"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  // const notificationTitle = payload.notification?.title || "New Notification";
  // const notificationOptions = {
  //   body: payload.notification?.body || "",
  //   icon: "/vite.svg",
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle clicks on the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        return clients.openWindow("/");
      })
  );
});