import axios from 'axios';

const baseURL = 'http://127.0.0.1:8080/categories'

export async function fetchCategories(){
  try{
    const response = await axios.get(baseURL, {
      params: {
        includeSubCategories: false
      }
    })
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch categories.")
  }
}

export async function fetchCategoriesWithSubCategories(){
  try{
    const response = await axios.get(baseURL, {
      params: {
        includeSubCategories: true
      }
    })
    return await response.data
  } catch (error){
    console.error(error)
    return new Error("Error! Could not fetch categories with sub-categories.")
  }
}
