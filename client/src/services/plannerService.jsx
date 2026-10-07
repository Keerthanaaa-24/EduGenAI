import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://edugenai-8ix8.onrender.com"
).replace(/\/+$/, "");

const API = `${BASE_URL}/api/planner`;

/*
==========================================
GENERATE MINI STUDY PLAN
==========================================
*/

export const generatePlan =
  async (
    subject,
    days,
    hoursPerDay,
    startTime,
    documentId,
    language = "English"
  ) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.post(
        `${API}/generate`,
        {
          subject,
          days,
          hoursPerDay,
          startTime,
          documentId,
          language,
        },
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
==========================================
GET USER'S SAVED PLANS
==========================================
*/

export const getPlans =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.get(
        `${API}/my-plans`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };