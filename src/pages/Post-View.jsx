import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePostById } from "../api/post";

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("access_token");
  const loggedInUser = localStorage.getItem("username");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;

        // [해결] 422 에러 방지: ID 뒤에 붙는 ':1' 등 모든 불순물 제거
        const cleanId = id.split(":")[0];
        console.log("정제된 ID로 상세 요청 시도:", cleanId);

        const response = await getPostById(cleanId);

        // 서버 응답이 data 객체 안에 감싸져 있는 경우와 직접 객체인 경우 모두 대응
        const actualData = response?.data || response;

        if (actualData && (actualData.title || actualData.content)) {
          setPost(actualData);
        } else {
          alert("게시글 정보를 찾을 수 없습니다.");
          navigate("/");
        }
      } catch (err) {
        console.error("게시글 상세 로드 에러:", err);
        alert("게시글을 불러오는데 실패했습니다.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const cleanId = id.split(":")[0];
        await deletePostById(cleanId);
        alert("삭제되었습니다.");
        navigate("/");
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 권한이 없거나 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>데이터 로딩 중...</div>;
  if (!post) return null;

  // 작성자 본인 확인 로직
  const isAuthor = isLoggedIn && (post.author === loggedInUser || !post.author);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "40px auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
      }}
    >
      <header
        style={{
          borderBottom: "2px solid #333",
          marginBottom: "20px",
          paddingBottom: "10px",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>{post.title}</h1>
        <div style={{ color: "#888", fontSize: "14px" }}>
          <span>작성자: {post.author || "익명"}</span>
        </div>
      </header>

      <article
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.8",
          minHeight: "300px",
          fontSize: "16px",
          color: "#333",
        }}
      >
        {post.content}
      </article>

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            padding: "10px 20px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          목록으로
        </button>

        {isAuthor && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate(`/write/${id.split(":")[0]}`)}
              style={{
                cursor: "pointer",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              수정하기
            </button>
            <button
              onClick={handleDelete}
              style={{
                cursor: "pointer",
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostView;
