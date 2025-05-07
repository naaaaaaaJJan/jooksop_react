import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가!
import React from "react";
import "./Login.css";

function Login() {
  const navigate = useNavigate(); // 훅 호출

  const handleLogin = () => {
    // 여기서 로그인 유효성 검사 등 가능
    navigate("/home"); // 로그인 성공 시 홈으로 이동
  };

  return (
    <div className="screen">
      <div className="login-container">
        <h1 className="login-title">BLOGIN</h1>

        <input type="text" placeholder="ID" className="login-input" />
        <input type="password" placeholder="PW" className="login-input" />

        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-links">
          <Link to="/find-id">아이디찾기</Link>
          <Link to="/signup">회원가입</Link>
          <Link to="/find-password">비밀번호 초기화</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;