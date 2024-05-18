import firebase from "firebase/compat/app";
import 'firebase/compat/auth';

const firebaseConfig = { 
    apiKey : "AIzaSyAnW5Hf0HolLMkqgMVCVHR0bT6XJW26DSU" , 
    authDomain : "verify-otp-35f83.firebaseapp.com" , 
    projectId : "verify-otp-35f83" , 
    storageBucket : "verify-otp-35f83.appspot.com" , 
    messagingSenderId : "24090767160" , 
    appId : "1:24090767160:web:d2b576f6b217812a331bcd" , 
    measurementId : "G-5WVXJNEFHX" 
  };

firebase.initializeApp(firebaseConfig)

export default firebase;