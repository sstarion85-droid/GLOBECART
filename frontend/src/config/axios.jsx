import axios from "axios";

// ✅ Create a single axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // change later if your backend URL differs
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Define API helper methods
const API = {
  signupStart: async (data) => {
    return apiClient.post("/signup", data);
  },

  login: async (data) => {
    return apiClient.post("/login", data);
  },
};

// ✅ Export correctly so others can import it
export default API;
