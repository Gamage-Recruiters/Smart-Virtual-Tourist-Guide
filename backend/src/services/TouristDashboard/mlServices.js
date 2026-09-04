import axios from "axios";

const ML_BASE_URL = process.env.ML_API_URL || "http://localhost:5001";
const ML_TIMEOUT  = parseInt(process.env.ML_TIMEOUT_MS) || 8000;

const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  timeout: ML_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

mlClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNREFUSED") {
      const e = new Error("ML service is not running. Start the Flask API on port 5001.");
      e.statusCode = 503;
      return Promise.reject(e);
    }
    if (err.code === "ECONNABORTED") {
      const e = new Error("ML service timed out.");
      e.statusCode = 504;
      return Promise.reject(e);
    }
    return Promise.reject(err);
  }
);

export default mlClient;