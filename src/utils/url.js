import axios from "axios";

export const URL = import.meta.env.VITE_API;

function saveToken(token) {
  localStorage.setItem("token", token);
}

export const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, 
  },
});



export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
});


export { saveToken };