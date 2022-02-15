import { boot } from 'quasar/wrappers'
import { LocalStorage, Platform } from 'quasar'
import { PushNotifications } from '@capacitor/push-notifications'
import { FCM } from '@capacitor-community/fcm'
import { LocalNotifications } from '@capacitor/local-notifications'

const scheduleLocalNotification = async ({
   title,
   body,
   schedule,
   sound,
   attachments,
   actionTypeId,
   extra,
}) => {
   try {
      await LocalNotifications.schedule({
         notifications: [
            {
               id: new Date().valueOf(),
               title,
               body,
               schedule,
               sound,
               attachments,
               actionTypeId,
               extra,
            },
         ],
      })
      // }
      return true
   } catch (error) {
      console.error('scheduleNotification', error.message)
      return false
   }
}

export default boot(async ({ app }) => {
   if (Platform.is.capacitor) {
      try {
         // const { PushNotifications } = Plugins
         if (!Capacitor.isPluginAvailable('PushNotifications')) {
            console.error('PushNotifications are not available')
            return null
         }

         const perm = await PushNotifications.requestPermissions()
         console.log('boot', 'push-notifications', 'perm', perm)

         if (perm.receive !== 'granted') {
            console.log('PushNotifications permission not granted')
            return null
         }

         await PushNotifications.register()

         const fcmToken = await FCM.getToken()
         console.log('fcmToken', fcmToken)

         PushNotifications.addListener('registration', (token) => {
            console.log('boot', 'push-notifications', 'registration', token)
            LocalStorage.set('deviceToken', token.value)
         })

         PushNotifications.addListener('registrationError', (error) => {
            alert(`Error on registration: ${JSON.stringify(error)}`)
         })

         PushNotifications.addListener(
            'pushNotificationReceived',
            (notification) => {
               console.log(
                  `Notification received: ${JSON.stringify(notification)}`
               )
               scheduleLocalNotification({
                  title: notification.title,
                  body: notification.body,
                  id: new Date().valueOf(),
                  schedule: { at: new Date(Date.now() + 5000) },
               })
            }
         )
      } catch (error) {
         console.error('boot', 'push-notifications', error.message)
      }
   }
})
