// src/api/auth.js
import { apiClient } from "./client"; // authClient 대신 apiClient 사용 (JSON 헤더 설정됨)

export const registerUser = async (username, password) => {
  // 1. URLSearchParams를 쓰지 않고 일반 객체({ })를 보냅니다.
  // 2. 경로를 "/1/signup" (소문자)으로 명시합니다.
  return await apiClient.post("/1/signup", {
    username: username,
    password: password,
  });
};

export const loginUser = async (username, password) => {
  // 로그인도 동일하게 JSON 형식을 기대할 가능성이 높습니다.
  return await apiClient.post("/1/login", {
    username: username,
    password: password,
  });
};
