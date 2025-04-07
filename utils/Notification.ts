import axios from 'axios'

const token = ''
const baseURL = "http://127.0.0.1:8080/notification"
export async function getNotification() {
  const url = baseURL + '/me'
  try{
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response.data)
    return await response.data
  } catch (error) {
    console.log(error)
    return new Error("Error! Could not fetch user notification.")

  }
}
export async function deleteNotification(id: number) {
  const url = `${baseURL}/${id}`
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
