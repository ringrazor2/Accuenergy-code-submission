import { reactive, provide, inject, onMounted, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const AuthContextSymbol = Symbol()

export const AuthContextProvider = {
  setup(props, { slots }) {
    const user = reactive({})
    const signUp = async (email, password) => {
      try {
        const docRef = doc(db, 'users', email)
        await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(docRef, {
          address: [],
          searchedTime: []
        })
      } catch (err) {
        console.error(err)
      }
    }

    const signIn = (email, password) => {
      return signInWithEmailAndPassword(auth, email, password)
    }

    const googleSignIn = async () => {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userEmail = result.user.email
      const docRef = doc(db, 'users', userEmail)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          address: [],
          searchedTime: []
        })
      }
    }

    const logOut = () => {
      signOut(auth).then(() => {
        console.log('sign out successful')
      })
    }

    onMounted(() => {
      const unSubscribe = onAuthStateChanged(auth, (currUser) => {
        if (currUser) {
          user = currUser
        } else {
          user = {}
          logOut()
        }
      })
      return () => unSubscribe()
    })

    provide(AuthContextSymbol, {
      googleSignIn,
      logOut,
      user,
      signUp,
      signInWithEmailAndPassword,
      signIn
    })

    return () => <>{slots.default()}</>
  }
}

export const UserAuth = {
  setup() {
    const authContext = inject(AuthContextSymbol)
    return () => authContext
  }
}
