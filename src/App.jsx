import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Write from "./pages/Post-Write"; // 통합 사용
import View from "./pages/Post-View";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post/:id" element={<View />} />

        {/* 작성과 수정 모두 하나의 컴포넌트에서 처리 */}
        <Route
          path="/write"
          element={
            <PrivateRoute>
              <Write />
            </PrivateRoute>
          }
        />
        <Route
          path="/write/:id"
          element={
            <PrivateRoute>
              <Write />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
