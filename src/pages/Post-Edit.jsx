import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost, getPosts } from "../api/post";

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);

        // UUID 형식인지 숫자인지 판별
        const isUUID = id.includes("-");

        if (isUUID) {
          // UUID인 경우 → 전체 목록에서 해당 글 찾기
          const allPosts = await getPosts();
          const actualList = allPosts.data || allPosts;
          const found = actualList.find((p) => p.id === id || p._id === id);
          if (found) {
            setTitle(found.title);
            setContent(found.content);
            setPostData(found);
          } else {
            alert("글 정보를 찾을 수 없습니다.");
            navigate("/");
          }
        } else {
          // 숫자 index인 경우 → 바로 API 호출
          const data = await getPostById(id);
          setTitle(data.title);
          setContent(data.content);
          setPostData(data);
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        alert("글 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      // index가 있으면 index로, 없으면 id(UUID)로 수정
      const updateId = postData?.index || postData?.id || postData?._id || id;
      await updatePost(updateId, title, content);
      alert("글이 성공적으로 수정되었습니다!");
      navigate(`/post/${updateId}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("글 수정에 실패했습니다.");
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
            onClick={handleUpdate}
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
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEdit;
