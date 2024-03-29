//always same
import firebase from 'firebase/compat/app';
import {getDatabase}from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyChcI5OeY6K0qqzffaNBR0se1SWAEGOCEQ",
  authDomain: "newweatherapp-522b7.firebaseapp.com",
  databaseURL: "https://newweatherapp-522b7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "newweatherapp-522b7",
  storageBucket: "newweatherapp-522b7.appspot.com",
  messagingSenderId: "821630275663",
  appId: "1:821630275663:web:0db2dbf7f69ea9e2a59a3a",
  measurementId: "G-BTGLZEEGKL"
};




if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();
export { db }
