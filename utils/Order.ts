import axios from 'axios';
import { useTokenStore } from '@/stores/tokenStore';
const baseURL = 'http://127.0.0.1:8080/order'

export async function placeOrder(itemId:string){
  const url = baseURL + '/create'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.post(url, {
      itemId: itemId
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

export async function getOrderById(orderId:string){
  const url = baseURL + '/' + orderId
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.get(url,{
      headers: {
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
