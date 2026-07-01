import axios from "axios";
import { resolveApiBaseUrl } from "@/lib/apiUrl";

/** Javni API pozivi — bez Authorization headera (gosti, izvođači listing). */
const publicApi = axios.create({
  timeout: 20_000,
});

publicApi.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseUrl();
  return config;
});

export default publicApi;
