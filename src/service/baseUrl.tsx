import axios from 'axios';
// Set config defaults when creating the instance
const config = {
  baseURL: 'https://8a11-117-20-115-220.ap.ngrok.io/api/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
};
export const instance = axios.create({
  ...config,
});
