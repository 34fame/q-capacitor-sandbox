<template>
   <q-page class="flex flex-center">
      <div class="column items-center q-gutter-lg">
         <q-icon name="shopping_cart" color="primary" size="164px" />
         <div class="text-h4 text-primary">Products</div>
         <div class="text-caption">Found {{ products.length }} products.</div>
      </div>
   </q-page>
</template>

<script>
import { defineComponent, inject, onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'

export default defineComponent({
   name: 'Products',

   setup() {
      const db = inject('db')

      const products = ref([])

      onMounted(async () => {
         const items = []
         const collectionRef = collection(db, 'products')
         const snapshot = await getDocs(collectionRef)
         console.log(snapshot.docs.length)
         snapshot.forEach((doc) => {
            items.push({
               id: doc.id,
               ...doc.data(),
            })
         })
         products.value = items
      })

      return { products }
   },
})
</script>
