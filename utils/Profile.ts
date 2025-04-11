import axios from 'axios';
import type { Status } from '@/enums/enums.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'

const baseURL = 'http://127.0.0.1:8080'

export async function fetchUserInformation(){
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  const url = baseURL + '/me'
  try{
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch user information.")
  }
}

export async function fetchUserAdvertisements(size: number, page: number,
                                              date: number, status: Status|null){
  const url = baseURL + '/items/me'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
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
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch user information.")
  }
}

export async function updateProfilePicture(base64Url: string){
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  const url = baseURL + '/profilePicture'
  try{
    const response = await axios.post(url, {url: base64Url},{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch user information.")
  }
}

export async function changePassword(oldPassword: string, newPassword: string){
  const url = baseURL + '/updatePassword'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
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

export async function deleteUser(){
  const url = baseURL + '/me'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.delete(url,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, withCredentials: true,
    })
    return response.status
  } catch (error){
    console.error(error)
    throw Error("Error! Could not fetch user information.")
  }
}
