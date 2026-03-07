import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api/post";

export default function Home() {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = localStorage.getItem("username");
  const isLoggedIn = !!localStorage.getItem("access_token");

  // localStorage에서 숨긴 글 id 목록 가져오기
  const getHiddenIds = () => {
    try {
      return JSON.parse(localStorage.getItem("hidden_posts") || "[]");
    } catch {
      return [];
    }
  };

  useEffect(() => {
    getPosts()
      .then((res) => {
        const actualList = res.value || res.data || res;
        const posts = Array.isArray(actualList) ? actualList : [];
        const hiddenIds = getHiddenIds();

        // 내가 쓴 글(index null) + 숨김 처리 안 된 글만 필터
        const filtered = posts.filter((post) => {
          const postId = post.id || post._id;
          const isMyPost =
            !post.index && (post.author === loggedInUser || !post.author);
          const isHidden = hiddenIds.includes(postId);
          return isMyPost && !isHidden;
        });

        setMyPosts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 로드 실패:", err);
        setLoading(false);
      });
  }, [loggedInUser]);

  const handleDelete = (post) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const postId = post.id || post._id;
    const hiddenIds = getHiddenIds();

    // localStorage에 숨김 처리
    localStorage.setItem(
      "hidden_posts",
      JSON.stringify([...hiddenIds, postId]),
    );

    // 화면에서 즉시 제거
    setMyPosts((prev) => prev.filter((p) => (p.id || p._id) !== postId));
    alert("삭제되었습니다.");
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          로그인 후 내 글을 확인할 수 있습니다.
        </p>
        <Link
          to="/login"
          style={{
            padding: "10px 20px",
            backgroundColor: "#000",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          로그인하기
        </Link>
      </div>
    );
  }

  if (loading) return <div style={{ padding: "20px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>내 블로그 목록</h1>
      <Link
        to="/write"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#000",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        ✍️ 글쓰기
      </Link>

      {myPosts.length === 0 ? (
        <p style={{ color: "#666" }}>아직 작성된 글이 없습니다.</p>
      ) : (
        myPosts.map((post) => {
          const postId = post.id || post._id;

          return (
            <div
              key={postId}
              style={{
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link
                to={`/post/${postId}`}
                style={{ textDecoration: "none", color: "inherit", flex: 1 }}
              >
                <h3 style={{ margin: "0 0 6px 0" }}>{post.title}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  작성자: {post.author || loggedInUser || "익명"}
                </p>
              </Link>

              <button
                onClick={() => handleDelete(post)}
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "13px",
                  marginLeft: "10px",
                  flexShrink: 0,
                }}
              >
                삭제
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
