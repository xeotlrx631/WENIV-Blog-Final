import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. 서버에 로그인 요청
      const res = await loginUser(username, password);

      // 2. 서버 응답에서 토큰 추출 (두 가지 케이스 대응)
      const token = res.data.access_token || res.data.token;

      // 3. 토큰이 실제로 존재할 때만 로그인 처리
      if (token) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("username", username);

        alert("로그인 성공!");
        navigate("/");

        // 상단 Header의 버튼 상태(로그아웃으로 변경)를 즉시 반영하기 위해 새로고침
        window.location.reload();
      } else {
        // 토큰이 없는데 에러가 안 난 경우 (드문 케이스)
        alert("로그인 정보가 올바르지 않습니다.");
      }
    } catch (err) {
      // 4. 서버가 에러(401, 404 등)를 보낸 경우
      console.error("로그인 에러 상세:", err);

      // 서버에서 보내주는 구체적인 에러 메시지가 있다면 출력, 없으면 기본 메시지
      const errorMsg =
        err.response?.data?.detail || "아이디 또는 비밀번호를 확인해주세요.";
      alert("로그인 실패: " + errorMsg);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleLogin}>
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", padding: "8px" }}
        />
        <button
          disabled={!username || !password}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
