import axios from 'axios';
import type { Status } from '@/enums/enums.ts'

const baseURL = 'http://127.0.0.1:8080'
const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGZhbnQub3JnIiwiaWF0IjoxNzQzNjgxNjQ1LCJleHAiOjE3NDM2ODM0NDV9.4KDBK2B4OlBfZFphfRkdZAVXGQibgsrPJR3xTiuy_DFBUN-2CV1yXsAh7xCQaBu7iEC04WTgjsF2k9BiLHF-jA"
export async function fetchUserInformation(){
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
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch user information.")
  }
}

export async function fetchUserAdvertisements(size: number, page: number,
                                              date: number, status: Status|null){
  const url = baseURL + '/items/me'
  let sortDir = 'desc'
  if(date == 2){ sortDir = 'asc' }
  try{
    const response = await axios.get(url, {
      params: {
        size: size,
        page: page,
        sortDir: sortDir,
        status: status
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response.data)
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch user information.")
  }
}



export async function updateProfilePicture(base64Url: string){
  const url = baseURL + '/profilePicture'
  console.log("BASE" + base64Url)
  try{
    const response = await axios.post(url, {url: base64Url},{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response.status)
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch user information.")
  }
}

export async function changePassword(oldPassword: string, newPassword: string){
  const url = baseURL + '/updatePassword'
  try{
    const response = await axios.put(url,
      {
      currentPassword: oldPassword,
      newPassword: newPassword},
      {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.status
  } catch (error){
    throw new Error('Error! Cannot update password!')
  }
}
