import axios from 'axios';

const baseURL = 'http://127.0.0.1:8080'

const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGZhbnQub3JnIiwiaWF0IjoxNzQzMjczNjQ2LCJleHAiOjE3NDMyNzU0NDZ9.4iJVzjeoRWVWPx9SXPWQtp1NZCKwGO_KztAtWwa-iIEKLRD6plIGtsrLKZ2dpxSbR5ecx8nAfiiIUmf7m4MRyg'
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
    const response = await axios.get(url)
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch advertisement.")
  }
}

export async function createAdvertisement(data: string){
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
