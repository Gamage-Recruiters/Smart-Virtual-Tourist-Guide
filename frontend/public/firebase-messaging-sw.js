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

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vite.svg",
  };
});
