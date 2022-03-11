<template>
   <q-btn no-caps @click="signIn()">
      <div class="row justify-center q-gutter-x-md">
         <q-icon class="google google-color" name="fab fa-google" />
         <span class="text-weight-light">Login with Google</span>
      </div>
   </q-btn>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import useAuth from 'src/lib/auth'

export default defineComponent({
   name: 'GoogleLoginBtn',

   setup() {
      const router = useRouter()
      const store = useStore()
      const auth = useAuth()

      return {
         async signIn() {
            try {
               const user = await auth.signInWithGoogle()
               if (user) {
                  store.commit('app/setUser', user)
                  router.push({ name: 'home' })
               }
            } catch (error) {
               console.error('GoogleLoginBtn', 'signIn', error.message)
            }
         },
      }
   },
})
</script>

<style lang="sass">
.google-color
   color: #4285f4
</style>
