import ky from "ky";

import * as types from "@/store/types";

const BASE_URL = process.env.VUE_APP_API_BASE;

const initialState = {
  bugs: [],
};

const getters = {
  [types.GET_BUGS]: (state) => state.bugs,
};

const mutations = {
  [types.SET_BUGS](state, bugs) {
    state.bugs = [...bugs];
  },
};

const actions = {
  async getAllBugs({ commit, rootState }) {
    try {
      const data = await ky.get(`${BASE_URL}/bugs`).json();

      commit(types.SET_BUGS, data);
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
