import axios from 'axios';
import {Status} from '@/enums/enums.ts'

const baseURL = 'http://127.0.0.1:8080'

const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGZhbnQub3JnIiwiaWF0IjoxNzQzNjc5NzM2LCJleHAiOjE3NDM2ODE1MzZ9.dB81TmEtavZXRPOMe1z_EeRpnjvE72zxcFUSIH_vRPF4R_DvHQOz2pf0X4nPBtRqGuoReQ5IkU_AdzkzfNXc3A'
export async function fetchPostalCodeInfo(postalCode: string): Promise<any> {
  const url = `https://api.bring.com/address/api/open/postalCode/postalCode.json?pnr=${postalCode}&country=NO`;
  try {
    const response = await axios.get(url)
    return response.data;
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function fetchCategories(){
  const url = baseURL + '/categories'
  try{
    const response = await axios.get(url)
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch categories.")
  }
}

export async function fetchAdvertisement(id:string){
  const url = baseURL + '/items/' + id
  try{
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data)
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch advertisement.")
  }
}

export async function advertisement(data: string){
  const url = baseURL + '/items'
  try{
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status
  } catch (error){
    console.log(error)
    return new Error("Error! Could not create advertisement!")
  }
}

export async function updateAdvertisement(data: string, id:string){
  const url = baseURL + '/items/' + id
  try{
    const response = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.status)
    return response.status
  } catch (error){
    console.log(error)
    return new Error("Error! Could not update advertisement!")
  }
}

export async function changeStatus(status: Status, id: string){
  const url = baseURL + '/items/' + id + '/status'
  try{
    const response = await axios.put(url, {status: status}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response.status)
    return response.status
  } catch (error){
    console.log(error)
    return new Error("Error! Could not update status for advertisement!")
  }
}

export async function deleteAdvertisement(id:string){
  const url = baseURL + '/items/' + id
  console.log(url)
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
    return new Error ("Error! Could not delete advertisement!")
  }
}
