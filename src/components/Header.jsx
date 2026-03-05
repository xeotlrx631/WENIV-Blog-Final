import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  // 로컬스토리지의 access_token 존재 여부로 로그인 판단
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "10px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "10px",
      }}
    >
      <button onClick={() => navigate("/")} style={{ fontWeight: "bold" }}>
        위니브 블로그
      </button>
      <button onClick={() => navigate("/")}>홈</button>
      {!isLoggedIn ? (
        <>
          <button onClick={() => navigate("/login")}>로그인</button>
          <button onClick={() => navigate("/signup")}>회원가입</button>
        </>
      ) : (
        <button onClick={handleLogout}>로그아웃</button>
      )}
    </nav>
  );
}
