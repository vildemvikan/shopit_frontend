import axios from 'axios';
import { useTokenStore } from '@/stores/tokenStore';
const baseURL = 'http://127.0.0.1:8080/bookmark'

export async function fetchUserBookmarks(size: number, page:number, field:string, direction:string){
  const url = baseURL + '/me'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.get(url, {
      params:{
        size: size,
        page: page,
        sortDir: direction,
        sortField: field
      }, headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response.data)
    return response.data
  }catch (error){
    throw error
  }
}

export async function createBookmark(id: string){
  const url = baseURL + '/' + id
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  if(!token){
    return 401
  }
  try{
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.status)
    return response.status
  } catch (error){
    console.log(error)
    return new Error("Error! Could not bookmark advertisement!")
  }
}

export async function deleteBookmark(id:string){
  const url = baseURL + '/' + id
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  if(!token){
    return 401
  }
  try{
    const response = await axios.delete(url, {
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.status)
    return response.status
  } catch (error){
    console.log(error)
    return new Error ("Error! Could not delete bookmark!")
  }
}
