import axios from 'axios'
import { useTokenStore } from '@/stores/tokenStore.ts'


const baseURL = "http://127.0.0.1:8080/notifications"

export async function getNotification(page: number = 0, size: number = 3) {
  const url = `${baseURL}/me`
  const tokenStore = useTokenStore();
  const token: string | null  = tokenStore.getToken;
  console.log(token)
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: {
        page,
        size
      }
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return new Error("Error! Could not fetch user notification.")
  }
}
export async function deleteNotification(id: number) {
  const url = `${baseURL}/${id}`
  const tokenStore = useTokenStore();
  const token: string | null  = tokenStore.getToken;
  try {
    await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return true
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error)
    return new Error("Error! Could not delete notification.")
  }
}

export async function deleteAllNotifications() {
  const url = baseURL + '/me'
  const tokenStore = useTokenStore();
  const token: string | null  = tokenStore.getToken;
  try {
    await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return true
  } catch (error) {
    console.error('Error deleting all notifications:', error)
    return new Error("Error! Could not delete all notifications.")
  }
}
