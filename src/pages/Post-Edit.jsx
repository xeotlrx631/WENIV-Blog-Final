import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/post";

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // [중요] 로그인 여부 체크 및 데이터 로드
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        alert("글 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, title, content);
      alert("글이 성공적으로 수정되었습니다!");
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("글 수정에 실패했습니다.");
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>데이터를 불러오는 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>글 수정하기</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
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
          required
          style={{
            display: "block",
            width: "100%",
            height: "200px",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default PostEdit;
