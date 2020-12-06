import ky from "ky";

const BASE_URL = process.env.VUE_APP_API_BASE;

const login = async (email, password) => {
  const authString = btoa(`${email}:${password}`);

  return await ky
    .post(`${BASE_URL}/login`, {
      headers: {
        "Authorization": `Basic ${authString}`
      }
    })
    .json();
};

const register = async (email, password) => {
  return await ky
    .post(`${BASE_URL}/register`, {
      json: {
        email: email,
        password: password
      }
    })
    .json();
}

export { login, register };
