import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBae9XMd18iDJwaflT0UebqW9UXR9oFc4E',
  authDomain: 'accuenergy-task-69a84.firebaseapp.com',
  projectId: 'accuenergy-task-69a84',
  storageBucket: 'accuenergy-task-69a84.appspot.com',
  messagingSenderId: '731094867562',
  appId: '1:731094867562:web:f63ba16f531624065e7413'
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)

export default app
