import axios from "axios";

const api = axios.create({
  baseURL: "http://20.207.122.201/evaluation-service",
});

export default api;