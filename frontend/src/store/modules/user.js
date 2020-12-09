import ky from "ky";

import * as types from "@/store/types";

const BASE_URL = process.env.VUE_APP_API_BASE;

const initialState = {
  token: null,
  userData: null,
};

const getters = {};

const mutations = {
  [types.SET_TOKEN](state, token) {
    state.token = token;
  },

  [types.SET_USER](state, user) {
    state.userData = {
      ...user,
    };
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const data = await ky
        .post(`${BASE_URL}/login`, {
          json: {
            email,
            password,
          },
        })
        .json();

      commit(types.SET_USER, data.data.user);
      commit(types.SET_TOKEN, data.data.token);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
};

export default {
  state: initialState,
  getters,
  mutations,
  actions,
};
