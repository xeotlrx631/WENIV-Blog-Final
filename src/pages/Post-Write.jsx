import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPost,
  getPostById,
  updatePost,
  continueWriting,
} from "../api/post";
// 스타일링을 위해 나중에 Write.css 파일을 만들어 연결하세요.
// import "./Write.css";

export default function Write() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // 상세 페이지 ID 정제 로직 (어제 겪었던 422 에러 방지)
      const cleanId = id.split(":")[0];
      getPostById(cleanId)
        .then((data) => {
          setTitle(data.title || "");
          setContent(data.content || "");
        })
        .catch((err) => {
          console.error("데이터 로드 실패:", err);
          alert("글을 불러오는데 실패했습니다.");
        });
    }
  }, [id]);

  // [강사님 피드백 반영] AI 이어쓰기 로직 고도화
  const handleAI = async () => {
    if (!content.trim())
      return alert("내용을 먼저 입력해야 AI가 이어쓸 수 있습니다.");

    setIsAILoading(true);
    try {
      const data = await continueWriting(content);

      // 서버 응답 구조가 객체일 경우와 문자열일 경우 모두 대응
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

  const handleSave = async () => {
    try {
      const cleanId = id ? id.split(":")[0] : null;
      if (cleanId) {
        await updatePost(cleanId, title, content);
        alert("수정이 완료되었습니다.");
      } else {
        await createPost(title, content);
        alert("글이 발행되었습니다.");
      }
      navigate("/");
    } catch (error) {
      console.error("저장 중 에러 발생:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div
      className="write-container"
      style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}
    >
      <header className="write-header" style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {id ? "📝 글 수정하기" : "✍️ 새 글 작성하기"}
        </h1>
      </header>

      <div className="input-group">
        <input
          className="write-title-input"
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginBottom: "20px",
          }}
        />
      </div>

      <div className="textarea-group" style={{ position: "relative" }}>
        <textarea
          className="write-content-area"
          placeholder="당신의 이야기를 들려주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            height: "400px",
            padding: "15px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            lineHeight: "1.6",
            resize: "none",
          }}
        />

        {/* AI 버튼을 텍스트박스 내부 하단에 배치 (피그마 스타일) */}
        <button
          className={`ai-button ${isAILoading ? "loading" : ""}`}
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
        className="write-actions"
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="cancel-btn"
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
          className="save-btn"
          onClick={handleSave}
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
          {id ? "수정 완료" : "발행하기"}
        </button>
      </div>
    </div>
  );
}
