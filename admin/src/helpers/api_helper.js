import axios from "axios";
import { api } from "../config";

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
// credentials
axios.defaults.withCredentials = true;

// axios.defaults.headers["Access-Control-Allow-Origin"] = true;

const urlRefreshToken = "/api/v1/users/refresh-token";
// content type
const dataJson = sessionStorage?.getItem("authUser");

const token = JSON.parse(dataJson || "null")
  ? JSON.parse(dataJson || "null")?.accessToken
  : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  // get = (url, params) => {
  //   return axios.get(url, params);
  // };

  get = async (url, params) => {
    let response;

    let paramKeys = [];
    const token = JSON.parse(localStorage.getItem("authUser"))
      ? JSON.parse(localStorage.getItem("authUser")).jwtToken
      : null;
    if (token)
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });
      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      axios
        .get(`${url}?${queryString}`, params)
        .then(function (res) {
          response = res;
        })
        .catch(function (error) {
          if (error === "'Request failed with status code 401'") {
            var abc = true;
          }
        });
      //return response;
    } else {
      await axios
        .get(`${url}`, params)
        .then(function (res) {
          response = res;
        })
        .catch(function (error) {
          if (error === "Request failed with status code 401") {
            axios
              .post(`${urlRefreshToken}`, null)
              .then((res) => {
                localStorage.setItem("authUser", JSON.stringify(res));
              })
              .catch((err) => {
                var cb = true;
              });
          }
        });
    }
    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
  createWithFormData = (url, data) => {
    // console.log(data);
    const formData = new FormData();
    formData.append("tax_description", data.tax_description);
    formData.append("tax_name", data.tax_name);
    formData.append("tax_parent", data.tax_parent);
    formData.append("tax_slug", data.tax_slug);
    formData.append("tax_type", data.tax_type);
    return axios.post(url, formData, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  };
  updateWithFormData = (url, data) => {
    let formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    // formData.append('tax_description', data.tax_description);
    // formData.append('tax_name', data.tax_name);
    // formData.append('tax_parent', data.tax_parent);
    // formData.append('tax_slug', data.tax_slug);
    // formData.append('tax_type', data.tax_type);
    return axios.put(url, formData, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
