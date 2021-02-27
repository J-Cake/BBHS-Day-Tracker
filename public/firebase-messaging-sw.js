importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js')

firebase.initializeApp({
    apiKey: "AIzaSyC6kzMGG1zmd4y7o5Frw5QE6KYsN-YqoCU",
    authDomain: "server-updater.firebaseapp.com",
    projectId: "server-updater",
    storageBucket: "server-updater.appspot.com",
    messagingSenderId: "861812329316",
    appId: "1:861812329316:web:a86570fb9a6146eafc4871"
});

const messaging = firebase.messaging();
