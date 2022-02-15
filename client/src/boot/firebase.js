import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import {
   getAuth,
   connectAuthEmulator,
   onAuthStateChanged,
   setPersistence,
   browserLocalPersistence,
} from 'firebase/auth'

const useEmulator = process.env.APP_ENV === 'local'

const firebaseConfig = useEmulator
   ? {
        projectId: 'emulator-sandbox',
        authDomain: `emulator-sandbox.firebaseapp.com`,
        apiKey: 'foo',
     }
   : {
        apiKey: 'AIzaSyC3M9vxUdzV202uVyf59Chrhi_rzQaOLk0',
        authDomain: 'fame-sandbox-dev.firebaseapp.com',
        projectId: 'fame-sandbox-dev',
        storageBucket: 'fame-sandbox-dev.appspot.com',
        messagingSenderId: '679264882364',
        appId: '1:679264882364:web:56a81ca69452b2848c0ab9',
        measurementId: 'G-LS6CVPFJKC',
     }

initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()

if (useEmulator) {
   connectFirestoreEmulator(db, '192.168.0.200', 8081)
   connectAuthEmulator(auth, 'http://192.168.0.200:9099')
}

export default boot(async ({ app, router, store }) => {
   await setPersistence(auth, browserLocalPersistence)

   onAuthStateChanged(auth, async (user) => {
      if (user) {
         store.commit('app/setUser', user)
         router.push({ name: 'home' })
      } else {
         store.commit('app/clearUser')
      }
   })

   app.provide('auth', auth)
   app.provide('db', db)
})
