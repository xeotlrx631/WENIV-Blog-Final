import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  console.log("--- 저장소 전체 분석 ---");
  // 1. 모든 키를 배열로 가져옵니다.
  const keys = Object.keys(localStorage);
  console.log("저장된 키 목록:", keys);

  // 2. 각 키의 값을 하나씩 확인합니다.
  keys.forEach((key) => {
    console.log(`키: [${key}] / 값: ${localStorage.getItem(key)}`);
  });

  // 3. 혹시 모를 공백 확인
  const token = localStorage.getItem("access_token");
  console.log("access_token 직접 조회 결과:", token);

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
