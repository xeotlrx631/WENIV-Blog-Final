import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPost,
  getPostById,
  updatePost,
  continueWriting,
  getPosts,
} from "../api/post";

export default function Write() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const isUUID = id.includes("-");

        if (isUUID) {
          // UUID인 경우 → 전체 목록에서 해당 글 찾기
          const allPosts = await getPosts();
          const actualList = allPosts.data || allPosts;
          const found = actualList.find((p) => p.id === id || p._id === id);
          if (found) {
            setTitle(found.title || "");
            setContent(found.content || "");
          } else {
            alert("글을 불러오는데 실패했습니다.");
          }
        } else {
          // 숫자 index인 경우 → 바로 API 호출
          const data = await getPostById(id);
          setTitle(data.title || "");
          setContent(data.content || "");
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        alert("글을 불러오는데 실패했습니다.");
      }
    };
    fetchPost();
  }, [id]);

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

  const handleSave = async () => {
    try {
      if (id) {
        // 수정인 경우
        const isUUID = id.includes("-");
        let updateId = id;

        if (isUUID) {
          // UUID면 목록에서 index 찾기
          const allPosts = await getPosts();
          const actualList = allPosts.data || allPosts;
          const found = actualList.find((p) => p.id === id || p._id === id);
          updateId = found?.index || id;
        }

        await updatePost(updateId, title, content);
        alert("수정이 완료되었습니다.");
        navigate(`/post/${updateId}`);
      } else {
        // 새 글 작성인 경우 → 응답에서 index 추출
        const response = await createPost(title, content);
        console.log("글 작성 응답:", response);

        // 서버 응답에서 index 추출
        const newIndex = response?.index || response?.data?.index;

        alert("글이 발행되었습니다.");
        if (newIndex) {
          navigate(`/post/${newIndex}`);
        } else {
          navigate("/");
        }
      }
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
