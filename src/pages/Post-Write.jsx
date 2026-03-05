import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPost,
  getPostById,
  updatePost,
  continueWriting,
} from "../api/post";

export default function Write() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getPostById(id)
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch((err) => {
          console.error("데이터 로드 실패:", err);
        });
    } else {
      setTitle("");
      setContent("");
    }
  }, [id]);

  const handleAI = async () => {
    if (!content.trim()) return alert("내용을 입력해주세요.");
    setIsAILoading(true);
    try {
      const data = await continueWriting(content);
      const aiResponse = data.continuation || data;
      setContent((prev) => prev + "\n\n" + aiResponse);
    } catch (error) {
      // error 변수를 콘솔에 출력하여 경고 제거
      console.error("AI 요청 중 에러 발생:", error);
      alert("AI 연결에 실패했습니다.");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (id) {
        await updatePost(id, title, content);
        alert("수정이 완료되었습니다.");
      } else {
        await createPost(title, content);
        alert("글이 발행되었습니다.");
      }
      navigate("/");
    } catch (error) {
      // error 변수를 콘솔에 출력하여 경고 제거
      console.error("저장 중 에러 발생:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{id ? "글 수정하기" : "글 작성하기"}</h1>
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          height: "300px",
          padding: "10px",
          marginBottom: "10px",
        }}
      />
      <button onClick={handleAI} disabled={isAILoading}>
        {isAILoading ? "AI 작성 중..." : "AI 이어쓰기"}
      </button>
      <button
        onClick={handleSave}
        disabled={!title || !content}
        style={{ marginLeft: "10px" }}
      >
        {id ? "수정 완료" : "발행"}
      </button>
    </div>
  );
}
