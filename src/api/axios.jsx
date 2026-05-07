import axios from "axios";

// const BASE_URL = "http://localhost:3500";
// const BASE_URL = "https://lumcore-api.onrender.com/";
const BASE_URL = "https://lumcore-lhboi.ondigitalocean.app/";

export default axios.create({
	baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});
