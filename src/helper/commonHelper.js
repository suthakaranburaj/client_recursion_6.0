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
export { asyncHandler, getCookie };
