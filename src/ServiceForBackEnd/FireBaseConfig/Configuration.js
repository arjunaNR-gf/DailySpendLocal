// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0GGmGzvvWylquFQwXqM64UCW7VR1AdvA",
  authDomain: "dailyspendlocal.firebaseapp.com",
  databaseURL:"https://dailyspendlocal-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dailyspendlocal",
  storageBucket: "dailyspendlocal.appspot.com",
  messagingSenderId: "733784143808",
  appId: "1:733784143808:web:fd99602655db98e7b93a25",
  measurementId: "G-E9GY8J3FXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app,analytics}