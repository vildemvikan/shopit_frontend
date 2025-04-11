import axios from 'axios';
import { Condition, County, Status } from '@/enums/enums.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'

const baseURL = 'http://127.0.0.1:8080'

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

export async function fetchAdvertisement(id: string) {
  const url = baseURL + '/items/' + id;
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  }; if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    return new Error("Error! Could not fetch advertisement.");
  }
}

export async function fetchNewestAdvertisements(size: number){
  const url = baseURL + '/items'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  }; if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try{
    const response = await axios.get(url, {
      params: {
        page: 0,
        size: size
      },
      headers
    });
    return response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch advertisements.")
  }
}

export async function searchAdvertisements(
  size: number,
  page: number,
  keyword: string|null,
  categoryId:number|null,
  subCategoryId:number|null,
  conditions: string[]|null,
  counties: string[]|null,
  minPrice: number|null,
  maxPrice: number|null,
  forSale: boolean|null,
  publishedToday: boolean|null,
  field: string,
  direction: string
){

  const url = baseURL + '/items/search'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  }; if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try{
    const response = await axios.get(url, {
      params: {
        page: page,
        size: size,
        keyword: keyword,
        categoryId:categoryId,
        subCategoryId:subCategoryId,
        condition: conditions ? conditions.join(',') : null,
        county: counties ? counties.join(',') : null,
        maxPrice: maxPrice,
        minPrice:minPrice,
        forSale: forSale,
        onlyToday: publishedToday,
        sortField: field,
        sortDir: direction
      },headers
    });
    return response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch advertisements.")
  }
}

export async function createAdvertisement(data: string){
  const url = baseURL + '/items'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status
  } catch (error){
    return new Error("Error! Could not create advertisement!")
  }
}

export async function updateAdvertisement(data: string, id:string){
  const url = baseURL + '/items/' + id
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status
  } catch (error){
    return new Error("Error! Could not update advertisement!")
  }
}

export async function changeStatus(status: Status, id: string){
  const url = baseURL + '/items/' + id + '/status'
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.put(url, {status: status}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.status
  } catch (error){
    return new Error("Error! Could not update status for advertisement!")
  }
}

export async function deleteAdvertisement(id:string){
  const url = baseURL + '/items/' + id
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try{
    const response = await axios.delete(url, {
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status
  } catch (error){
    return new Error ("Error! Could not delete advertisement!")
  }
}
