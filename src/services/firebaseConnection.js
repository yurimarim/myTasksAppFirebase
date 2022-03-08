import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCfRQR-fT9DlbMG-y5SGONVJ3SwKkP76zc',
  authDomain: 'mytasksappfirebase.firebaseapp.com',
  projectId: 'mytasksappfirebase',
  storageBucket: 'mytasksappfirebase.appspot.com',
  messagingSenderId: '904815187788',
  appId: '1:904815187788:web:319ccc48df9b62a03861e9',
  measurementId: 'G-2R8BYXE206'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
