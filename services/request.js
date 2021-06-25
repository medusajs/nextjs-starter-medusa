import axios from "axios";

const STORE_URL = process.env.GATSBY_STORE_URL || "http://localhost:4000";

const client = axios.create({
  baseURL: STORE_URL,
});

export default function medusaRequest(method, path = "", payload = {}) {
  const options = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
    json: true,
  };
  return client(options);
}
