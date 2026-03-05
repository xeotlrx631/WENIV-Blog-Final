import client from "./client";

// 1. 블로그 목록 가져오기 (GET)
export const getBlogList = async () => {
  const response = await client.get("/blog");
  return response.data;
};

// 2. 로그인 하기 (POST)
export const loginUser = async (userData) => {
  const response = await client.post("/login", userData);
  return response.data;
};
