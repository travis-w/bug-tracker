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

    if (index !== -1) {
      state.bugs.splice(index, 1, {
        ...bug,
      });

      return;
    }

    // Insert if doesnt exit
    state.bugs.push(bug);
  },

  [types.REMOVE_BUG](state, bugId) {
    const index = state.bugs.findIndex((x) => x._id === bugId);

    if (index !== -1) {
      state.bugs.splice(index, 1);
      return;
    }
  },

  [types.ADD_TEST_TO_BUG](state, { bugId, test }) {
    const index = state.bugs.findIndex((x) => x._id === bugId);
    const bug = state.bugs[index];

    if (index !== -1) {
      state.bugs.splice(index, 1, {
        ...bug,
        testResults: [{ ...test }, ...bug.testResults],
      });
    }
  },

  [types.ADD_COMMENT_TO_BUG](state, { bugId, comment }) {
    const index = state.bugs.findIndex((x) => x._id === bugId);
    const bug = state.bugs[index];

    if (index !== -1) {
      state.bugs.splice(index, 1, {
        ...bug,
        comments: [{ ...comment }, ...bug.comments],
      });
    }
  },

  [types.UPDATE_BUG_STATUS](state, { bugId, status }) {
    const index = state.bugs.findIndex((x) => x._id === bugId);
    const bug = state.bugs[index];

    if (index !== -1) {
      state.bugs.splice(index, 1, {
        ...bug,
        status: status,
      });
    }
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

  async deleteBugById({ commit, rootState }, id) {
    try {
      await ky
        .delete(`${BASE_URL}/bugs/${id}`, {
          headers: {
            Authorization: `Bearer ${rootState.user.token}`,
          },
        })
        .json();

      commit(types.REMOVE_BUG, id);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async retestBugById({ commit, rootState }, id) {
    try {
      let results = await ky
        .post(`${BASE_URL}/bugs/${id}/test`, {
          timeout: 100000,
          headers: {
            Authorization: `Bearer ${rootState.user.token}`,
          },
        })
        .json();

      // Update results in store
      commit(types.ADD_TEST_TO_BUG, { bugId: id, test: results });
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async commentBugById({ commit, rootState }, { bugId, comment }) {
    try {
      let results = await ky
        .post(`${BASE_URL}/bugs/${bugId}/comments`, {
          headers: {
            Authorization: `Bearer ${rootState.user.token}`,
          },
          json: {
            comment,
          },
        })
        .json();

      // Push comment here
      console.log(bugId, results.data);
      commit(types.ADD_COMMENT_TO_BUG, { bugId, comment: results.data });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async createNewBug({ commit, rootState }, bug) {
    try {
      let result = await ky
        .post(`${BASE_URL}/bugs`, {
          headers: {
            Authorization: `Bearer ${rootState.user.token}`,
          },
          json: {
            ...bug,
          },
          timeout: 60000,
        })
        .json();

      return result;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async updateBugStatus({ commit, rootState }, { bugId, status }) {
    try {
      let result = await ky
        .patch(`${BASE_URL}/bugs/${bugId}`, {
          headers: {
            Authorization: `Bearer ${rootState.user.token}`,
          },
          json: {
            status,
          },
        })
        .json();

      commit(types.UPDATE_BUG_STATUS, { bugId, status });

      return result;
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
