importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyDluUWal5PSKJ4QdyU2MN6p8CD1dvZZvHo",
  authDomain: "svtg-8eac2.firebaseapp.com",
  projectId: "svtg-8eac2",
  storageBucket: "svtg-8eac2.firebasestorage.app",
  messagingSenderId: "199046139944",
  appId: "1:199046139944:web:b29ca2b85a429b6b90251d",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload,
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vite.svg",
  };

  // Display the notification in the background
  self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
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
      }),
  );
});
