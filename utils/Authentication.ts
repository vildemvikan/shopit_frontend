import axios from 'axios'

const baseUrl = 'http://localhost:8080/auth'

export async function getToken(email: string, password: string) {
  const url = baseUrl + '/login'
  try{
    const result = await axios.post(url, { email, password }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    ); console.log(result)
    return result.data
  } catch (error){
    throw error
  }
}

export async function registerUser(email: string, firstName: string,
                                   lastName: string, password: string)  {
  const url = baseUrl + '/register'
  try {
    const result =  await axios.post(url, { email, firstName, lastName, password }, {
        headers: {
          "Content-Type": "application/json"
        }, withCredentials: true
      }
    ); console.log(result)
    return result
  } catch (error) {
    throw error;
  }
}

export async function logout(accessToken: string){
  const url = baseUrl + '/logout'
  try{
    const result = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }, withCredentials: true
    }); console.log(result)
    return result.status
  } catch (error){
    throw error
  }
}

export const sendResetEmail = async (email: string) => {
  const url = baseUrl + '/forgot-password'
  try {
    const result =  await axios.post( url, { email }, {
      headers: { "Content-Type": "application/json" }
    })
    console.log(result)
    return(result)
  } catch (error: any) {
    console.error("Failed to send reset email:", error.response?.data || error.message);
    throw error;
  }
};

export async function validateResetToken(token: string, email: string):
  Promise<{ valid: boolean; message: string }> {
  const url = baseUrl + '/validate-reset-token'
  try {
    const result = await axios.get(url, {
      params: { token, email },
    });
    console.log(result)
    return result.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      return {
        valid: false,
        message: 'Unknown error occurred while validating token.',
      };
    }
  }
}

export async function resetPasswordWithToken(token: string,
                                             email: string,
                                             newPassword: string) {
  const url =  baseUrl + '/reset-password'
  try {
    const response = await axios.post(url,
      {token, email, newPassword},  {
        headers: { "Content-Type": "application/json" },
      }
    ); console.log(response)
    return response;
  } catch (error: any) {
    console.error("Password reset failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function refreshToken() {
  const url = baseUrl + '/refresh'
  try {
    const response = await axios.post(url, {}, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}
