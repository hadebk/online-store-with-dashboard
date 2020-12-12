// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyChTzQs0nMrFFNIZfacnapUARpGCP-Hb_w",
  authDomain: "hazzy-store.firebaseapp.com",
  databaseURL: "https://hazzy-store.firebaseio.com",
  projectId: "hazzy-store",
  storageBucket: "hazzy-store.appspot.com",
  messagingSenderId: "181223236649",
  appId: "1:181223236649:web:7e6163667295687e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const realtimeDB = firebase.database();
const storageDB = firebase.storage();

export default {
  realtimeDB,
  storageDB,
};
