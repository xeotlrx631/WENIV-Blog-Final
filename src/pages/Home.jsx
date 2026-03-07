import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api/post";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then((res) => {
        const actualList = res.data || res;
        setPosts(Array.isArray(actualList) ? actualList : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 로드 실패:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>블로그 목록</h1>
      <Link
        to="/write"
        style={{ display: "inline-block", marginBottom: "20px" }}
      >
        글쓰기
      </Link>

      {posts.length === 0 ? (
        <p>아직 작성된 글이 없습니다.</p>
      ) : (
        posts.map((post) => {
          // ✅ 숫자 index 우선 사용, 없으면 _id, id 순으로 대응
          const targetId = post.index || post._id || post.id;

          return (
            <div
              key={targetId}
              style={{
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <Link to={`/post/${targetId}`}>
                <h3 style={{ margin: "0 0 10px 0" }}>{post.title}</h3>
              </Link>
              <p style={{ margin: 0, color: "#666" }}>
                작성자: {post.author || "익명"}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
