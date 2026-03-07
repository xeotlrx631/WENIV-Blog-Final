import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Write from "./pages/Post-Write";
import View from "./pages/Post-View";
import Edit from "./pages/Post-Edit";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post/:id" element={<View />} />

        {/* 수정 페이지 라우트 추가 */}
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <Edit />
            </PrivateRoute>
          }
        />

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
