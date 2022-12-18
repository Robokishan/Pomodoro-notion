import axios, { AxiosError, AxiosRequestConfig } from "axios";

const PomodoroClient = axios.create();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseErrorCodeV1 = (error: AxiosError) => {
  return Promise.reject(error);
};

// Request parsing interceptor
const notionRequestInterceptor = (
  config: AxiosRequestConfig
): AxiosRequestConfig => {
  config.url = "/notion" + config.url;
  return config;
};

// Request parsing interceptor
PomodoroClient.interceptors.request.use(notionRequestInterceptor, (error) => {
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
