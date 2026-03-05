import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePostById } from "../api/post";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostById(id)
      .then((data) => setPost(data))
      .catch((err) => console.error("상세 조회 실패:", err));
  }, [id]);

  if (!post) return <div>로딩 중이거나 글이 없습니다.</div>;

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deletePostById(id);
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      {/* 수정하기 버튼: 클릭 시 /write/ID 경로로 이동 */}
      <button onClick={() => navigate(`/write/${id}`)}>수정하기</button>

      {/* 삭제 버튼 */}
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        삭제
      </button>
    </div>
  );
}
