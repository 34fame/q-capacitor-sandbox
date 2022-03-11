import { Platform } from 'quasar'
import {
   GoogleAuthProvider,
   signInWithRedirect,
   signInWithCredential,
} from 'firebase/auth'
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication'

import { auth as fireauth } from 'boot/firebase'

export default function useAuth() {
   const signInWithGoogle = async () => {

      if (Platform.is.capacitor) {
         try {
            const result = await FirebaseAuthentication.signInWithGoogle()
            const user = result.user
            const token = result.credential.idToken
            console.log('user', user)
            const credential = GoogleAuthProvider.credential(token)
            await signInWithCredential(fireauth, credential)
            return user
         } catch (error) {
            console.error('signIn', error.message)
         }
      } else {
         signInWithRedirect(fireauth, new GoogleAuthProvider())
      }
   }

   return { signInWithGoogle }
}
