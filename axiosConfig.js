import axios from "axios";

// Create an instance of Axios with a base URL
const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_ENV === "production"
      ? "https://api.remino.ir/api"
      // : "https://dev-api.remichange.ir/api",
      : "https://api.demo.remito.ir/api",
});

// Utility function to construct the URL
const constructUrl = (endpoint, version) => {
  let baseUrl =
    process.env.NEXT_PUBLIC_ENV === "production"
      ? "https://api.remino.ir"
      : // : "https://dev-api.remichange.ir";
        "https://api.demo.remito.ir/api";

  if (version) {
    return `${baseUrl}/${version}/api/${endpoint}`;
  } else {
    return `${baseUrl}/api/${endpoint}`;
  }
};

export { axiosInstance, constructUrl };
