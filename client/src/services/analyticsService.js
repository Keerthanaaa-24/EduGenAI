import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://edugenai-8ix8.onrender.com"
).replace(/\/+$/, "");

const API = `${BASE_URL}/api/analytics`;

/*
==================================================
GET DASHBOARD / ANALYTICS DATA
==================================================
*/

export const getAnalytics =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.get(
        `${API}/dashboard`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

/*
==================================================
CLEAR RECENT ACTIVITY
==================================================
*/

export const clearActivities =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.delete(
        `${API}/activity`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };