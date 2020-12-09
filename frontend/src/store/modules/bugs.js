import ky from "ky";

import * as types from "@/store/types";

const BASE_URL = process.env.VUE_APP_API_BASE;

const initialState = {
  bugs: [],
};

const getters = {
  [types.GET_BUGS]: (state) => state.bugs,
  [types.GET_BUG_BY_ID]: (state) => (id) =>
    state.bugs.find((x) => x._id === id),
};

const mutations = {
  [types.SET_BUGS](state, bugs) {
    state.bugs = [...bugs];
  },

  [types.UPDATE_BUG_OR_INSERT](state, bug) {
    const index = state.bugs.findIndex((x) => x._id === bug._id);

    if (index) {
      state.bugs.splice(index, 1, {
        ...bug,
      });

      return;
    }

    // Insert if doesnt exit
    state.bugs.push(bug);
  },
};

const actions = {
  async getAllBugs({ commit }) {
    try {
      const data = await ky.get(`${BASE_URL}/bugs`).json();

      commit(types.SET_BUGS, data);
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async loadBugById({ commit }, id) {
    try {
      const bug = await ky.get(`${BASE_URL}/bugs/${id}`).json();

      commit(types.UPDATE_BUG_OR_INSERT, bug);

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
