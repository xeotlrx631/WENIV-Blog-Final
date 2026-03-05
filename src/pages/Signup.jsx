import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, password);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (e) {
      alert("회원가입 실패: " + (e.response?.data?.detail || "서버 오류"));
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* 4.1.1: 입력값 채워져야 버튼 활성화 */}
      <button disabled={!username || !password}>가입하기</button>
    </form>
  );
}
