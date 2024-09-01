
import firebase from'@react-native-firebase/app';
import '@react-native-firebase/auth';;
import '@react-native-firebase/firestore' ;// Import other Firebase services as needed

const firebaseConfig = {
    apiKey: "AIzaSyBJwr67s2iSG-Uluo-VLugDx9mZLJaR-_c",
    authDomain: "absa-3d273.firebaseapp.com",
    databaseURL: "https://absa-3d273-default-rtdb.firebaseio.com"
    projectId: "absa-3d273",
    storageBucket: "absa-3d273.appspot.com",
    messagingSenderId: "785691308553",
    appId: "1:785691308553:web:b87d0c84542339df3fbed8",
    measurementId: "G-BKPE7GLN3H"
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
