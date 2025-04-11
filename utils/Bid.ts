import axios from 'axios';
import { useTokenStore } from '@/stores/tokenStore';
const baseURL = 'http://127.0.0.1:8080/bids'

export async function placeBid(itemId:string, amount:number){
  const url = baseURL
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.post(url, {
      itemId: itemId,
      amount: amount
    },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.status
  }catch (error){
    throw error
  }
}

export async function getBidFromId(id:string){
  const url = baseURL + '/bid/' + id
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.get(url,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  }catch (error){
    throw error
  }
}

export async function acceptBid(id:string){
  const url = baseURL + '/' + id + '/accept'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.post(url,{},{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.status
  }catch (error){
    throw error
  }
}

export async function rejectBid(id:string){
  const url = baseURL + '/' + id + '/reject'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.post(url,{},{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.status
  }catch (error){
    throw error
  }
}


