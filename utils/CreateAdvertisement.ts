
export async function fetchPostalCodeInfo(postalCode: string): Promise<any> {
  const url = `https://api.bring.com/address/api/open/postalCode/postalCode.json?pnr=${postalCode}&country=NO`;
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.log(response)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}
