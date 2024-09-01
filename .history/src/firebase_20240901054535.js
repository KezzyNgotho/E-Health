
import firebase from'@react-native-firebase/app';
import '@react-native-firebase/auth';;
import '@react-native-firebase/firestore' ;// Import other Firebase services as needed



const firebaseConfig = {
    apiKey: "AIzaSyAohUft_U6AkeDoaxrim1UQWynQQicaL0o",
    authDomain: "siricoin-5cbc1.firebaseapp.com",
    databaseURL: "https://siricoin-5cbc1-default-rtdb.firebaseio.com",
    projectId: "siricoin-5cbc1",
    storageBucket: "siricoin-5cbc1.appspot.com",
    messagingSenderId: "1005297996117",
    appId: "1:1005297996117:web:2e8bdb36297ccd15199fdc",
    measurementId: "G-Q0P10CZ96N"
  };
  
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;











var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://absa-3d273-default-rtdb.firebaseio.com"
});
