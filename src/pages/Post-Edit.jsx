import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createPost, continueWriting } from "../api/post";

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    // Post-View에서 state로 넘겨준 원본 내용 불러오기
    if (location.state?.originalTitle) {
      setTitle(location.state.originalTitle);
      setContent(location.state.originalContent);
      setLoading(false);
      return;
    }

    // state가 없으면 홈으로
    alert("잘못된 접근입니다.");
    navigate("/");
  }, [id, navigate, location.state]);

  const handleAI = async () => {
    if (!content.trim())
      return alert("내용을 먼저 입력해야 AI가 이어쓸 수 있습니다.");

    setIsAILoading(true);
    try {
      const data = await continueWriting(content);
      const aiResponse =
        data.continuation || (typeof data === "string" ? data : data.content);
      if (aiResponse) {
        setContent((prev) => prev + "\n\n" + aiResponse);
      } else {
        alert("AI가 적절한 답변을 찾지 못했습니다.");
      }
    } catch (error) {
      console.error("AI 요청 중 에러 발생:", error);
      alert("AI 서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setIsAILoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !content) return alert("제목과 내용을 입력해주세요.");

    try {
      // 기존 글 유지 + 새 글 발행
      await createPost(title, content);
      alert("수정된 글이 발행되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("발행 실패:", error);
      alert("발행에 실패했습니다.");
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>데이터를 불러오는 중...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        📝 글 수정하기
      </h2>
      <div>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />
        <div style={{ position: "relative" }}>
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              height: "400px",
              padding: "15px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              lineHeight: "1.6",
              resize: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleAI}
            disabled={isAILoading}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              padding: "10px 20px",
              backgroundColor: "#7c4dff",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(124, 77, 255, 0.3)",
            }}
          >
            {isAILoading ? "🤖 AI 생각 중..." : "✨ AI 이어쓰기"}
          </button>
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 25px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            onClick={handlePublish}
            disabled={!title || !content}
            style={{
              padding: "12px 25px",
              borderRadius: "8px",
              background: !title || !content ? "#ccc" : "#000",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            발행하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEdit;
