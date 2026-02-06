import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const PomodoroClient = axios.create();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseErrorCodeV1 = (error: AxiosError) => {
  return Promise.reject(error);
};

// Request parsing interceptor
const pomoRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (!config.baseURL) config.baseURL = window.location.origin;
  config.withCredentials = true;
  return config;
};

// Request parsing interceptor
PomodoroClient.interceptors.request.use(pomoRequestInterceptor, (error) => {
  console.error("[REQUEST_ERROR]", error);
  return Promise.reject(error);
});

// Response parsing interceptor
PomodoroClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return parseErrorCodeV1(error);
  }
);
export default PomodoroClient;
