const VITE_SERVER_URL = "http://localhost:5001/api/v1";
console.log(VITE_SERVER_URL);
const AUTH = `${VITE_SERVER_URL}/user`;

const EMAIL = `${VITE_SERVER_URL}/email`

export { AUTH, EMAIL };