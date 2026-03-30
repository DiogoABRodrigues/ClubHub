import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.105:3000/api/",
  timeout: 5000,
});

export const scrapperApi = axios.create({
  baseURL: "http://192.168.1.105:3000/api/",
  timeout: 300000,
});
