import ky from "ky";

const BASE_URL = process.env.VUE_APP_API_BASE;

const deleteBugById = async (bugId) => {
  return await ky.delete(`${BASE_URL}/bugs/${bugId}`).json();
};

const retestBugById = async (bugId) => {
  return await ky
    .post(`${BASE_URL}/bugs/${bugId}/test`, { timeout: 100000 })
    .json();
};

const commentBugById = async (bugId, comment) => {
  return await ky
    .post(`${BASE_URL}/bugs/${bugId}/comments`, {
      json: {
        comment,
      },
    })
    .json();
};

export { deleteBugById, retestBugById, commentBugById };
