<template>
   <div></div>
</template>

<script>
import { defineComponent, inject, onMounted } from 'vue'
import { Platform } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication'

export default defineComponent({
   name: 'Logout',

   setup() {
      const auth = inject('auth')
      const router = useRouter()
      const store = useStore()

      onMounted(async () => {
         try {
            if (Platform.is.capacitor) {
               await FirebaseAuthentication.signOut()
               store.commit('app/clearUser')
            } else {
               await auth.signOut()
            }
            router.push({ name: 'home' })
         } catch (error) {
            console.error('Logout', 'onMounted', error.message)
         }
      })
   },
})
</script>
