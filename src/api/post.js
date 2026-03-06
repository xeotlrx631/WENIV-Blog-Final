import axios from "axios";
import { apiClient } from "./client";

export const createPost = async (title, content) => {
  const response = await apiClient.post(`/1/blog`, { title, content });
  return response.data;
};

export const getPosts = async () => {
  const response = await apiClient.get(`/1/blog`);
  return response.data.data || response.data;
};

export const getPostById = async (id) => {
  const response = await apiClient.get(`/1/blog/${id}`);
  return response.data.data || response.data;
};

export const deletePostById = async (id) => {
  const response = await apiClient.delete(`/1/blog/${id}`);
  return response.data;
};

export const updatePost = async (id, title, content) => {
  const response = await apiClient.put(`/1/blog/${id}`, { title, content });
  return response.data;
};

// [AI 이어쓰기] - 리다이렉트 원천 봉쇄 버전
export const continueWriting = async (content) => {
  // 1. apiClient를 쓰지 않고 쌩 axios를 씁니다. (CORS 에러 회피용)
  // 2. 서버가 내부적으로 리다이렉트 시키려는 '진짜 종착역' 주소입니다.
  // 3. 주소 앞에 services/fastapi-crud를 빼고 전송합니다.
  const response = await axios.post(
    `https://dev.wenivops.co.kr/1/blog/ai`,
    { content: content },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );

  console.log("드디어 성공한 AI 응답:", response.data);
  return response.data.continuation || response.data.result || response.data;
};
