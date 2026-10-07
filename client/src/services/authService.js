import axios from "axios";
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://edugenai-8ix8.onrender.com"
).replace(/\/+$/, "");

const API = `${BASE_URL}/api/auth`;

export const loginUser =
  async (userData) => {
    const response =
      await axios.post(
        `${API}/login`,
        userData
      );

    return response.data;
  };

export const registerUser =
  async (userData) => {
    const response =
      await axios.post(
        `${API}/register`,
        userData
      );

    return response.data;
  };
