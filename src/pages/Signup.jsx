import React from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    // 회원가입 처리 후 로그인 페이지로 이동
    navigate("/"); // 또는 "/login"
  };

  return (
    <div className="screen">
      <div className="signup-container">
        <div className="title">회원가입</div>

        <div className="input-box">
          <div className="overlap-group">
            <div className="text-wrapper">이름</div>
          </div>
        </div>

        <div className="input-box">
          <div className="overlap-group">
            <div className="text-wrapper">이메일</div>
          </div>
        </div>

        <div className="input-box">
          <div className="overlap-group">
            <div className="text-wrapper">아이디</div>
            <div className="overlap-group-2">
              <div className="text-wrapper-4">중복확인</div>
            </div>
          </div>
        </div>

        <div className="input-box">
          <div className="overlap-group">
            <div className="text-wrapper">비밀번호</div>
            <div className="text-wrapper-3">8자리 이상</div>
          </div>
        </div>

        <div className="input-box">
          <div className="overlap-group">
            <div className="text-wrapper">비밀번호 확인</div>
          </div>
        </div>

        <div className="button-box" onClick={handleSignup}>
          <div className="overlap-group-2">
            <div className="text-wrapper-4">가입하기</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;