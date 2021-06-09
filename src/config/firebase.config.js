import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDIfv4YEbHBIJ-r9wmwmB8MVN80cwa04rY",
  authDomain: "note-app-4a1fa.firebaseapp.com",
  projectId: "note-app-4a1fa",
  storageBucket: "note-app-4a1fa.appspot.com",
  messagingSenderId: "746813081265",
  appId: "1:746813081265:web:935849a41c8c331b214490",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default db;
