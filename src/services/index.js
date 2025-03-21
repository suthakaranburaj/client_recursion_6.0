const VITE_SERVER_URL = "http://localhost:5001/api/v1";
console.log(VITE_SERVER_URL);
const AUTH = `${VITE_SERVER_URL}/user`;

const EMAIL = `${VITE_SERVER_URL}/email`;

const STATEMENT = `${VITE_SERVER_URL}/statements`

const NOTIFICATION = `${VITE_SERVER_URL}/notification`

export { AUTH, EMAIL, STATEMENT, NOTIFICATION };