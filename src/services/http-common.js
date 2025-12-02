import axios from 'axios';
import config from '../config/index';
export const fetchRequest = (methodStr, endpointURL, headers, payload = {}) => {
  return fetch(endpointURL, {
    method: methodStr,
    headers,
    body: JSON.stringify(payload),
  });
};

export default axios.create({
  baseURL: `${config.apiUrl}`,
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});
