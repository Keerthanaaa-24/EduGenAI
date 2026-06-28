import axios from "axios";
const API =
  "http://localhost:5000/api/planner";

export const generatePlan =
  async (
    subject,
    examDate,
    hoursPerDay,
    documentId
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
          examDate,
          hoursPerDay,
          documentId,
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
