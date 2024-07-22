import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA02uS14cQNSoglongbuGGAux-Zq5cVm6s',
  authDomain: 'to-do-list-app-e9e26.firebaseapp.com',
  projectId: 'to-do-list-app-e9e26',
  storageBucket: 'to-do-list-app-e9e26.appspot.com',
  messagingSenderId: '800050319851',
  appId: '1:800050319851:web:6e17bd0f85308b3b9689ae',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
