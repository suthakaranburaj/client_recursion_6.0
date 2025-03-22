const VITE_SERVER_URL = "http://localhost:5001/api/v1";
console.log(VITE_SERVER_URL);
const AUTH = `${VITE_SERVER_URL}/user`;

const EMAIL = `${VITE_SERVER_URL}/email`;

const STATEMENT = `${VITE_SERVER_URL}/statements`

const NOTIFICATION = `${VITE_SERVER_URL}/notification`

const TRANSACTION = `${VITE_SERVER_URL}/statements`

const FORCAST = `http://127.0.0.1:8000/api/predict-spends/`;

export { AUTH, EMAIL, STATEMENT, NOTIFICATION,TRANSACTION, FORCAST };