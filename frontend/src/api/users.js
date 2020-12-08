const register = async (email, password) => {
  return await ky
    .post(`${BASE_URL}/register`, {
      json: {
        email,
        password,
      },
    })
    .json();
};
