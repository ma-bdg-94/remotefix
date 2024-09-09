import axios, { AxiosInstance } from "axios";

export const menuItemInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:7200/api/menuItems",
  withCredentials: true,
});
