import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const NotionClient = axios.create();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseErrorCodeV1 = (error: AxiosError) => {
  return Promise.reject(error);
};

// Request parsing interceptor
const notionRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  config.url = "/notion" + config.url;
  return config;
};

// Request parsing interceptor
NotionClient.interceptors.request.use(notionRequestInterceptor, (error) => {
  console.error("[REQUEST_ERROR]", error);
  return Promise.reject(error);
});

// Response parsing interceptor
NotionClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return parseErrorCodeV1(error);
  }
);
export default NotionClient;
