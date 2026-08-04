importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyDifg3vRJTeg_K-hY2ijW3u9JOKoHcK6Dw",
  authDomain: "svtg-8169f.firebaseapp.com",
  projectId: "svtg-8169f",
  storageBucket: "svtg-8169f.firebasestorage.app",
  messagingSenderId: "706165894251",
  appId: "1:706165894251:web:2c81767d944fb10208952e",
  measurementId: "G-TQD7866SLQ",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload,
  );

  const notificationTitle = payload.notification.title || "Notification";
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: "/vite.svg",
    badge: "/vite.svg",
    data: {
      url: payload.data?.url || "/",
      notificationId: payload.data?.notificationId || "",
    },
  };

  // CRITICAL FIX: Without this call, the browser NEVER displays the
  // background notification. It was previously swallowed silently.
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ---------- NOTIFICATION CLICK HANDLER ----------
// Opens the app at the correct URL when the user taps the notification.
// Without this handler, clicking the notification does nothing.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        return clients.openWindow(targetUrl);
      }),
  );
});
