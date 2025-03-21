import axios from "axios";
const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error if needed
    }
  };
};
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  // console.log(document.cookie)
  const parts = value.split(`; ${name}=`);
  // console.log(parts)
  if (parts.length === 2) return parts.pop().split(";").shift();
};


export const apiClient = {
  get: async (url, headers = {}) => {
    return axios.get(url, {
      headers,
      withCredentials: true
    });
  },

  post: async (url, data, headers = {}) => {
    if (data instanceof FormData) {
      delete headers["Content-Type"];
    } else if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    return axios.post(url, data, {
      headers,
      withCredentials: true
    });
  }

  // Add other methods (put, delete) as needed
};

export { asyncHandler, getCookie };
