import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  //   apiKey: import.meta.env.VUE_APP_FIREBASE_API_KEY,
  //   authDomain: import.meta.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  //   projectId: import.meta.env.VUE_APP_PROJECT_ID,
  //   storageBucket: import.meta.env.VUE_APP_STORAGE_BUCKET,
  //   messagingSenderId: import.meta.env.VUE_APP_MESSAGING_SENDER_ID,
  //   appId: import.meta.env.VUE_APP_APP_ID

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
