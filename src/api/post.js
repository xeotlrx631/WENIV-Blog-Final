import { apiClient } from "./client";

// 1. 게시글 생성 (Post-Write에서 사용)
export const createPost = async (title, content) => {
  const response = await apiClient.post(`/1/blog`, { title, content });
  return response.data;
};

// 2. 게시글 목록 가져오기
export const getPosts = async () => {
  const response = await apiClient.get(`/1/blog`);
  return response.data.data || response.data;
};

// 3. 게시글 상세 가져오기 (문자열 ID 대응)
export const getPostById = async (id) => {
  const response = await apiClient.get(`/1/blog/${id}`);
  return response.data.data || response.data;
};

// 4. 게시글 삭제 (문자열 ID 대응)
export const deletePostById = async (id) => {
  const response = await apiClient.delete(`/1/blog/${id}`);
  return response.data;
};

// 5. 게시글 수정 (문자열 ID 대응)
export const updatePost = async (id, title, content) => {
  const response = await apiClient.put(`/1/blog/${id}`, { title, content });
  return response.data;
};

// 6. AI 이어쓰기
export const continueWriting = async (content) => {
  const response = await apiClient.post(`/1/ai/continue`, { content });
  const result =
    response.data.result ||
    response.data.continuation ||
    response.data.data ||
    response.data;
  return result;
};
