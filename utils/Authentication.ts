import axios from 'axios'




export const getJwtToken = async (email: string, password: string) => {
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
