
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
//import firebase

//firebase config
var config = {
  apiKey: "AIzaSyCAkPzyJ3z1DroJHcnWFMf8Li29uoX4O-Y",
  authDomain: "timesheet3-48d74.firebaseapp.com",
  projectId: "timesheet3-48d74",
  storageBucket: "timesheet3-48d74.appspot.com",
  messagingSenderId: "298841725793",
  appId: "1:298841725793:web:65157d877ab24b4930c320"
};

//Initialize Firebase
firebase.initializeApp(config)

export const auth = firebase.auth() //firebase authentication
export const db = firebase.firestore() //firebase database

export default firebase




