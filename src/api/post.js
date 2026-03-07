import { apiClient } from "./client";

export const createPost = async (title, content) => {
  const response = await apiClient.post(`/1/blog`, { title, content });
  return response.data;
};

export const getPosts = async () => {
  const response = await apiClient.get(`/1/blog`);
  return response.data.value || response.data.data || response.data;
};

export const getPostById = async (id) => {
  const response = await apiClient.get(`/1/blog/${id}`);
  return response.data.value || response.data.data || response.data;
};

export const deletePostById = async (id) => {
  const response = await apiClient.delete(`/1/blog/${id}`);
  return response.data;
};

export const updatePost = async (id, title, content) => {
  const response = await apiClient.put(`/1/blog/${id}`, { title, content });
  return response.data;
};

// [AI 이어쓰기] - 위니브 OpenAI 프록시 버전 (API 키 불필요!)
export const continueWriting = async (content) => {
  const response = await fetch(
    "https://dev.wenivops.co.kr/services/openai-api",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          role: "system",
          content:
            "assistant는 블로그 글쓰기를 도와주는 작가이다. 원문의 말투와 분위기를 유지하며 자연스럽게 이어쓴다.",
        },
        {
          role: "user",
          content: `다음 글을 자연스럽게 이어서 2~3문단 분량으로 써주세요:\n\n${content}`,
        },
      ]),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("AI 요청 실패");
  }

  return { continuation: data.choices[0].message.content };
};
