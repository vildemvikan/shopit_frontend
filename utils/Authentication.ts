import axios from 'axios'




export const getTokens = async (email: string, password: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios.post(
    `http://localhost:8080/auth/login`,
    { email, password },
    config
  );
};

export const registerUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  return axios.post(
    'http://localhost:8080/auth/register',
    { email, firstName, lastName, password },
    config
  );
};


export const sendResetEmail = async (email: string) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await axios.post(
      'http://localhost:8080/auth/forgot-password',
      { email },
      config
    );
    return response;
  } catch (error: any) {
    console.error("Failed to send reset email:", error.response?.data || error.message);
    throw error; // rethrow so the frontend can handle it if needed
  }
};

export const validateResetToken = async (
  token: string,
  email: string
): Promise<{ valid: boolean; message: string }> => {
  try {
    const response = await axios.get('http://localhost:8080/auth/validate-reset-token', {
      params: { token, email },
    });
    return response.data;
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
};

export const resetPasswordWithToken = async (
  token: string,
  email: string,
  newPassword: string
) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await axios.post(
      'http://localhost:8080/auth/reset-password',
      { token, email, newPassword },
      config
    );

    return response;
  } catch (error: any) {
    console.error("Password reset failed:", error.response?.data || error.message);
    throw error;
  }
};
export const refreshToken = async (
    token: string
  ) => {
    const config = {
      headers: {"Content-Type": "application/json" },
    };
    try {
      const response = await axios.post(
        'http://localhost:8080/auth/refresh',
        { token},
        config
      );
      return response;
    } catch(error: any) {
      console.error("Failed on refreshing error", error)
      throw error;
    }
  }

