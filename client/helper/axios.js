import axios from "axios";
export const getInstance = () => {
  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("accessToken"))
      : null;

  const instance = axios.create({
    baseURL: "https://api.trafficsseo.com",
    // baseURL: "http://localhost:3003",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        if (typeof window !== "undefined") {
          // localStorage.removeItem("accessToken");
          // localStorage.removeItem("authUser");
          // window.history.pushState({}, "", "/");
          // window.location.reload();
        }
      }
    }
  );

  return instance;
};

export const getInstanceCheckAuth = () => {
  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("accessToken"))
      : null;

  const instance = axios.create({
    baseURL: "https://api.trafficsseo.com",
    // baseURL: "http://localhost:3003",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
};
